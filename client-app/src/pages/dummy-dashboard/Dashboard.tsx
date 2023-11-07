import Layout from "../../components/Layout";
import Api from "../../api.config";
import { useEffect, useState } from "react";
import Loading from "../screens/Loading";
import ErrorPage from "../screens/Error";
import CreatePin from "../../components/modals/TransactionPin";

function MockDashboard() {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [popModal, setPopModal] = useState(false);

  useEffect(() => {
    Api.get("/users/dashboard")
      .then((res) => {
        const { message, setPin } = res.data;
        setData(message);
        if (!setPin) {
          setPopModal(true);
        }
      })
      .catch((err) => {
        if (err.response) {
          const { message } = err.response.data;
          setErrorMessage(message);
        } else {
          setErrorMessage("No response from server");
        }
      });
  }, []);

  if (data) {
    return (
      <Layout>
        <CreatePin display={popModal} dismiss={() => setPopModal(false)} />
        <h1>Mock Dashboard</h1>
        <p>Note: this is a mock dashboard just to test login functionality.</p>
        <p>You are seeing this because you logged in successfully.</p>
      </Layout>
    );
  }

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return <Loading />;
}

export default MockDashboard;
