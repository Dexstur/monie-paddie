import { styled } from "styled-components";
import { InputField, InputHead, Label } from "../signup/Signup.style";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Wrapper,
  Top,
  LogoWrap,
  Logo,
  TopMessage,
} from "../sendMoney/BankTransfer.style";
import Api from "../../api.config";

const Msg = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #737373;
`;

const CreateBtn = styled.button`
  width: 100%;
  height: 52px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  padding: 12px 32px;
  margin-top: 10px;
  text-align: center;
  border: none;
  background-color: var(--Pri-Color);

  &:hover {
    opacity: 0.8;
  }
`;

const SelectField = styled.select`
  width: 100%;
  font-size: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  color: #000;

  &:focus {
    outline: none;
    border: 2px solid var(--Pri-Color);
  }

  @media (min-width: 768px) {
    padding: 16px 12px;
  }
`;

interface BuyAirtimeprops {
  display?: boolean;
  success?: () => void;
}

function BuyAirtime({ display = true, success = () => null }: BuyAirtimeprops) {
  const [formData, setFormData] = useState({
    network: "",
    phoneNumber: "",
    amount: "",
    transactionPin: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [buttonText, setButtonText] = useState("Proceed");

  useEffect(() => {
    if (submitting) {
      setButtonText("Sending...");
    } else {
      setButtonText("Proceed");
    }
  }, [submitting]);
  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    Api.post("/transactions/airtime", formData)
      .then(() => {
        setSubmitting(false);
        setFeedback("Airtime bought successfully");
        success();
      })
      .catch(() => {
        setFeedback("Airtime purchase failed");
      })
      .finally(() => {
        setSubmitting(false);
        setFormData({
          network: "",
          phoneNumber: "",
          amount: "",
          transactionPin: "",
        });
        setTimeout(() => {
          setFeedback("");
        }, 3000);
      });
  }

  return (
    <Wrapper show={display}>
      <Top>
        <LogoWrap>
          <Logo src="/Phone.png" alt="airtime" />
        </LogoWrap>
        <TopMessage>Enter your details to buy airtime </TopMessage>
      </Top>
      <form onSubmit={handleSubmit}>
        <div className="my-1">
          <InputHead>
            <Label htmlFor="network">Network</Label>
          </InputHead>
          <SelectField
            id="network"
            name="network"
            value={formData.network}
            onChange={handleChange}
            required
          >
            <option value=""> -- Select network -- </option>
            <option value="mtn">Mtn</option>
            <option value="glo">Glo</option>
            <option value="airtel">Airtel</option>
            <option value="9mobile">9mobile</option>
          </SelectField>
        </div>
        <div className="my-1">
          <InputHead>
            <Label htmlFor="phonenumber">Phone Number</Label>
          </InputHead>
          <InputField
            id="phonenumber"
            name="phoneNumber"
            placeholder="08099999123"
            type="number"
            value={formData.phoneNumber}
            onChange={handleChange}
            minLength={11}
            maxLength={11}
            required
          />
        </div>

        <div className="m-1">
          <InputHead>
            <Label htmlFor="amount">Amount</Label>
          </InputHead>
          <InputField
            id="amount"
            name="amount"
            placeholder="100"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            min={1}
            max={20000}
            required
          />
        </div>

        <div className="m-1">
          <InputHead>
            <Label htmlFor="pin">Pin</Label>
          </InputHead>
          <InputField
            id="pin"
            name="transactionPin"
            placeholder="Enter transaction pin"
            type="password"
            value={formData.transactionPin}
            onChange={handleChange}
            minLength={4}
            maxLength={4}
            required
          />
        </div>
        <br></br>
        <CreateBtn disabled={submitting} type="submit">
          {buttonText}
        </CreateBtn>
      </form>
      <Msg>{feedback}</Msg>
    </Wrapper>
  );
}

export default BuyAirtime;
