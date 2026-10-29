
import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registerUser, loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext.jsx";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(form) {
  const errors = {};
  const name = form.name.trim();
  const email = form.email.trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (name.length > 100) {
    errors.name = "Name must be 100 characters or fewer.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (form.password.length > 72) {
    errors.password = "Password must be 72 characters or fewer.";
  }

  return errors;
}

function getErrorMessage(error) {
  if (
    typeof navigator !== "undefined" &&
    !navigator.onLine
  ) {
    return "No internet connection. Please try again.";
  }

  if (/failed to fetch|network ?error|load failed/i.test(error.message || "")) {
    return "Can't reach the server. Check your API URL and connection.";
  }

  if (error.status === 409) {
    return error.message || "This email is already registered.";
  }

  if (error.status >= 500) {
    return "Something went wrong on the server. Please try again.";
  }

  return error.message || "Registration failed. Please try again.";
}

export default function Register() {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const refs = {
    name: useRef(null),
    email: useRef(null),
    password: useRef(null),
  };

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }

    if (message) setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    setMessage("");

    const foundErrors = validate(form);
    setErrors(foundErrors);

    const firstInvalid = ["name", "email", "password"].find(
      (key) => foundErrors[key]
    );

    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }

    setLoading(true);

    const credentials = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    try {
      // 1. Create the account.
      await registerUser(credentials);

      // 2. Log in using the same email and password.
      const result = await loginUser({
        email: credentials.email,
        password: credentials.password,
      });

      // 3. Ensure the backend returned authentication details.
      if (!result.token || !result.user) {
        throw new Error(
          "Account created, but automatic login failed. Please log in manually."
        );
      }

      // 4. Save the session and update the Navbar immediately.
      login(result.token, result.user);

      // 5. Clear the form and go to the homepage.
      setForm({
        name: "",
        email: "",
        password: "",
      });

      navigate("/", { replace: true });
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  if (isLoggedIn) {
    return (
      <main className="ey-register-page">
        <style>{registerCss}</style>

        <div className="ey-register-card">
          <h1 className="ey-register-title">
            You're already logged in
          </h1>

          <p className="ey-register-subtitle">
            Head back to the homepage to continue.
          </p>

          <Link
            to="/"
            className="ey-register-button ey-register-link-button"
          >
            Go to homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="ey-register-page">
      <style>{registerCss}</style>

      <div className="ey-register-card">
        <p className="ey-register-eyebrow">
          WELCOME TO EXPORTYARD
        </p>

        <h1 className="ey-register-title">
          Create your account
        </h1>

        <p className="ey-register-subtitle">
          Sign up to request quotes and track your orders.
        </p>

        <form
          onSubmit={handleSubmit}
          className="ey-register-form"
          noValidate
        >
          <div className={`ey-register-field ${errors.name ? "has-error" : ""}`}>
            <label htmlFor="register-name">Name</label>

            <input
              ref={refs.name}
              id="register-name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              maxLength={100}
              autoComplete="name"
              aria-invalid={!!errors.name}
              required
            />

            {errors.name && (
              <span className="ey-register-hint" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className={`ey-register-field ${errors.email ? "has-error" : ""}`}>
            <label htmlFor="register-email">Email</label>

            <input
              ref={refs.email}
              id="register-email"
              name="email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              aria-invalid={!!errors.email}
              required
            />

            {errors.email && (
              <span className="ey-register-hint" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className={`ey-register-field ${errors.password ? "has-error" : ""}`}>
            <label htmlFor="register-password">Password</label>

            <div className="ey-register-password">
              <input
                ref={refs.password}
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                maxLength={72}
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                required
              />

              <button
                type="button"
                className="ey-register-eye"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password ? (
              <span className="ey-register-hint" role="alert">
                {errors.password}
              </span>
            ) : (
              <span className="ey-register-help">
                Use 8 to 72 characters.
              </span>
            )}
          </div>

          {message && (
            <div className="ey-register-error" role="alert">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="ey-register-button"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="ey-register-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}

const registerCss = `
.ey-register-page {
  min-height: 65vh;
  display: grid;
  place-items: center;
  padding: 6rem 1.25rem 3rem;
  box-sizing: border-box;
  color: #fff;
  font-family: system-ui, sans-serif;
  background:
    radial-gradient(ellipse 70% 40% at 50% 100%, rgba(255,197,143,.2), transparent 70%),
    linear-gradient(#0a1628 0%, #0f2a4a 55%, #0e4a64 100%);
}
.ey-register-card {
  width: 100%;
  max-width: 26rem;
  box-sizing: border-box;
  padding: 2rem 1.75rem;
  border-radius: 18px;
  background: rgba(10,22,40,.82);
  border: 1px solid rgba(56,189,208,.22);
  box-shadow: 0 30px 60px -24px rgba(0,0,0,.7);
}
.ey-register-eyebrow {
  color: #ffc58f;
  font-size: .7rem;
  font-weight: 800;
  letter-spacing: 1.5px;
}
.ey-register-title {
  margin: 0;
  font-size: clamp(1.7rem, 5vw, 2.1rem);
  letter-spacing: -.03em;
}
.ey-register-subtitle {
  color: rgba(255,255,255,.7);
  font-size: .9rem;
  line-height: 1.5;
}
.ey-register-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-top: 1.6rem;
}
.ey-register-field {
  display: flex;
  flex-direction: column;
  gap: .4rem;
}
.ey-register-field label {
  font-size: .8rem;
  font-weight: 600;
  color: rgba(255,255,255,.8);
}
.ey-register-field input {
  width: 100%;
  box-sizing: border-box;
  padding: .85rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.18);
  background: rgba(255,255,255,.07);
  color: #fff;
  font: inherit;
  font-size: 16px;
}
.ey-register-field input::placeholder {
  color: rgba(255,255,255,.4);
}
.ey-register-field input:focus {
  outline: none;
  border-color: #38bdd0;
  box-shadow: 0 0 0 3px rgba(56,189,208,.25);
}
.ey-register-field.has-error input {
  border-color: #ff7a66;
}
.ey-register-hint {
  color: #ffb4a6;
  font-size: .82rem;
}
.ey-register-help {
  color: rgba(255,255,255,.5);
  font-size: .8rem;
}
.ey-register-password {
  position: relative;
}
.ey-register-password input {
  padding-right: 3rem;
}
.ey-register-eye {
  position: absolute;
  top: 50%;
  right: .35rem;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: rgba(255,255,255,.65);
  cursor: pointer;
}
.ey-register-eye:hover {
  color: #fff;
}
.ey-register-error {
  padding: .75rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255,120,100,.45);
  background: rgba(200,65,47,.18);
  color: #ffd2c9;
  font-size: .9rem;
  line-height: 1.4;
}
.ey-register-button {
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  padding: .95rem 1.5rem;
  border: 0;
  border-radius: 10px;
  background: #ffc58f;
  color: #10222e;
  font: inherit;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}
.ey-register-button:hover:not(:disabled) {
  background: #ffd7b0;
}
.ey-register-button:disabled {
  opacity: .65;
  cursor: not-allowed;
}
.ey-register-link-button {
  margin-top: 1.4rem;
}
.ey-register-footer {
  margin: 1.4rem 0 0;
  text-align: center;
  font-size: .9rem;
  color: rgba(255,255,255,.65);
}
.ey-register-footer a {
  color: #38bdd0;
  font-weight: 600;
  text-decoration: none;
}
.ey-register-footer a:hover {
  text-decoration: underline;
}
@media (max-width: 480px) {
  .ey-register-page { padding: 5.5rem 1rem 2rem; }
  .ey-register-card { padding: 1.6rem 1.25rem; }
}
`;
