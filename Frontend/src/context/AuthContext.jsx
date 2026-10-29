
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function getSavedSession() {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const expiresAt = Number(localStorage.getItem("sessionExpiresAt"));

    if (!token || !user || !expiresAt || Date.now() >= expiresAt) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("sessionExpiresAt");
      return null;
    }

    return { token, user, expiresAt };
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionExpiresAt");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSavedSession);

  useEffect(() => {
    if (!session) return;

    const remainingTime = session.expiresAt - Date.now();

    if (remainingTime <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      logout();
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [session]);

  function login(token, user) {
    const expiresAt = Date.now() + SESSION_DURATION;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("sessionExpiresAt", String(expiresAt));

    setSession({ token, user, expiresAt });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionExpiresAt");
    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        token: session?.token || null,
        isLoggedIn: Boolean(session),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
