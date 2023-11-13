import { styled } from "styled-components";
import { HiBell } from "react-icons/hi";
import { FaBars } from "react-icons/fa";
import pic3 from "../assets/pic3.jpg";

const TopBar = styled.header`
  width: 100%;
  height: 68px;
  padding: 20px 16px 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  background-color: #fff;
  top: 0;
  z-index: 800;

  @media (min-width: 768px) {
    justify-content: space-evenly;
    height: 80px;
  }
`;

const TopSection = styled.div`
  width: 33%;
  min-width: 120px;
`;

const StylishText = styled.h1`
  font-family: "Holtwood One SC", cursive;
  color: var(--Pri-Color);
  font-size: 18px;
  font-weight: 400;

  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const NavToggle = styled.button`
  display: flex;
  place-items: center;
  border-radius: 8px;
  padding: 4px;
  height: 36px;
  width: 36px;
  text-align: center;
  background-color: var(--Pri-Color);
  color: #e2f1ff;
  outline: none;

  @media (min-width: 768px) {
    display: none;
  }
`;

const NavHistory = styled.div`
  width: 33%;
  display: none;
  justify-content: center;
  font-size: 16px;

  @media (min-width: 768px) {
    display: flex;
    gap: 12px;
  }
`;

const TrackItem = styled.div<{ highlight: boolean }>`
  color: ${({ highlight }) => (highlight ? "#283ea7" : "#bdbdbd")};
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TrackDot = styled.span<{ highlight: boolean }>`
  display: ${({ highlight }) => (highlight ? "block" : "none")};
`;

const BellWrap = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 12px;
  text-align: center;
  background-color: #e2f1ff;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const ProfilePic = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

// const SuccessButton = styled.button`
//   // Add your styles here
// `;

interface HeaderProps {
  toggleSidebar: () => void;
  history?: string[];
}

function Header({ toggleSidebar, history = ["Home"] }: HeaderProps) {
  const lastIndex = history.length - 1;
  return (
    <TopBar>
      <TopSection
        style={{ display: "flex", gap: "12px", alignItems: "center" }}
      >
        <NavToggle onClick={() => toggleSidebar()}>
          <FaBars size={24} />
        </NavToggle>
        <StylishText>Monie Paddy</StylishText>
      </TopSection>
      <NavHistory>
        {history.map((item, index) => (
          <TrackItem key={item} highlight={index === lastIndex}>
            <div>{item}</div>
            <TrackDot highlight={index === lastIndex}>•</TrackDot>
          </TrackItem>
        ))}
      </NavHistory>
      <TopSection
        style={{
          gap: "20px",
          textAlign: "right",
        }}
      >
        <BellWrap className="mx-2">
          <HiBell size={24} color={"#00afb9"} />
        </BellWrap>
        <span className="mx-2">
          <ProfilePic src={pic3} alt="profile picture" />
        </span>
      </TopSection>
    </TopBar>
  );
}

export default Header;
