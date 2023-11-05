import styled from "styled-components";
import { AiTwotoneHome, AiFillSetting } from "react-icons/ai";
import { BsStack } from "react-icons/bs";

const Wrapper = styled.div<{ show: boolean }>`
  width: 180px;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  display: ${({ show }) => (show ? "block" : "none")};
  background-color: #fff;
  padding-top: 68px;

  @media (min-width: 768px) {
    display: block;
    width: 240px;
  }
`;

const NavWrap = styled.div`
  width: 80%;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const NavItem = styled.div<{ active: boolean }>`
  text-decoration: none;
  display: flex;
  padding: 8px 12px;
  width: 100%;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#e3f1fe" : "#fff")};
  color: ${({ active }) => (active ? "#00afb9" : "#727372")};
  gap: 16px;
  align-items: center;
`;

interface SidebarProps {
  show: boolean;
  activeNav?: "home" | "payment" | "settings";
}

function SideBar({ show, activeNav = "home" }: SidebarProps) {
  return (
    <Wrapper show={show} className="sidebar">
      <NavWrap>
        <NavItem active={activeNav === "home"}>
          <AiTwotoneHome size={24} />
          <span>Home</span>
        </NavItem>
        <NavItem active={activeNav === "payment"}>
          <BsStack size={24} />
          <span>Payment</span>
        </NavItem>
        <NavItem active={activeNav === "settings"}>
          <AiFillSetting size={24} />
          <span>Settings</span>
        </NavItem>
      </NavWrap>
    </Wrapper>
  );
}

export default SideBar;
