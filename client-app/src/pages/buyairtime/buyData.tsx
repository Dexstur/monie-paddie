import { styled } from "styled-components";
import { InputField, InputHead, Label } from "../signup/Signup.style";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  Wrapper,
  Top,
  LogoWrap,
  Logo,
  TopMessage,
} from "../sendMoney/BankTransfer.style";
import Api from "../../api.config";

const Msg = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #737373;
`;

const SelectInput = styled.select`
  width: 100%;
  font-size: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  color: #000;

  &:focus {
    outline: none;
    border: 2px solid var(--Pri-Color);
  }

  @media (min-width: 768px) {
    padding: 16px 12px;
  }
`;

const CreateBtn = styled.button`
  width: 100%;
  height: 52px;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  padding: 12px 32px;
  margin-top: 10px;
  text-align: center;
  border: none;
  background-color: var(--Pri-Color);
`;

interface Buydataprops {
  display: boolean;
  success?: () => void;
}

interface Network {
  id: string;
  name: string;
}

interface DataMeta {
  data_expiry: string;
  currency: string;
  data_value: string;
  fee: string;
}

export interface PlanReturn {
  id: string;
  meta: DataMeta;
}

interface PlansListItem {
  id: string;
  plan: string;
}

const emptyNetwork: Network = { id: "", name: "Select Network" };
const emptyPlan: PlansListItem = { id: "", plan: "Select network to get plan" };

function Buydata({ display, success = () => null }: Buydataprops) {
  const [formData, setFormData] = useState({
    network: "",
    plan: "",
    pin: "",
    phoneNumber: "",
    provider: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("fetching networks...");
  const [buttonText, setButtonText] = useState("Proceed");
  const [networks, setNetworks] = useState<Network[]>([emptyNetwork]);
  const [plans, setPlans] = useState<PlansListItem[]>([emptyPlan]);

  useEffect(() => {
    if (submitting) {
      setButtonText("Sending...");
    } else {
      setButtonText("Proceed");
    }
  }, [submitting]);
  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name === "pin") {
      if (/^\d*$/.test(value) && value.length <= 4) {
        setFormData({ ...formData, pin: value });
      }
    } else if (name === "phoneNumber") {
      if (/^\d*$/.test(value) && value.length <= 11) {
        setFormData({ ...formData, phoneNumber: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  useEffect(() => {
    Api.get("transactions/networks")
      .then((res) => {
        setNetworks([emptyNetwork, ...res.data.data]);
        setFeedback("");
      })
      .catch(() => {
        setFeedback("Unable to fetch networks");
      });
  }, []);

  function fetchPlans(e: ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;

    setFormData({ ...formData, network: id });
    if (id === "") {
      emptyPlan.plan = "Select network to get plan";
      setPlans([emptyPlan]);
    } else {
      setFeedback("fetching plans...");
      emptyPlan.plan = "Select network to get plan";
      setPlans([emptyPlan]);
      Api.get(`/transactions/data?id=${id}`)
        .then((res) => {
          const dataPlans: PlanReturn[] = res.data.data;
          const formatPlans: PlansListItem[] = dataPlans.map((plan) => ({
            id: plan.id,
            plan: `${plan.meta.data_value} for ${plan.meta.data_expiry} @ ${plan.meta.currency}${plan.meta.fee}`,
          }));
          emptyPlan.plan = "Select a plan";
          const provider = networks.find((network) => network.id === id)?.name;
          if (provider) {
            setFormData({ ...formData, network: id, provider });
          }
          setPlans([emptyPlan, ...formatPlans]);

          setFeedback("");
        })
        .catch(() => {
          setFeedback("Unable to fetch plans");
        });
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!submitting) {
      setSubmitting(true);
      Api.post("/transactions/data", formData)
        .then(() => {
          setFeedback("Data purchase succesful");
          success();
          setSubmitting(false);
          setFormData({
            network: "",
            plan: "",
            pin: "",
            phoneNumber: "",
            provider: "",
          });
          emptyPlan.plan = "Select network to get plan";
          setPlans([emptyPlan]);
          setTimeout(() => {
            setFeedback("");
          }, 1500);
        })
        .catch((err) => {
          if (err.response) {
            const code = err.response.status;
            if (code === 400) {
              setFeedback("Invalid plan");
            } else if (code === 403) {
              setFeedback("Invalid transaction pin");
            } else if (code === 409) {
              setFeedback("Insufficient funds");
            } else {
              setFeedback("Could not purchase plan");
            }
          } else {
            setFeedback("Data transaction failed");
          }
          setFormData({
            network: "",
            plan: "",
            pin: "",
            phoneNumber: "",
            provider: "",
          });
          emptyPlan.plan = "Select network to get plan";
          setPlans([emptyPlan]);

          setTimeout(() => {
            setFeedback("");
          }, 1500);

          setSubmitting(false);
        });
    }
  }

  return (
    <Wrapper show={display}>
      <Top>
        <LogoWrap>
          <Logo src="/Connection.png" alt="data" />
        </LogoWrap>
        <TopMessage>Enter your details to buy data</TopMessage>
      </Top>
      <form onSubmit={handleSubmit}>
        <div className="my-1">
          <InputHead>
            <Label htmlFor="network">Network</Label>
          </InputHead>
          <SelectInput
            id="network"
            value={formData.network}
            onChange={fetchPlans}
            required
          >
            {networks.map((network) => (
              <option key={network.id} value={network.id}>
                {network.name}
              </option>
            ))}
          </SelectInput>
        </div>
        <div className="my-1">
          <InputHead>
            <Label htmlFor="phoneNumber">Phone Number</Label>
          </InputHead>
          <InputField
            id="phoneNumber"
            name="phoneNumber"
            placeholder="08099999123"
            type="text"
            value={formData.phoneNumber}
            onChange={handleChange}
            minLength={11}
            maxLength={11}
            required
          />
        </div>

        <div className="m-1">
          <InputHead>
            <Label htmlFor="dataplan">Data Plan</Label>
          </InputHead>
          <SelectInput
            value={formData.plan}
            id="dataplan"
            name="plan"
            onChange={handleChange}
            required
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.plan}
              </option>
            ))}
          </SelectInput>
        </div>

        <div className="m-1">
          <InputHead>
            <Label htmlFor="pin">Pin</Label>
          </InputHead>
          <InputField
            id="pin"
            name="pin"
            placeholder="Enter transaction pin"
            type="password"
            value={formData.pin}
            onChange={handleChange}
            minLength={4}
            maxLength={4}
            required
          />
        </div>
        <br></br>
        <CreateBtn type="submit">{buttonText}</CreateBtn>
      </form>
      <Msg>{feedback}</Msg>
    </Wrapper>
  );
}

export default Buydata;
