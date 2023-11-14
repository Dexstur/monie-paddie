import Layout from "../../components/Layout";
import Api from "../../api.config";
import { useEffect, useState } from "react";
import Loading from "../screens/Loading";
import ErrorPage from "../screens/Error";
import BuyAirtime from "./BuyAirtime";
import SuccessModal from "../../components/modals/successModal";

function BuyAirtimedash() {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [successTitle, setSuccessTitle] = useState("");

  function handleSuccess() {
    setSuccessMessage("Airtime bought successfully");
    setSuccessTitle("Purchase Successful");
    setSuccess(true);
  }

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
      <Layout activeNav="payment" history={["Payment", "Buy Airtime"]}>
        <SuccessModal
          show={success}
          message={successMessage}
          title={successTitle}
          id="success-modal"
          handleClose={() => setSuccess(false)}
        />
        <div style={{ padding: "40px 0" }}>
          <BuyAirtime display={true} success={handleSuccess} />
        </div>
      </Layout>
    );
  }

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return <Loading />;
}

export default BuyAirtimedash;
