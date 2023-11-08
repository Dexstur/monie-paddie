import { styled } from "styled-components";

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

interface ErrorProps {
  message: string;
}

function ErrorPage({ message }: ErrorProps) {
  return (
    <Wrapper>
      <h1>Error</h1>
      <h3>{message}</h3>
    </Wrapper>
  );
}

export default ErrorPage;
