import { styled } from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  margin-top: 24px;
`;

export const Entry = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  margin: 16px 0;
`;

export const DetailWrap = styled.div`
  width: 256px;
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const HoldIcon = styled.div`
  background-color: var(--Pri-Light);
  color: var(--Pri-Color);
  width: 72px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 4px;
  flex-shrink: 0;
`;

export const HoldNames = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
export const ActName = styled.span`
  font-weight: 600;
  color: #000;
`;
export const BankName = styled.span`
  font-size: 14px;
  font-weight: 400px;
  color: #828282;
`;
export const Amount = styled.div<{ credit: boolean }>`
  text-align: center;
  color: ${({ credit }) => (credit ? "green" : "red")};
  font-weight: 600;
`;
