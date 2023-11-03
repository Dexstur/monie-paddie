import styled from "styled-components";
import { StylishText } from "../pages/signup/Signup.style";
import { IconContext } from "react-icons/lib";
import { BsBellFill } from "react-icons/bs";
import { SidebarData } from "./SidebarData";
import pic3 from "../assets/pic3.jpg";
import { NavLink } from "react-router-dom";

const TopBar = styled.nav`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  padding: 55px 40px 40px 40px;
  align-items: center;
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
  justify-content: flex-start;
  position: absolute;
  left: 16px;
  top: 144px;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const ProfilePic = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

function SideBar() {

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <TopBar>
          <StylishText>Monie Paddy</StylishText>
          <div><p>Home</p></div>
          <div>
            <BsBellFill size={24} color={"black"}/>
            <ProfilePic src={pic3} alt="profile picture" />
          </div>
        </TopBar>
        <SidebarNav>
          <SidebarWrap>
            {SidebarData.map((item, index) => (
              <NavLink to={item.path} key={index} className="link">
                <div className="icon">{item.icon}</div>
                <div className="text">{item.title}</div>
              </NavLink>
            ))}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
}

export default SideBar;
