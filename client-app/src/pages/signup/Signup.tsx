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
  Text,
} from "./Signup.style";
import googleLogo from "/google-logo.png";
import { FormEvent, useState, ChangeEvent } from "react";
import Api from "../../api.config";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
// import { InputFieldWeb } from "./InputFieldWeb";

function SignUpPage() {
  const navigate = useNavigate();
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!submitting) {
      setSubmitting(true);
      console.log("submitting form");
      Api.post("/auth/signup", signupData)
        .then((res) => {
          const { message } = res.data;
          console.log(message);
          console.log("login successful");
          setSignupData({
            email: "",
            password: "",
            fullname: "",
            bvn: "",
            phoneNumber: "",
          });
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
          setSignupData({
            email: "",
            password: "",
            fullname: "",
            bvn: "",
            phoneNumber: "",
          });
          setSubmitting(false);
        });
    }
    console.log("Form submitted");
  }

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
  function googlePassport() {
    if (!submitting) {
      setSubmitting(true);
      login();
    }
  }
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    fullname: "",
    phoneNumber: "",
    bvn: "",
  });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  }
  return (
    <Wrapper>
      <div className="row">
        <SignupSide className="col col-12 col-lg-5">
          <StylishText>Monie Paddy</StylishText>
          <RegisterBox className="my-4">
            <h2 style={{ fontSize: "32px" }}>Sign Up</h2>
            <p style={{ fontSize: "16px" }}>
              Create an account to enjoy our benefits
            </p>
          </RegisterBox>
          <GoogleSignin href={`#`} onClick={() => googlePassport()}>
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
                <Label htmlFor="fullname">Full Name</Label>
              </InputHead>
              <InputField
                id="fullname"
                placeholder="John Doe"
                type="text"
                name="fullname"
                onChange={handleChange}
                value={signupData.fullname}
                required
              />
            </div>
            <div className="my-3">
              <InputHead>
                <Label htmlFor="email">Email</Label>
              </InputHead>
              <InputField
                id="email"
                placeholder="name@example.com"
                type="email"
                name="email"
                onChange={handleChange}
                value={signupData.email}
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
                onChange={handleChange}
                value={signupData.phoneNumber}
                required
              />
            </div>
            <div className="my-3">
              <InputHead>
                <Label htmlFor="bvn">Bvn</Label>
              </InputHead>
              <InputField
                id="bvn"
                placeholder="22516146577"
                type="number"
                name="bvn"
                onChange={handleChange}
                value={signupData.bvn}
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
                onChange={handleChange}
                value={signupData.password}
                name="password"
                required
              />
            </div>
            <div className="mt-5">
              <SubmitForm type="submit">Sign Up</SubmitForm>
            </div>
          </form>
          <div className="d-flex" style={{ gap: "8px" }}>
            <p>Already a member?</p>
            <ExtLink href="/login">Sign In</ExtLink>
          </div>
        </SignupSide>
        <FounderSide className="col col-12 col-lg-7">
          {/* <p>Founder message here</p> */}
          <Text>
            It takes 20 years to build a reputation and five minutes to ruin it.
            If you think about that, you’ll do things differently.
          </Text>
          <strong className="py-7 px-4"> - Boluwatife</strong>
          <p className="p-4"> Founder, Pay-buddy</p>
        </FounderSide>
      </div>
    </Wrapper>
  );
}

export default SignUpPage;
