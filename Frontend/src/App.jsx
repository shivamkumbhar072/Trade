
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import HomepageLayout from "./Homepage/HomepageLayout.jsx";
import Navbar from "./Homepage/Navbar.jsx";
import Footer from "./Homepage/Footer.jsx";

import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import Users from "./admin/Users.jsx";
import AdminEnquiries from "./admin/AdminEnquiries.jsx";

import Enquiry from "./pages/Enquiry.jsx";

// Shared layout for all pages
function MainLayout() {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-main-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* All pages share the same Navbar and Footer */}
      <Route element={<MainLayout />}>
        {/* Public pages */}
        <Route path="/" element={<HomepageLayout />} />
        <Route path="/enquiry" element={<Enquiry />} />

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

        {/* Admin pages also share the same Navbar and Footer */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
        </Route>
      </Route>

      {/* Redirect unknown routes to homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
