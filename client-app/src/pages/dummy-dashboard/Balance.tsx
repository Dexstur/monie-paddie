import image from "/Wallet.png";
import { styled } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 24px;
  height: 186px;
  background-color: #fff;
`;

const Icon = styled.img`
  width: 40px;
  height: 40px;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #b3c0d0;
`;

const Text = styled.span`
  font-size: 16px;
  font-weight: 400;
  min-width: 280px;
`;
const Amount = styled.h2`
  font-size: 32px;
  color: var(--Pri-Color);
  font-weight: 700;
`;

interface BalanceProps {
  balance: number;
}

function Balance({ balance }: BalanceProps) {
  function formatBalance(amount: number) {
    const round = Math.floor(amount / 100);
    const format = round.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return format;
  }
  return (
    <Wrapper>
      <Top>
        <Icon src={image} alt="wallet" />
        <Text>TOTAL BALANCE</Text>
      </Top>
      <Amount>{`N${formatBalance(balance)}`}</Amount>
    </Wrapper>
  );
}

export default Balance;
