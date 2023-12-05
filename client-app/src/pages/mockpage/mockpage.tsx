import { styled } from "styled-components";
import landingImage from "/landing.jpeg";
import { useNavigate } from "react-router-dom";
import { StylishText } from "../signup/Signup.style";

const Navbar = styled.div`
  width: 100%;
  height: 68px;
  padding: 12px 16px;
  background-color: #fff;
  color: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: var(--Pri-Light);
  padding: 40px;
`;

const Clear = styled.div`
  width: 100%;
  height: 68px;
`;

const Wrap = styled.div`
  width: 84%;
  max-width: 1280px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const WriteUp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  flex: 1;
`;

const Title = styled.h2`
  font-size: 3.5rem;
  font-family: "Inter";
  font-weight: 600;
  color: black;

  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #3165a6b0;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    font-size: 1rem;
  }
`;

const ImgCont = styled.div`
  flex: 1;
`;

const RoundedImage = styled.img`
  border-radius: 20px 20px 20px 20px;
  border: 2px solid var(--Pri-Color);
  width: 100%;
  height: auto;
  max-width: 600px;
`;

const Button = styled.button`
  padding: 0.625em 1.25em; /* Updated suggestion 3 */
  font-size: 1rem;
  background-color: var(--Pri-Color);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
  @media (max-width: 600px) {
    font-size: 0.9rem;
  }
`;

function MockPage() {
  const navigate = useNavigate();
  return (
    <Container>
      <Navbar>
        <StylishText>MONIE PADDY</StylishText>
      </Navbar>
      <Clear />
      <Wrap>
        <WriteUp>
          <Title>SWIFT PAYMENT</Title>
          <Description>
            Experience unparalleled freedom with MoniePaddie where payments
            become seamless, transfers are quick,and you can recharge airtime &
            data top-ups. Benefit from our 100% network uptime, ensuring swift
            and reliable transactions, allowing you to make payments in seconds
            without the risk of transaction failures. Choose MoniePaddie for a
            better life.
          </Description>
          <Button onClick={() => navigate("/login")}>Get Started</Button>
        </WriteUp>
        <ImgCont>
          <RoundedImage src={landingImage} alt="load img" />
        </ImgCont>
      </Wrap>
    </Container>
  );
}

export default MockPage;
