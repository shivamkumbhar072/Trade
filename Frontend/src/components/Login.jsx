import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";
import AuthShell, { useFitWidth } from "../components/AuthShell.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isLoggedIn } = useAuth();

  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [googleRef, googleWidth] = useFitWidth(340);

  // Handle normal email/password login
  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setMessage("");

    if (!form.email.trim() || !form.password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (!result?.token || !result?.user) {
        throw new Error("Invalid login response from server.");
      }

      login(result.token, result.user);

      navigate(redirectTo, { replace: true });
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Handle Google login
  async function handleGoogleSuccess(response) {
    if (!response?.credential || loading) return;

    setMessage("");
    setLoading(true);

    try {
      const result = await fetch(`${API_URL}/api/users/google-auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.message || "Google login failed.");
      }

      if (!data.token || !data.user) {
        throw new Error("Invalid Google authentication response.");
      }

      login(data.token, data.user);

      navigate(redirectTo, { replace: true });
    } catch (error) {
      setMessage(error.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleError() {
    setMessage("Google sign-in failed. Please try again.");
  }

  // Already logged in
  if (isLoggedIn) {
    return (
      <AuthShell
        title="You're already logged in"
        subtitle="Pick up where you left off."
        footer={<Link to="/">Back to home</Link>}
      >
        <button
          type="button"
          className="au-btn"
          onClick={() => navigate(redirectTo, { replace: true })}
        >
          Continue
        </button>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to your ExportYard account."
      footer={
        <>
          Don't have an account? <Link to="/register">Sign up</Link>
        </>
      }
    >
      {/* Google Login */}
      <div className="au-google" ref={googleRef}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="continue_with"
          shape="rectangular"
          size="large"
          width={googleWidth}
        />
      </div>

      <div className="au-or" role="separator">or</div>

      {/* Email Login */}
      <form className="au-form" onSubmit={handleSubmit} noValidate>
        <div className="au-field">
          <label htmlFor="login-email">Email</label>
          <div className="au-input">
            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="au-field">
          <label htmlFor="login-password">Password</label>
          <div className="au-input has-btn">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="au-toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-pressed={showPassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {message && (
          <p role="alert" className="au-error">
            {message}
          </p>
        )}

        <button type="submit" className="au-btn" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}