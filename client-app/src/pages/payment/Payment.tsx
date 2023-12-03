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
                Send money quickly and securely to anyone, anywhere. Whether
                it's sending a gift, or you're short on cash and need to settle
                an expense, our seamless online transfer service makes it easy.
                Experience the convenience of instant money transfers with just
                a few clicks.
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
                Stay connected effortlessly by topping up your mobile airtime
                with our convenient service. Purchase airtime for your phone or
                for loved ones just enter the network and phone number. Enjoy
                seamless communication and never run out of talk time.
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
                Enhance your online experience by easily purchasing mobile data
                for internet browsing. Stay connected, stream content, and
                browse your favorite websites with our hassle-free data buying
                service.
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
                Simplify your life by easily paying your electricity bills
                online. Skip the queues and avoid the hassle of traditional
                payment methods. Experience the convenience of secure and swift
                electricity bill payments.
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
