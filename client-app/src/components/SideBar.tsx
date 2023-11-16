import styled from "styled-components";
import { AiTwotoneHome, AiFillSetting } from "react-icons/ai";
import { BsStack } from "react-icons/bs";
import { RxExit } from "react-icons/rx";
import Api from "../api.config";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div<{ show: boolean }>`
  width: 180px;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
  display: ${({ show }) => (show ? "block" : "none")};
  background-color: #fff;
  padding-top: 68px;
  z-index: 600;

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

  &:hover {
    opacity: ${({ active }) => (active ? 1 : 0.8)};
  }
`;

const LogoutBtn = styled.div`
  text-decoration: none;
  display: flex;
  padding: 8px 12px;
  width: 100%;
  cursor: pointer;
  gap: 16px;
  align-items: center;

  &:hover {
    background-color: #e3f1fe;
    color: #00afb9;
    opacity: 0.8;
  }
`;

interface SidebarProps {
  show: boolean;
  activeNav?: "home" | "payment" | "settings" | "logout";
}

function SideBar({ show, activeNav = "home" }: SidebarProps) {
  const navigate = useNavigate();

  function logout() {
    Api.post("/auth/logout").then(() => {
      navigate("/login");
    });
  }

  return (
    <Wrapper show={show} className="sidebar">
      <NavWrap>
        <NavItem
          active={activeNav === "home"}
          onClick={() => navigate("/dashboard")}
        >
          <AiTwotoneHome size={24} />
          <span>Home</span>
        </NavItem>
        <NavItem
          active={activeNav === "payment"}
          onClick={() => navigate("/payment")}
        >
          <BsStack size={24} />
          <span>Payment</span>
        </NavItem>
        <NavItem active={activeNav === "settings"}>
          <AiFillSetting size={24} />
          <span>Settings</span>
        </NavItem>
        <br />
        <LogoutBtn onClick={() => logout()}>
          <RxExit size={24} />
          <span>Logout</span>
        </LogoutBtn>
      </NavWrap>
    </Wrapper>
  );
}

export default SideBar;
