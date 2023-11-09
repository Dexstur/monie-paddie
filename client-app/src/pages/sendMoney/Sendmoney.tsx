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

interface Sendmoneyprops {
  display: boolean;
  dismiss: () => void;
}

function Sendmoney({ display, dismiss }: Sendmoneyprops) {
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
        <Msg>Enter your details to send money </Msg>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="my-1">
          <InputHead>
            <Label htmlFor="bankName">Bank Name</Label>
          </InputHead>
          <InputField
            id="bankName"
            name="bankName"
            placeholder="Select Bank"
            type="text"
          />
        </div>
        <div className="my-1">
          <InputHead>
            <Label htmlFor="accountNumber">Account Number</Label>
          </InputHead>
          <InputField
            id="accountNumber"
            name="accountNumber"
            placeholder="0122319063"
            type="number"
            value={formData.accountNumber}
            onChange={handleChange}
            minLength={10}
            maxLength={10}
            required
          />
        </div>

        <div className="m-1">
          <InputHead>
            <Label htmlFor="accountName">Account Name</Label>
          </InputHead>
          <InputField
            id="accountName"
            name="accountName"
            placeholder="John Doe"
            type="text"
            value={formData.accountNumber}
            onChange={handleChange}
            minLength={12}
            maxLength={12}
            required
          />
        </div>

        <CreateBtn type="submit">{buttonText}</CreateBtn>
      </form>
      <Msg>{feedback}</Msg>
    </Wrapper>
  );
}

export default Sendmoney;
