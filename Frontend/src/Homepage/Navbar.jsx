import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, LogOut, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const SCROLL_OFFSET = 40; // px scrolled before the navbar gets its color

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const cancelRef = useRef(null);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const close = () => setNavOpen(false);
  const firstName = user?.name?.trim().split(/\s+/)[0] || "User";

  // opens the confirmation dialog instead of logging out right away
  function askLogout() {
    close();
    setConfirmOpen(true);
  }

  // runs only after the user confirms
  function confirmLogout() {
    logout();
    setConfirmOpen(false);
    setToast(true);
    navigate("/", { replace: true });
  }

  // transparent at the top, solid after scrolling
  // (state only changes when the threshold is crossed, so this stays cheap)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_OFFSET);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu with Escape
  useEffect(() => {
    if (!navOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") setNavOpen(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  // logout dialog: Escape closes it, focus goes to Cancel, page scroll is locked
  useEffect(() => {
    if (!confirmOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") setConfirmOpen(false);
    };

    window.addEventListener("keydown", onKey);
    cancelRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [confirmOpen]);

  // success notification: hides itself after 3 seconds
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <>
      <header className={`nv-header${scrolled ? " is-scrolled" : ""}`}>
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
                <span className="nv-user">Hello, {firstName}</span>

                <button
                  type="button"
                  className="nv-link nv-outline nv-button"
                  onClick={askLogout}
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
                  Hello, {firstName}
                </span>

                <button
                  type="button"
                  className="nv-m-link nv-m-button"
                  onClick={askLogout}
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nv-m-link" onClick={close}>
                  LOGIN
                </Link>

                <Link to="/register" className="nv-m-link" onClick={close}>
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

      {/* Logout confirmation dialog (portal so it covers the whole page) */}
      {confirmOpen &&
        createPortal(
          <div className="nv-overlay" onClick={() => setConfirmOpen(false)}>
            <style>{css}</style>
            <div
              className="nv-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="nv-dialog-title"
              aria-describedby="nv-dialog-desc"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="nv-dialog-icon">
                <LogOut size={22} />
              </div>

              <h2 id="nv-dialog-title">Log out?</h2>
              <p id="nv-dialog-desc">
                Are you sure you want to log out of your ExportYard account?
              </p>

              <div className="nv-dialog-actions">
                <button
                  ref={cancelRef}
                  type="button"
                  className="nv-link nv-outline nv-button"
                  onClick={() => setConfirmOpen(false)}
                >
                  CANCEL
                </button>

                <button
                  type="button"
                  className="nv-link nv-cta nv-button-solid"
                  onClick={confirmLogout}
                >
                  YES, LOGOUT
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Logout success notification */}
      {toast &&
        createPortal(
          <div className="nv-toast" role="status" aria-live="polite">
            <style>{css}</style>
            <span className="nv-toast-icon">
              <Check size={16} />
            </span>
            <span>Logged out successfully</span>
            <button
              type="button"
              className="nv-toast-close"
              onClick={() => setToast(false)}
              aria-label="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>,
          document.body
        )}
    </>
  );
};

const css = `
.nv-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  background: rgba(10,22,40,0);
  border-bottom: 1px solid rgba(56,189,208,0);
  transition: background-color .35s ease, border-color .35s ease, box-shadow .35s ease;
}

/* after scrolling: smooth fade to the solid navy bar */
.nv-header.is-scrolled {
  background: rgba(10,22,40,.97);
  border-bottom-color: rgba(56,189,208,.2);
  box-shadow: 0 8px 24px -12px rgba(0,0,0,.6);
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
  filter: drop-shadow(0 1px 6px rgba(8,26,48,.45));
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
  text-shadow: 0 1px 8px rgba(8,26,48,.45);
  transition: background .2s, border-color .2s, transform .2s;
}

.nv-link:hover {
  background: rgba(255,255,255,.12);
}

.nv-outline {
  border: 1px solid rgba(255,255,255,.4);
}

.nv-outline:hover {
  border-color: rgba(255,255,255,.75);
}

.nv-button {
  cursor: pointer;
  background: transparent;
  font-family: inherit;
}

.nv-cta {
  background: #ffc58f;
  color: #10222e;
  text-shadow: none;
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
  text-shadow: 0 1px 8px rgba(8,26,48,.45);
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
  filter: drop-shadow(0 1px 6px rgba(8,26,48,.45));
}

/* the open mobile menu keeps a dark panel so the links stay readable */
.nv-mobile {
  display: flex;
  flex-direction: column;
  gap: .25rem;
  margin: 0 .75rem .75rem;
  padding: .75rem 1.25rem 1.25rem;
  border: 1px solid rgba(56,189,208,.2);
  border-radius: 14px;
  background: rgba(10,22,40,.96);
  box-shadow: 0 20px 40px -16px rgba(0,0,0,.6);
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
  font-family: inherit;
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

/* ---------- logout confirmation dialog ---------- */
.nv-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(5,12,24,.7);
  backdrop-filter: blur(4px);
  animation: nv-fade .2s ease;
}

.nv-dialog {
  width: 100%;
  max-width: 24rem;
  padding: 1.75rem 1.5rem 1.5rem;
  text-align: center;
  color: #fff;
  background: rgba(10,22,40,.98);
  border: 1px solid rgba(56,189,208,.25);
  border-radius: 16px;
  box-shadow: 0 24px 60px -16px rgba(0,0,0,.7);
  animation: nv-pop .25s ease;
}

.nv-dialog-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  margin-bottom: .9rem;
  border-radius: 50%;
  color: #ffc58f;
  background: rgba(255,197,143,.12);
  border: 1px solid rgba(255,197,143,.35);
}

.nv-dialog h2 {
  margin: 0 0 .4rem;
  font-size: 1.15rem;
  font-weight: 700;
}

.nv-dialog p {
  margin: 0 0 1.4rem;
  font-size: .85rem;
  line-height: 1.5;
  color: rgba(255,255,255,.7);
}

.nv-dialog-actions {
  display: flex;
  gap: .75rem;
  justify-content: center;
}

.nv-dialog-actions .nv-link {
  flex: 1;
  text-align: center;
  cursor: pointer;
  font-family: inherit;
}

.nv-button-solid {
  border: 0;
}

/* ---------- logout success notification ---------- */
.nv-toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 110;
  display: flex;
  align-items: center;
  gap: .65rem;
  max-width: calc(100vw - 2rem);
  padding: .8rem .9rem .8rem 1rem;
  font-size: .85rem;
  font-weight: 600;
  color: #fff;
  background: rgba(10,22,40,.98);
  border: 1px solid rgba(56,189,208,.3);
  border-left: 3px solid #38bdd0;
  border-radius: 12px;
  box-shadow: 0 16px 40px -12px rgba(0,0,0,.65);
  animation: nv-slide .3s ease;
}

.nv-toast-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  border-radius: 50%;
  color: #10222e;
  background: #38bdd0;
}

.nv-toast-close {
  display: inline-flex;
  padding: .25rem;
  margin-left: .25rem;
  color: rgba(255,255,255,.6);
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}

.nv-toast-close:hover {
  color: #fff;
}

.nv-toast-close:focus-visible {
  outline: 2px solid #ffd9a0;
  outline-offset: 2px;
}

@keyframes nv-slide {
  from { opacity: 0; transform: translateX(16px); }
  to { opacity: 1; transform: none; }
}

@keyframes nv-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes nv-pop {
  from { opacity: 0; transform: translateY(8px) scale(.97); }
  to { opacity: 1; transform: none; }
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
  .nv-header,
  .nv-link,
  .nv-overlay,
  .nv-dialog,
  .nv-toast {
    transition: none;
    animation: none;
  }
}
`;

export default Navbar;