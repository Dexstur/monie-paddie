import styled from "styled-components";
import Api from "../../api.config";
import { useEffect, useState } from "react";
import { TransactionItem } from "../dummy-dashboard/TransactionList";

const Text = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #000;
  text-align: center;
`;

const LinkWrap = styled.a`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ItemWrapper = styled.div`
  display: flex;
  justify-center: center;
  flex-direction: column;
  gap: 12px;
`;

const Initials = styled.p`
  font-size: 32px;
  font-weight: 600;
  color: #00afb9;
`;

const QuickTransfer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 24px;
  padding-top: 0;
  gap: 40px;
  flex-wrap: wrap;

  @media (min-width: 768px) {
    gap: 40px;
    flex-direction: row;
  }
`;

const Box = styled.div`
  width: 96px;
  height: 96px;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  text-align: center;
  margin: 0 auto;
`;

export default function FrequentTransfers() {
  const [list, setList] = useState<TransactionItem[]>([]);
  useEffect(() => {
    Api.get(`/transactions/all?search=transfer&filter=newest`).then((res) => {
      const fullList = res.data.data;
      console.log(fullList);
      const uniqueNames = [
        ...new Set(fullList.map((item: TransactionItem) => item.accountName)),
      ];
      const uniqueList: TransactionItem[] = [];
      uniqueNames.forEach((name) => {
        const filtered = fullList.filter(
          (item: TransactionItem) => item.accountName === name
        );
        uniqueList.push(filtered[0]);
      });
      setList(uniqueList.slice(0, 5));
      console.log(uniqueList);
    });
  }, []);

  function getInitials(name: string) {
    const initials = name
      .split(" ")
      .map((item, index) => {
        if (index < 2) {
          return item[0];
        }
      })
      .join("");
    return initials;
  }
  return (
    <QuickTransfer>
      {list.length === 0 && <p>No recent transfers</p>}
      {list.map((item) => (
        <ItemWrapper key={item._id}>
          <LinkWrap href={`/quick-transfer?id=${item._id}`}>
            <Box>
              <Initials>{getInitials(item.accountName)}</Initials>
            </Box>
            <Text>{item.accountName.split(" ").slice(0, 2).join(" ")}</Text>
          </LinkWrap>
        </ItemWrapper>
      ))}
    </QuickTransfer>
  );
}
