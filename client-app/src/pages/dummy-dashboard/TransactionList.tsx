import {
  Wrapper,
  Entry,
  DetailWrap,
  HoldIcon,
  HoldNames,
  ActName,
  BankName,
  Amount,
} from "./TransactionList.style";
import { PiBankFill } from "react-icons/pi";

export interface TransactionItem {
  userId: string;
  amount: number;
  transactionType: string;
  note?: string;
  credit: boolean;
  reference?: string;
  bankName: string;
  accountNumber?: string;
  accountName: string;
  phoneNumber?: string;
  network?: string;
  dataPlan?: string;
  electricityMeter?: string;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TransactionListProps {
  transactions: TransactionItem[];
}

function TransactionList({ transactions }: TransactionListProps) {
  function formatBalance(amount: number) {
    const round = Math.floor(amount / 100);
    const format = round.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const kobo = amount.toString().split("").slice(-2).join("");
    return `${format}.${kobo}`;
  }
  return (
    <Wrapper>
      {transactions.length === 0 && <p>No transactions found</p>}
      {transactions.map((trans) => (
        <Entry>
          <DetailWrap>
            <HoldIcon>
              <PiBankFill size={32} />
            </HoldIcon>
            <HoldNames>
              <ActName>{trans.accountName}</ActName>
              <BankName>{trans.bankName}</BankName>
            </HoldNames>
          </DetailWrap>
          <Amount credit={trans.credit}>
            <span>
              {trans.credit
                ? `+${formatBalance(trans.amount)}`
                : `-${formatBalance(trans.amount)}`}
            </span>
          </Amount>
        </Entry>
      ))}
    </Wrapper>
  );
}

export default TransactionList;
