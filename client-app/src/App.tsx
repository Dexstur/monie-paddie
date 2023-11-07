import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MockPage from "./pages/mockpage/mockpage";
import SignUpPage from "./pages/signup/Signup";
import LoginPage from "./pages/login/Login";
import MockDashboard from "./pages/dummy-dashboard/Dashboard";
import Register from "./pages/register/Register";
import Home from "./pages/bars/Home";
import Payment from "./pages/bars/Payment";
import Settings from "./pages/bars/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MockPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<MockDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sidebar/home" element={<Home />} />
        <Route path="/sidebar/payment" element={<Payment />} />
        <Route path="/sidebar/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
