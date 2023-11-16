import styled from "styled-components";
import Sally from "../../assets/Sally.png";

const Refer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: var(--Pri-Sec);
  width: 94%;
  height: 205px;
  flex-shrink: 0;
  border-radius: 8px;
  margin: 24px;
  margin-right: 24px;
  margin-top: 0;
`;

const ReferImg = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  flex-shrink: 0;
`;

export default function Referrals() {
  return (
    <Refer>
      <ReferImg src={Sally} alt="Refer" />
    </Refer>
  );
}
