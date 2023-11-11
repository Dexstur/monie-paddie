import { styled } from "styled-components";

export const Wrapper = styled.div<{ show: boolean }>`
  width: 88%;
  max-width: 600px;
  height: auto;
  padding: 32px 24px;
  margin: 0 auto;

  display: ${({ show }) => (show ? "flex" : "none")};
  flex-direction: column;
  gap: 16px;
  background-color: #fff;
  border-radius: 8px;

  @media (min-width: 768px) {
    width: 600px;
    height: auto;
    padding: 40px 32px;
    gap: 24px;
  }
`;

export const Top = styled.div`
  height: 120px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const LogoWrap = styled.div`
  width: 72px;
  height: 72px;
  background-color: #e8f1fd;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

export const Logo = styled.img`
  width: 32px;
  height: 32px;
`;
export const TopMessage = styled.p`
  font-size: 16px;
  font-weight: 400px;
`;

export const SubmitForm = styled.button`
  border: none;
  outline: none;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  font-size: 20px;
  font-weight: 600;
  border-radius: 4px;
  background-color: var(--Pri-Color);

  &:hover {
    opacity: 0.8;
  }
`;

export const AcctName = styled.h3`
  font-size: 20px;
  font-weight: 600;
`;
