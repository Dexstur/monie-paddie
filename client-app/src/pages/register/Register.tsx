import { styled } from "styled-components";
import {
  InputHead,
  Label,
  InputField,
  StylishText,
} from "../signup/Signup.style";
import Api from "../../api.config";
import { ChangeEvent, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  width: 100%;
  max-width: 1680px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
`;

const Modal = styled.div`
  width: 320px;
  padding: 20px 32px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  gap: 12px;
`;

const SubmitForm = styled.button`
  width: 120px;
  height: 40px;
  border: none;
  border-radius: 8px;
  background-color: var(--Pri-Color);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

function Register() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [registerData, setRegisterData] = useState({
    bvn: "",
    phoneNumber: "",
  });
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setRegisterData({ ...registerData, [name]: value });
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!submitting) {
      setSubmitting(true);
      setFeedback("Registering...");
      Api.post("/users/register", registerData)
        .then((res) => {
          const { message } = res.data;
          setFeedback(message);
          setTimeout(() => {
            setSubmitting(false);
            setFeedback("");
            navigate("/dashboard");
          }, 1500);
        })
        .catch((err) => {
          if (err.response) {
            const errorCode = err.response.status;
            if (errorCode === 409) {
              setFeedback("Failed: Registration already completed");
              setTimeout(() => {
                setSubmitting(false);
                setFeedback("");
                navigate("/dashboard");
              }, 1500);
              return;
            }
            setFeedback("Registration failed: Please login");
            setTimeout(() => {
              setSubmitting(false);
              setFeedback("");
              navigate("/login");
            }, 1500);
          } else {
            setFeedback("Failed: No response from server");
            setTimeout(() => {
              setSubmitting(false);
              setFeedback("");
            }, 1500);
          }
        });
    }
  }
  return (
    <Wrapper>
      <StylishText>Monie Paddy</StylishText>
      <Modal>
        <h2 style={{ fontSize: "20px", fontWeight: "600" }}>
          Complete your registration
        </h2>
        <p style={{ fontSize: "14px", color: "#737272", fontWeight: "600" }}>
          Enter your details to complete your registration
        </p>
        <form onSubmit={handleSubmit}>
          <div className="my-3">
            <InputHead>
              <Label htmlFor="bvn">Bvn</Label>
            </InputHead>
            <InputField
              id="bvn"
              placeholder="22516146577"
              type="number"
              name="bvn"
              value={registerData.bvn}
              onChange={handleChange}
              required
            />
          </div>
          <div className="my-3">
            <InputHead>
              <Label htmlFor="phoneNumber">Phone Number</Label>
            </InputHead>
            <InputField
              id="phoneNumber"
              placeholder="0812345678"
              type="tel"
              name="phoneNumber"
              value={registerData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <SubmitForm type="submit">Register</SubmitForm>
        </form>
        <p>{feedback}</p>
      </Modal>
    </Wrapper>
  );
}

export default Register;
