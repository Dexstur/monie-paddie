import { styled } from "styled-components";
import { MdAdd } from "react-icons/md";
import { FormEvent, useState } from "react";
import Api from "../../api.config";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Text = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #000;
`;
const Form = styled.form`
  display: flex;
  height: 96px;
  padding: 16px;
  background-color: var(--Pri-Sec);
  align-items: center;
  border-radius: 8px;
`;

const AddButton = styled.button`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  background-color: var(--Pri-Light);
  color: var(--Pri-Color);
  border: none;
  outline: none;
`;

const InputAmount = styled.input`
  border: none;
  outline: none;
  font-size: 24px;
  width: 100%;
  padding: 16px 8px;
  background: none;
  color: #fff;

  &:focus {
    outline: none;
    border: none;
  }

  &::placeholder {
    color: #fff;
  }
`;

interface PsResponse {
  message: string;
  reference: string;
  status: string;
}

declare const PaystackPop: {
  setup: (options: {
    key: string;
    email: string;
    amount: number;
    onClose: () => void;
    callback: (response: PsResponse) => void;
    ref?: string;
  }) => {
    openIframe: () => void;
  };
};

const secretKey = import.meta.env.VITE_APP_PAYSTACK_PUBLIC;
interface FundingProps {
  userEmail: string;
  success: () => void;
}

function Funding({ userEmail, success }: FundingProps) {
  const [amount, setAmount] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    payWithPaystack();
  }

  function payWithPaystack() {
    const handler = PaystackPop.setup({
      key: secretKey,
      email: userEmail,
      amount: Number(amount) * 100,
      onClose: function () {
        () => console.log("window closed");
      },
      callback: function (response) {
        // console.log(response);
        const transaction = {
          amount: Number(amount),
          reference: response.reference,
          status: response.status,
          message: response.message,
        };
        Api.post("/transactions/fund", transaction)
          .then(() => {
            success();
            setAmount("");
          })
          .catch((err) => {
            console.error(err);
            setAmount("");
          });
      },
    });

    handler.openIframe();
  }

  return (
    <Wrapper>
      <Text>Add money to your wallet</Text>
      <Form onSubmit={handleSubmit}>
        <AddButton>
          <MdAdd color={"#00afb9"} size={36} />
        </AddButton>
        <InputAmount
          type="number"
          id="amount"
          name="amount"
          placeholder="Fund Account"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="hidden"
          name="email"
          id="name"
          value={userEmail}
          required
        />
      </Form>
    </Wrapper>
  );
}

export default Funding;
