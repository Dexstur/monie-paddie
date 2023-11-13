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
  height: 100vh;
  overflow-y: scroll;
  padding: 68px 0px 0px 0px;
  position: relative;

  @media (min-width: 768px) {
    padding: 80px 0px 0px 240px;
  }
`;

interface LayoutProps {
  children: ReactNode;
  activeNav?: "home" | "payment" | "settings";
  history?: string[];
}

function Layout({
  children,
  activeNav = "home",
  history = ["Home"],
}: LayoutProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  function toggleSidebar() {
    setShowSidebar((prev) => !prev);
  }
  return (
    <Wrapper>
      <Header toggleSidebar={toggleSidebar} history={history} />
      <SideBar show={showSidebar} activeNav={activeNav} />
      <Content>{children}</Content>
    </Wrapper>
  );
}

export default Layout;
