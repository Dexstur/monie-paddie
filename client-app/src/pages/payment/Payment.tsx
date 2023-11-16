import Layout from "../../components/Layout";
import ErrorPage from "../screens/Error";
import Loading from "../screens/Loading";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../api.config";
import {
  Wrapper,
  Option,
  Top,
  OptionText,
  Logo,
  OptionTitle,
} from "./Payment.style";
import Wallet from "/Wallet.png";
import Bolt from "/Bolt.png";
import Connect from "/Connection.png";
import Phone from "/Phone.png";

function PaymentPage() {
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
      <Layout activeNav="payment" history={["Payment"]}>
        <Wrapper>
          <Option href="/send-money">
            <Top>
              <Logo src={Wallet} alt="load img" />
              <OptionTitle>Send Money</OptionTitle>
            </Top>
            <div style={{ height: "70px" }}>
              <OptionText>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s
              </OptionText>
            </div>
          </Option>
          <Option href="/buy-airtime">
            <Top>
              <Logo src={Phone} alt="load img" />
              <OptionTitle>Buy Airtime</OptionTitle>
            </Top>
            <div style={{ height: "70px" }}>
              <OptionText>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's
              </OptionText>
            </div>
          </Option>
          <Option href="/buy-data">
            <Top>
              <Logo src={Connect} alt="load img" />
              <OptionTitle>Buy Data</OptionTitle>
            </Top>
            <div style={{ height: "70px" }}>
              <OptionText>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the
              </OptionText>
            </div>
          </Option>
          <Option href="#">
            <Top>
              <Logo src={Bolt} alt="load img" />
              <OptionTitle>Buy Electricity</OptionTitle>
            </Top>
            <div style={{ height: "70px" }}>
              <OptionText>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
              </OptionText>
            </div>
          </Option>
        </Wrapper>
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

export default PaymentPage;
