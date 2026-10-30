
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

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

// Shared layout
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

// Protected route
function ProtectedRoute() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />
  );
}

export default function App() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  // Get originally requested page
  const redirectTo = location.state?.from?.pathname || "/";

  return (
    <Routes>
      <Route element={<MainLayout />}>

        {/* Public Pages */}
        <Route path="/" element={<HomepageLayout />} />

        {/* Protected Pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/enquiry" element={<Enquiry />} />
        </Route>

        {/* Login */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to={redirectTo} replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Admin Pages */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
        </Route>

      </Route>

      {/* Unknown Routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
