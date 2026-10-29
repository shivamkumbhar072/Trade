import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* check the fields and return an object of messages (empty object = valid) */
function validate(form) {
  const errors = {};
  const email = form.email.trim();

  if (!email) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address.";

  if (!form.password) errors.password = "Password is required.";

  return errors;
}

/* turn any thrown error into a message that is safe to show */
function getErrorMessage(error) {
  const status = error?.status || error?.response?.status;
  const serverMessage = error?.response?.data?.message;
  const text = String(error?.message || "");

  if (
    (typeof navigator !== "undefined" && !navigator.onLine) ||
    /failed to fetch|network ?error|load failed/i.test(text)
  ) {
    return "Can't reach the server. Check your internet connection and try again.";
  }
  if (status >= 500) return "Something went wrong on our side. Please try again in a moment.";
  if (status === 429) return "Too many attempts. Please wait a minute and try again.";

  return serverMessage || text || "Login failed. Please try again.";
}

function Login() {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((f) => ({ ...f, [name]: value }));

    // clear the message for the field being edited, and the server error
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
    if (message) setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;

    setMessage("");

    // 1. validate before calling the server
    const found = validate(form);
    setErrors(found);

    if (found.email) {
      emailRef.current?.focus();
      return;
    }
    if (found.password) {
      passwordRef.current?.focus();
      return;
    }

    // 2. call the server
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
      navigate("/", { replace: true });
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  if (isLoggedIn) {
    return (
      <main className="lg-page">
        <style>{css}</style>
        <div className="lg-card">
          <h1 className="lg-title">You're already logged in</h1>
          <p className="lg-sub">Head back to the homepage to continue.</p>
          <Link to="/" className="lg-btn lg-btn-link">
            Go to homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="lg-page">
      <style>{css}</style>

      <div className="lg-card">
        <h1 className="lg-title">Welcome back</h1>
        <p className="lg-sub">Log in to your ExportYard account.</p>

        {/* noValidate: we show our own messages instead of the browser's popups */}
        <form onSubmit={handleSubmit} className="lg-form" noValidate>
          <div className={`lg-field${errors.email ? " has-error" : ""}`}>
            <label htmlFor="login-email">Email</label>
            <input
              ref={emailRef}
              id="login-email"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "login-email-error" : undefined}
            />
            {errors.email && (
              <span id="login-email-error" className="lg-hint" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className={`lg-field${errors.password ? " has-error" : ""}`}>
            <label htmlFor="login-password">Password</label>
            <div className="lg-pass">
              <input
                ref={passwordRef}
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "login-password-error" : undefined}
              />
              <button
                type="button"
                className="lg-eye"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span id="login-password-error" className="lg-hint" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {message && (
            <div className="lg-error" role="alert">
              {message}
            </div>
          )}

          <button type="submit" className="lg-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="lg-foot">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </main>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&display=swap');

.lg-page {
  min-height: 100vh;
  min-height: 100svh;
  display: grid;
  place-items: center;
  /* top padding clears the fixed navbar */
  padding: 6rem 1.25rem 3rem;
  box-sizing: border-box;
  color: #fff;
  font-family: 'Bricolage Grotesque', system-ui, sans-serif;
  background:
    radial-gradient(ellipse 70% 40% at 50% 100%, rgba(255,197,143,.2), transparent 70%),
    linear-gradient(#0a1628 0%, #0f2a4a 55%, #0e4a64 100%);
}

.lg-card {
  width: 100%;
  max-width: 26rem;
  box-sizing: border-box;
  padding: 2rem 1.75rem;
  border-radius: 18px;
  background: rgba(10,22,40,.82);
  border: 1px solid rgba(56,189,208,.22);
  box-shadow: 0 30px 60px -24px rgba(0,0,0,.7);
}

.lg-title {
  margin: 0;
  font-size: clamp(1.7rem, 5vw, 2.1rem);
  font-weight: 700;
  letter-spacing: -.03em;
  line-height: 1.1;
}

.lg-sub {
  margin: .6rem 0 0;
  color: rgba(255,255,255,.7);
  line-height: 1.5;
}

.lg-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-top: 1.6rem;
}

.lg-field {
  display: flex;
  flex-direction: column;
  gap: .4rem;
}

.lg-field label {
  font-size: .8rem;
  font-weight: 600;
  letter-spacing: .04em;
  color: rgba(255,255,255,.8);
}

.lg-field input {
  width: 100%;
  box-sizing: border-box;
  padding: .85rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(255,255,255,.07);
  color: #fff;
  font: inherit;
  font-size: 1rem; /* 16px stops iOS zooming on focus */
  transition: border-color .2s, background .2s, box-shadow .2s;
}

.lg-field input::placeholder {
  color: rgba(255,255,255,.4);
}

.lg-field input:focus {
  outline: none;
  border-color: #38bdd0;
  background: rgba(255,255,255,.1);
  box-shadow: 0 0 0 3px rgba(56,189,208,.25);
}

/* empty / invalid field */
.lg-field.has-error input {
  border-color: #ff7a66;
  background: rgba(200,65,47,.12);
}

.lg-field.has-error input:focus {
  border-color: #ff7a66;
  box-shadow: 0 0 0 3px rgba(255,122,102,.25);
}

.lg-hint {
  font-size: .82rem;
  line-height: 1.35;
  color: #ffb4a6;
}

.lg-pass {
  position: relative;
}

.lg-pass input {
  padding-right: 3rem;
}

.lg-eye {
  position: absolute;
  top: 50%;
  right: .35rem;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: rgba(255,255,255,.65);
  cursor: pointer;
}

.lg-eye:hover {
  color: #fff;
}

.lg-error {
  padding: .75rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255,120,100,.45);
  background: rgba(200,65,47,.18);
  color: #ffd2c9;
  font-size: .9rem;
  line-height: 1.4;
}

.lg-btn {
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  padding: .95rem 1.5rem;
  border: 0;
  border-radius: 10px;
  background: #ffc58f;
  color: #10222e;
  font: inherit;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background .2s, transform .2s, opacity .2s;
}

.lg-btn:hover:not(:disabled) {
  background: #ffd7b0;
  transform: translateY(-1px);
}

.lg-btn:disabled {
  opacity: .65;
  cursor: not-allowed;
}

.lg-btn-link {
  margin-top: 1.4rem;
}

.lg-foot {
  margin: 1.4rem 0 0;
  text-align: center;
  font-size: .92rem;
  color: rgba(255,255,255,.65);
}

.lg-foot a {
  color: #38bdd0;
  font-weight: 600;
  text-decoration: none;
}

.lg-foot a:hover {
  text-decoration: underline;
}

.lg-btn:focus-visible,
.lg-eye:focus-visible,
.lg-foot a:focus-visible {
  outline: 2px solid #ffd9a0;
  outline-offset: 3px;
}

@media (max-width: 480px) {
  .lg-page { padding: 5.5rem 1rem 2rem; }
  .lg-card { padding: 1.6rem 1.25rem; border-radius: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .lg-btn, .lg-field input { transition: none; }
}
`;

export default Login;