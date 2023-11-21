import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MockPage from "./pages/mockpage/mockpage";
import SignUpPage from "./pages/signup/Signup";
import LoginPage from "./pages/login/Login";
import MockDashboard from "./pages/dummy-dashboard/Dashboard";
import BuyAirtimedash from "./pages/buyairtime/buyAirtime-dash";
import BuyDataPage from "./pages/buyairtime/BuyDataPage";
import Register from "./pages/register/Register";
import Home from "./pages/bars/Home";
import PaymentPage from "./pages/payment/Payment";
import Settings from "./pages/bars/Settings";
import BankTransfer from "./pages/sendMoney/BankTransfer";
import QuickTransfer from "./pages/quickTransfer/quickTransfer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MockPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<MockDashboard />} />
        <Route path="/send-money" element={<BankTransfer />} />
        <Route path="/quick-transfer" element={<QuickTransfer />} />
        <Route path="/buy-airtime" element={<BuyAirtimedash />} />
        <Route path="/buy-data" element={<BuyDataPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sidebar/home" element={<Home />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/sidebar/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
