
import { Routes, Route, Navigate } from "react-router-dom";

import HomepageLayout from "./Homepage/HomepageLayout.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomepageLayout />} />

      <Route
        path="/login"
        element={
          isLoggedIn ? <Navigate to="/" replace /> : <Login />
        }
      />

      <Route
        path="/register"
        element={
          isLoggedIn ? <Navigate to="/" replace /> : <Register />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
