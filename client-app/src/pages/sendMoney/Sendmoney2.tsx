import { styled } from "styled-components";
import { InputField, InputHead, Label } from "../signup/Signup.style";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Api from "../../api.config";

const Wrapper = styled.div<{ show: boolean }>`
  width: 600px;
  height: 800px;
  padding: 24px;
  position: absolute;
  z-index: 400;
  margin: 0 auto;
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);

  right: auto;
  display: ${({ show }) => (show ? "flex" : "none")};
  flex-direction: column;
  gap: 16px;
  background-color: #fff;
  border-radius: 8px;

  @media (min-width: 768px) {
    width: 616px;
    height: 500px;
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

interface Sendmoney2props {
  display: boolean;
  dismiss: () => void;
}

function Sendmoney2({ display, dismiss }: Sendmoney2props) {
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountName: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [buttonText, setButtonText] = useState("Pay");

  useEffect(() => {
    if (submitting) {
      setButtonText("Sending...");
    } else {
      setButtonText("Pay");
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
        <Msg>Enter your details to send money </Msg>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="my-1">
          <InputHead>
            <Label htmlFor="note">Note (optional)</Label>
          </InputHead>
          <InputField
            id="note"
            name="note"
            placeholder="Enter a transaction note"
            type="text"
          />
        </div>
        <div className="my-1">
          <InputHead>
            <Label htmlFor="amount">Amount</Label>
          </InputHead>
          <InputField
            id="amount"
            name="amount"
            placeholder="Enter An Amount"
            type="number"
            value={formData.accountNumber}
            onChange={handleChange}
            minLength={4}
            maxLength={14}
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
            placeholder="Enter Transaction Pin"
            type="number"
            value={formData.accountNumber}
            onChange={handleChange}
            minLength={4}
            maxLength={4}
            required
          />
        </div>

        <CreateBtn type="submit">{buttonText}</CreateBtn>
      </form>
      <Msg>{feedback}</Msg>
    </Wrapper>
  );
}

export default Sendmoney2;
