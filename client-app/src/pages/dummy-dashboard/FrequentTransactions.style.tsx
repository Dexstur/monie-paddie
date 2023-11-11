import styled from "styled-components";

const Text = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #000;
  text-align: center;
`;

const Initials = styled.p`
  font-size: 32px;
  font-weight: 600;
  color: #00afb9;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
`;

const QuickTransfer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 24px;
  padding-top: 0;
  gap: 40px;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 10px;
  }
`;

const Box = styled.div`
  width: 100%;
  height: 96px;
`;

export default function FrequentTransfers() {
  return (
    <QuickTransfer className="col-12 col-lg-2 col-sm-6">
      <div>
        <Box>
          <Initials>PM</Initials>
        </Box>
        <Text>Peter Michael</Text>
      </div>
      <div>
        <Box>
          <Initials>CB</Initials>
        </Box>
        <Text>Chinonso Benson</Text>
      </div>
      <div>
        <Box>
          <Initials>TP</Initials>
        </Box>
        <Text>Tochii Praise</Text>
      </div>
      <div>
        <Box>
          <Initials>CC</Initials>
        </Box>
        <Text>Chinedu Chuks</Text>
      </div>
      <div>
        <Box>
          <Initials>FC</Initials>
        </Box>
        <Text>Freedom Clinton</Text>
      </div>
    </QuickTransfer>
  );
}
