import {
  Option,
  Wrapper,
  Top,
  Logo,
  OptionText,
  OptionTitle,
} from "../payment/Payment.style";
import Wallet from "/Wallet.png";

function SettingOptions() {
  return (
    <Wrapper>
      <Option href="/change-pin">
        <Top>
          <Logo src={Wallet} alt="load img" />
          <OptionTitle>Change Pin</OptionTitle>
        </Top>
        <div style={{ height: "70px" }}>
          <OptionText>Change your transaction pin</OptionText>
        </div>
      </Option>
    </Wrapper>
  );
}

export default SettingOptions;
