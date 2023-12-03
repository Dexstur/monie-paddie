import Layout from "../../components/Layout";
import Api from "../../api.config";
import CreatePin from "../../components/modals/TransactionPin";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../screens/Loading";
import ErrorPage from "../screens/Error";

function ChangePinPage() {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    Api.get("/users/dashboard")
      .then((res) => {
        const { message } = res.data;
        setData(message);
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
      <Layout activeNav="settings" history={["Settings", "Change Pin"]}>
        <CreatePin display={true} dismiss={() => null} />
        <div style={{ padding: "24px" }}>
          <h2>Change Transaction Pin</h2>
        </div>
      </Layout>
    );
  }

  if (errorMessage) {
    setTimeout(() => {
      navigate("/login");
    }, 1200);
    return <ErrorPage message={errorMessage} />;
  }

  return <Loading />;
}

export default ChangePinPage;
