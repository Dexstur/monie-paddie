import {
  Wrapper,
  SignupSide,
  FounderSide,
  StylishText,
  RegisterBox,
  GoogleSignin,
  GooglesLogo,
  Strikethrough,
  Strike,
  Or,
  InputHead,
  InputField,
  Label,
  SubmitForm,
  ExtLink,
} from "./Login.style";
import googleLogo from "/google-logo.png";
import { FormEvent, useState, ChangeEvent } from "react";
import Api from "../../api.config";

function LoginPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!submitting) {
      setSubmitting(true);
      console.log("submitting form");
      Api.post("/auth/login", loginData)
        .then((res) => {
          console.log(res.data);
          const { message } = res.data;
          console.log(message);
          console.log("login successful");
          setLoginData({ email: "", password: "" });
          setSubmitting(false);
        })
        .catch((err) => {
          if (err.response) {
            const errorCode = err.response.status;
            console.error(`Problem occured received status: ${errorCode}`);
          } else {
            console.error("Did not receive response");
          }
          console.log("login failed");
          setLoginData({ email: "", password: "" });
          setSubmitting(false);
        });
    }
  }

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  }
  return (
    <Wrapper>
      <div className="row">
        <SignupSide className="col col-12 col-lg-5">
          <StylishText>Monie Paddy</StylishText>
          <RegisterBox className="my-4">
            <h2 style={{ fontSize: "32px" }}>Log In</h2>
            <p style={{ fontSize: "16px" }}>
              Enter your details to access your account
            </p>
          </RegisterBox>
          <GoogleSignin href={`http://localhost:5500/auth/google`}>
            <GooglesLogo src={googleLogo} alt="google logo" />
            Sign up with Google
          </GoogleSignin>
          <Strikethrough className="my-4">
            <Strike />
            <Or>Or</Or>
            <Strike />
          </Strikethrough>
          <form onSubmit={handleSubmit}>
            <div className="my-3">
              <InputHead>
                <Label htmlFor="email">Email</Label>
              </InputHead>
              <InputField
                id="email"
                placeholder="name@example.com"
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="my-3">
              <InputHead>
                <Label htmlFor="password">Password</Label>
              </InputHead>
              <InputField
                id="password"
                placeholder="Password123@"
                type="password"
                name="password"
                minLength={6}
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mt-5">
              <SubmitForm type="submit">Sign In</SubmitForm>
            </div>
          </form>
          <div className="d-flex" style={{ gap: "8px" }}>
            <p>Not a member?</p>
            <ExtLink href="/signup">Sign Up</ExtLink>
          </div>
        </SignupSide>
        <FounderSide className="col col-12 col-lg-7">
          <p>Founder message here</p>
        </FounderSide>
      </div>
    </Wrapper>
  );
}

export default LoginPage;
