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
import { useNavigate } from "react-router-dom";
import Api from "../../api.config";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

function LoginPage() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const login = useGoogleLogin({
    onSuccess: (codeResponse: { access_token: string }) => {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          Api.post(`/auth/google/redirect`, res.data)
            .then((response) => {
              const { message, registered } = response.data;
              console.log(registered);
              if (registered) {
                navigate("/dashboard");
              } else {
                navigate("/register");
              }
              console.log(message);
              setSubmitting(false);
            })
            .catch((err) => {
              if (err.response) {
                const errorCode = err.response.status;
                console.log(`auth failed with status code: ${errorCode}`);
              } else {
                console.log(err);
              }
              setSubmitting(false);
              // navigate("/users/signup");
            });
        })
        .catch((err) => {
          console.log(err);
          console.error("Setup failed: backend response");
          setSubmitting(false);
          // navigate("/users/signup");
        });
    },
    onError: (error) => {
      console.log("Login Failed: Bad Setup", error);
      // navigate("/");
      setSubmitting(false);
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!submitting) {
      setSubmitting(true);
      console.log("submitting form");
      Api.post("/auth/login", loginData)
        .then((res) => {
          const { message } = res.data;
          console.log(message);
          console.log("login successful");
          setLoginData({ email: "", password: "" });
          setSubmitting(false);
          navigate("/dashboard");
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

  function googlePassport() {
    if (!submitting) {
      setSubmitting(true);
      login();
    }
  }

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
          <GoogleSignin href={`#`} onClick={googlePassport}>
            <GooglesLogo src={googleLogo} alt="google logo" />
            Sign in with Google
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
