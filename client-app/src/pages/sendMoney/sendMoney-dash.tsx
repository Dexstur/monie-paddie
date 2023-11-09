import Layout from "../../components/Layout";
import Api from "../../api.config";
import { useEffect, useState } from "react";
import Loading from "../screens/Loading";
import ErrorPage from "../screens/Error";
import Sendmoney from "./Sendmoney";
// import Sendmoney2 from "./Sendmoney2";

function Sendmoneydash() {
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
      <Layout activeNav="payment">
        <Sendmoney display={popModal} dismiss={() => setPopModal(false)} />
        {/* <Sendmoney2 display={popModal} dismiss={() => setPopModal(false)} /> */}
      </Layout>
    );
  }

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return <Loading />;
}

export default Sendmoneydash;
