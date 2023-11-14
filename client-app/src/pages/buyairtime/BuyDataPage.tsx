import Layout from "../../components/Layout";
import Api from "../../api.config";
import { useEffect, useState } from "react";
import Loading from "../screens/Loading";
import ErrorPage from "../screens/Error";
import Buydata from "./buyData";

function BuyDataPage() {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [popModal, setPopModal] = useState(true);

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
      <Layout activeNav="payment" history={["Payment", "Buy Data"]}>
        <Buydata display={popModal} dismiss={() => setPopModal(false)} />
        {/* <Sendmoney2 display={popModal} dismiss={() => setPopModal(false)} /> */}
      </Layout>
    );
  }

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return <Loading />;
}

export default BuyDataPage;