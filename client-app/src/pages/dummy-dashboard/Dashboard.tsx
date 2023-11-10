import Layout from "../../components/Layout";
import Api from "../../api.config";
import { useEffect, useState } from "react";
import Loading from "../screens/Loading";
import ErrorPage from "../screens/Error";
import CreatePin from "../../components/modals/TransactionPin";
import { OptionSide, TransactionSide, MoneyDetail } from "./Dashboard.style";
import Balance from "./Balance";
import Funding from "./Funding";
import SuccessModal from "../../components/modals/successModal";

function MockDashboard() {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [popModal, setPopModal] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newFund, setNewFund] = useState(false);

  function fundSuccess() {
    setSuccessTitle(`Congratulations ${username}`);
    setSuccessMessage("You have successfully funded your wallet");
    setShowSuccess(true);
    setNewFund((prev) => !prev);
  }

  useEffect(() => {
    Api.get("/users/dashboard")
      .then((res) => {
        const { message, setPin } = res.data;
        const { email, fullname } = res.data.data;
        setUsername(fullname);
        setUserEmail(email);
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
  useEffect(() => {
    Api.get("/transactions/balance")
      .then((res) => {
        const { data } = res.data;
        setUserBalance(data);
      })
      .catch(() => {
        console.error("could not get balance");
      });
  }, [newFund]);

  if (data) {
    return (
      <Layout>
        <CreatePin display={popModal} dismiss={() => setPopModal(false)} />
        <SuccessModal
          title={successTitle}
          show={showSuccess}
          message={successMessage}
          id="successModal"
          handleClose={() => setShowSuccess(false)}
        />
        <div className="row m-0 p-0" style={{ width: "100%", padding: "0" }}>
          <OptionSide className="col-12 col-lg-8 m-0 p-0">
            <MoneyDetail>
              <Balance balance={userBalance} />
              <div
                style={{
                  height: "186px",
                  width: "312px",
                  backgroundColor: "#fff",
                }}
              ></div>
            </MoneyDetail>
            <div className="my-3" style={{ padding: "0 24px" }}>
              <Funding userEmail={userEmail} success={fundSuccess} />
            </div>
          </OptionSide>
          <TransactionSide className="col-12 col-lg-4"></TransactionSide>
        </div>
      </Layout>
    );
  }

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  return <Loading />;
}

export default MockDashboard;
