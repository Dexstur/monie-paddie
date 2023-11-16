import Layout from "../../components/Layout";
import Api from "../../api.config";
import { useEffect, useState } from "react";
import Loading from "../screens/Loading";
import ErrorPage from "../screens/Error";
import Buydata from "./buyData";
import SuccessModal from "../../components/modals/successModal";

function BuyDataPage() {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function handleSuccess() {
    setSuccessTitle("Congratulations");
    setSuccessMsg("Your data purchase was successful");
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
      <Layout activeNav="payment" history={["Payment", "Buy Data"]}>
        <SuccessModal
          id="successModal"
          show={success}
          title={successTitle}
          message={successMsg}
          handleClose={() => setSuccess(false)}
        />
        <div style={{ padding: "40px 0" }}>
          <Buydata display={true} success={handleSuccess} />
        </div>
      </Layout>
    );
  }

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return <Loading />;
}

export default BuyDataPage;
