
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const close = () => setNavOpen(false);

  function handleLogout() {
    logout();
    close();
    navigate("/", { replace: true });
  }

  useEffect(() => {
    if (!navOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") setNavOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  return (
    <header className="nv-header">
      <style>{css}</style>

      <div className="nv-bar">
        {/* Logo */}
        <Link
          to="/"
          onClick={close}
          className="nv-logo"
          aria-label="ExportYard home"
        >
          <img src="/Images/logo.png" alt="ExportYard Logo" />
        </Link>

        {/* Desktop navigation */}
        <div className="nv-desktop">
          {isLoggedIn ? (
            <>
              <span className="nv-user">
                Hello, {user?.name?.trim().split(/\s+/)[0] || "User"}
              </span>

              <button
                type="button"
                className="nv-link nv-outline nv-button"
                onClick={handleLogout}
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nv-link">
                LOGIN
              </Link>

              <Link to="/register" className="nv-link nv-outline">
                SIGN UP
              </Link>
            </>
          )}

          <a href="/#contact" className="nv-link nv-cta">
            REQUEST A QUOTE
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="nv-toggle"
          onClick={() => setNavOpen((open) => !open)}
          aria-label={navOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={navOpen}
          aria-controls="nv-mobile"
        >
          {navOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {navOpen && (
        <nav id="nv-mobile" className="nv-mobile" aria-label="Mobile">
          {isLoggedIn ? (
            <>
              <span className="nv-user nv-mobile-user">
                Hello, {user?.name?.trim().split(/\s+/)[0] || "User"}
              </span>

              <button
                type="button"
                className="nv-m-link nv-m-button"
                onClick={handleLogout}
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nv-m-link"
                onClick={close}
              >
                LOGIN
              </Link>

              <Link
                to="/register"
                className="nv-m-link"
                onClick={close}
              >
                SIGN UP
              </Link>
            </>
          )}

          <a
            href="/#contact"
            className="nv-link nv-cta nv-m-cta"
            onClick={close}
          >
            REQUEST A QUOTE
          </a>
        </nav>
      )}
    </header>
  );
};

const css = `
.nv-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  background: #0a1628;
  border-bottom: 1px solid rgba(56,189,208,.2);
}

.nv-bar {
  max-width: 72rem;
  margin: 0 auto;
  padding: .75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nv-logo {
  display: inline-flex;
  line-height: 0;
}

.nv-logo img {
  height: 2.5rem;
  width: auto;
  display: block;
}

.nv-desktop {
  display: none;
  align-items: center;
  gap: .75rem;
}

.nv-link {
  display: inline-block;
  padding: .6rem 1.25rem;
  border-radius: 999px;
  font-size: .75rem;
  font-weight: 600;
  letter-spacing: .08em;
  color: #fff;
  text-decoration: none;
  white-space: nowrap;
  transition: background .2s, border-color .2s, transform .2s;
}

.nv-link:hover {
  background: rgba(255,255,255,.08);
}

.nv-outline {
  border: 1px solid rgba(255,255,255,.3);
}

.nv-outline:hover {
  border-color: rgba(255,255,255,.6);
}

.nv-button {
  cursor: pointer;
  background: transparent;
}

.nv-cta {
  background: #ffc58f;
  color: #10222e;
}

.nv-cta:hover {
  background: #ffd7b0;
  transform: translateY(-1px);
}

.nv-user {
  color: #fff;
  font-size: .8rem;
  font-weight: 600;
  letter-spacing: .02em;
}

.nv-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  background: transparent;
  border: 0;
  color: #fff;
  cursor: pointer;
  border-radius: 8px;
}

.nv-mobile {
  display: flex;
  flex-direction: column;
  gap: .25rem;
  padding: .75rem 1.5rem 1.25rem;
  border-top: 1px solid rgba(56,189,208,.2);
  background: #0a1628;
}

.nv-m-link {
  display: block;
  padding: .85rem 0;
  color: #fff;
  text-decoration: none;
  font-size: .8rem;
  font-weight: 600;
  letter-spacing: .08em;
  border-bottom: 1px solid rgba(255,255,255,.08);
}

.nv-m-button {
  background: transparent;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  text-align: left;
  cursor: pointer;
  width: 100%;
}

.nv-mobile-user {
  padding: .85rem 0;
}

.nv-m-cta {
  margin-top: .9rem;
  padding: .9rem 1.25rem;
  text-align: center;
}

.nv-link:focus-visible,
.nv-m-link:focus-visible,
.nv-toggle:focus-visible,
.nv-logo:focus-visible {
  outline: 2px solid #ffd9a0;
  outline-offset: 3px;
}

@media (min-width: 768px) {
  .nv-desktop {
    display: flex;
  }

  .nv-toggle,
  .nv-mobile {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nv-link {
    transition: none;
  }
}
`;

export default Navbar;
