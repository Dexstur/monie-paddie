import { styled } from "styled-components";
import { useState } from "react";

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

function Loading() {
  const [text, setText] = useState("Loading.");

  setInterval(() => {
    if (text === "Loading...") {
      setText("Loading.");
    } else {
      setText(text + ".");
    }
  }, 1000);

  return (
    <Wrapper>
      <h3>{text}</h3>
    </Wrapper>
  );
}

export default Loading;
