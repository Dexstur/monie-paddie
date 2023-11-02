import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MockPage from "./pages/mockpage/mockpage";
import SignUpPage from "./pages/signup/Signup";
import LoginPage from "./pages/login/Login";

function App() {
  // const apiBaseUrl = "http://localhost:5500";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MockPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
