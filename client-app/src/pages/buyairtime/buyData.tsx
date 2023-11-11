import { styled } from "styled-components";
import { InputField, InputHead, Label } from "../signup/Signup.style";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Api from "../../api.config";

const Wrapper = styled.div<{ show: boolean }>`
  width: 600px;
  height: auto;
  padding: 24px;
  position: static;
  z-index: 400;
  margin: 0 auto;
  
  

  right: auto;
  display: ${({ show }) => (show ? "flex" : "none")};
  flex-direction: column;
  gap: 16px;
  background-color: #fff;
  border-radius: 8px;

  @media (min-width: 768px) {
    width: 616px;
    height: auto;
    padding: 40px;
    gap: 24px;
  }
`;

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
`;

interface Buydataprops {
  display: boolean;
  dismiss: () => void;
}

function Buydata({ display, dismiss }: Buydataprops) {
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountName: "",
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
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setFormData({ ...formData, [name]: value });
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!submitting) {
      if (formData.accountNumber !== formData.accountName) {
        setFeedback("Data mismatch");
        return;
      }
      setSubmitting(true);
      Api.put("/users/create-pin", formData)
        .then(() => {
          setFeedback("Account created successfully");
          setSubmitting(false);
          setFormData({
            accountNumber: "",
            accountName: "",
          });
          setTimeout(() => {
            setFeedback("");
            dismiss();
          }, 1500);
        })
        .catch(() => {
          setFeedback("Account creation failed");
          setSubmitting(false);
        });
    }
  }

  return (
    <Wrapper show={display}>
      <div>
        <img src="/images/transfer.svg" alt="transfer" />
        <Msg>Enter your details to buy data</Msg>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="my-1">
          <InputHead>
            <Label htmlFor="network">Network</Label>
          </InputHead>
          <InputField
            id="network"
            name="network"
            placeholder="Select network"
            type="text"
          />
        </div>
        <div className="my-1">
          <InputHead>
            <Label htmlFor="phonenumber">Phone Number</Label>
          </InputHead>
          <InputField
            id="phonenumber"
            name="phonenumber"
            placeholder="08099999123"
            type="number"
            value={formData.accountNumber}
            onChange={handleChange}
            minLength={11}
            maxLength={11}
            required
          />
        </div>

        <div className="m-1">
          <InputHead>
            <Label htmlFor="dataplan">Data Plan</Label>
          </InputHead>
          <InputField
            id="dataplan"
            name="dataplan"
            placeholder="select data plans"
            type="number"
            value={formData.accountName}
            onChange={handleChange}
            minLength={12}
            maxLength={12}
            required
          />
        </div>

        <div className="m-1">
          <InputHead>
            <Label htmlFor="pin">Pin</Label>
          </InputHead>
          <InputField
            id="pin"
            name="pin"
            placeholder="Enter transaction pin"
            type="number"
            value={formData.accountNumber}
            onChange={handleChange}
            minLength={4}
            maxLength={4}
            required
          />
        </div>
      <br></br>
        <CreateBtn  type="submit">{buttonText}</CreateBtn>
      </form>
      <Msg>{feedback}</Msg>
    </Wrapper>
  );
}

export default Buydata;
