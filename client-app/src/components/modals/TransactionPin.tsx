import { styled } from "styled-components";
import { InputField, InputHead, Label } from "../../pages/signup/Signup.style";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Api from "../../api.config";

const Wrapper = styled.div<{ show: boolean }>`
  width: 316px;
  height: auto;
  padding: 24px;
  position: absolute;
  z-index: 400;
  margin: 0 auto;
  top: 50%;
  left: 50%;
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

const Heading = styled.h5`
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
`;

const Msg = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #737373;
`;

const CreateBtn = styled.button`
  width: 120px;
  height: 52px;
  padding: 12px 32px;
  text-align: center;
  border: none;
  border-radius: 8px;
  background-color: var(--Pri-Color);
`;

interface CreatePinProps {
  display: boolean;
  dismiss: () => void;
}

function CreatePin({ display, dismiss }: CreatePinProps) {
  const [formData, setFormData] = useState({
    transactionPin: "",
    pinConfirmation: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [buttonText, setButtonText] = useState("Create");

  useEffect(() => {
    if (submitting) {
      setButtonText("Creating...");
    } else {
      setButtonText("Create");
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
      if (formData.transactionPin !== formData.pinConfirmation) {
        setFeedback("Pin mismatch");
        return;
      }
      setSubmitting(true);
      Api.put("/users/create-pin", formData)
        .then(() => {
          setFeedback("Pin created successfully");
          setSubmitting(false);
          setFormData({
            transactionPin: "",
            pinConfirmation: "",
          });
          setTimeout(() => {
            setFeedback("");
            dismiss();
          }, 1500);
        })
        .catch(() => {
          setFeedback("Pin creation failed");
          setSubmitting(false);
        });
    }
  }

  return (
    <Wrapper show={display}>
      <div>
        <Heading>Create Transaction Pin</Heading>
        <Msg>
          Create a transaction pin to be able to make secured transaction
        </Msg>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="my-3">
          <InputHead>
            <Label htmlFor="transactionPin">Create Pin</Label>
          </InputHead>
          <InputField
            id="transactionPin"
            name="transactionPin"
            placeholder="4 digit transaction pin"
            type="password"
            value={formData.transactionPin}
            onChange={handleChange}
            minLength={4}
            maxLength={4}
            required
          />
        </div>
        <div className="my-3">
          <InputHead>
            <Label htmlFor="pinConfirmation">Confirm Pin</Label>
          </InputHead>
          <InputField
            id="pinConfirmation"
            name="pinConfirmation"
            placeholder="4 digit transaction pin"
            type="password"
            value={formData.pinConfirmation}
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

export default CreatePin;
