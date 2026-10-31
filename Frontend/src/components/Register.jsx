import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { registerUser, loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";
import AuthShell, { useFitWidth } from "../components/AuthShell.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn, login } = useAuth();

  const redirectTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [googleRef, googleWidth] = useFitWidth(340);

  // Handle normal registration
  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setMessage("");

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!name || !email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (name.length < 2) {
      setMessage("Name must be at least 2 characters.");
      return;
    }

    if (password.length < 8 || password.length > 72) {
      setMessage("Password must be between 8 and 72 characters.");
      return;
    }

    setLoading(true);

    try {
      // Create account
      await registerUser({
        name,
        email,
        password,
      });

      // Automatically log in after registration
      const result = await loginUser({
        email,
        password,
      });

      if (!result?.token || !result?.user) {
        throw new Error(
          "Account created, but automatic login failed. Please log in."
        );
      }

      // Save authentication in existing AuthContext
      login(result.token, result.user);

      setForm({
        name: "",
        email: "",
        password: "",
      });

      navigate(redirectTo, { replace: true });
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // Handle Google registration
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
        throw new Error(data.message || "Google registration failed.");
      }

      if (!data.token || !data.user) {
        throw new Error("Invalid Google authentication response.");
      }

      // Save authentication in existing AuthContext
      login(data.token, data.user);

      navigate(redirectTo, { replace: true });
    } catch (error) {
      setMessage(
        error.message || "Google registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleError() {
    setMessage("Google sign-up failed. Please try again.");
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
      title="Create your account"
      subtitle="Sign up to ExportYard to send your enquiry."
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      {/* Google Registration */}
      <div className="au-google" ref={googleRef}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="signup_with"
          shape="rectangular"
          size="large"
          width={googleWidth}
        />
      </div>

      <div className="au-or" role="separator">or</div>

      {/* Normal Registration */}
      <form className="au-form" onSubmit={handleSubmit} noValidate>
        <div className="au-field">
          <label htmlFor="reg-name">Full name</label>
          <div className="au-input">
            <input
              id="reg-name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={100}
              autoComplete="name"
              required
            />
          </div>
        </div>

        <div className="au-field">
          <label htmlFor="reg-email">Email</label>
          <div className="au-input">
            <input
              id="reg-email"
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
          <label htmlFor="reg-password">Password</label>
          <div className="au-input has-btn">
            <input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
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
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}