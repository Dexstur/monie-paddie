import { styled } from "styled-components";

export const Wrapper = styled.div`
  padding: 104px 56px;
  display: flex;
  flex-wrap: wrap;
  gap: 64px;
`;

export const Option = styled.a`
  text-decoration: none;
  background-color: #fff;
  width: 100%;
  max-width: 376px;
  height: 240px;
  color: #b3c0d0;
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

export const Top = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 96px;
`;
export const Logo = styled.img`
  width: 32px;
  height: 32px;
`;
export const OptionTitle = styled.h3`
  font-size: 24px;
  font-weight: 400;
  color: #333;
`;
export const OptionText = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
`;
