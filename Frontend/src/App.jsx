
import { Routes, Route } from "react-router-dom";

import HomepageLayout from "./Homepage/HomepageLayout.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomepageLayout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
