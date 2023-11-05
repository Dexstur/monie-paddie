import { styled } from "styled-components";
import { ReactNode, useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  max-width: 1680px;
  margin: 0 auto;
  position: relative;
`;

const Content = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #e3f1fe;
  min-height: 100vh;
  padding: 88px 20px 24px 20px;

  @media (min-width: 768px) {
    padding: 88px 20px 24px 260px;
  }
`;

interface LayoutProps {
  children: ReactNode;
  activeNav?: "home" | "payment" | "settings";
}

function Layout({ children, activeNav = "home" }: LayoutProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  function toggleSidebar() {
    setShowSidebar((prev) => !prev);
  }
  return (
    <Wrapper>
      <Header toggleSidebar={toggleSidebar} />
      <SideBar show={showSidebar} activeNav={activeNav} />
      <Content>{children}</Content>
    </Wrapper>
  );
}

export default Layout;
