import { styled } from "styled-components";

export const OptionSide = styled.div`
  height: auto;
  @media (min-width: 768px) {
    min-height: 100vh;
  }
`;

export const TransactionSide = styled.div`
  height: auto;
  background-color: var(--Pri-Sec);
  @media (min-width: 768px) {
    min-height: 100vh;
  }
`;

export const MoneyDetail = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 24px;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 10px;
  }
`;
