
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { API_URL } from "../services/api";

const AuthContext = createContext(null);
const SESSION_DURATION = 24 * 60 * 60 * 1000;

function clearSavedSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("sessionExpiresAt");
}

function getSavedSession() {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const expiresAt = Number(
      localStorage.getItem("sessionExpiresAt")
    );

    if (!token || !user || !expiresAt || Date.now() >= expiresAt) {
      clearSavedSession();
      return null;
    }

    return { token, user, expiresAt };
  } catch {
    clearSavedSession();
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSavedSession);
  const [authLoading, setAuthLoading] = useState(true);

  const logout = useCallback(() => {
    clearSavedSession();
    setSession(null);
  }, []);

  // Verify an existing session with the backend.
  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      if (!session) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/users/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (response.status === 401) {
          if (!cancelled) logout();
          return;
        }

        if (!response.ok) {
          // Keep the session during temporary server errors.
          return;
        }

        const result = await response.json();

        if (!result.success || !result.user) {
          if (!cancelled) logout();
          return;
        }

        if (!cancelled) {
          const updatedSession = {
            ...session,
            user: result.user,
          };

          localStorage.setItem(
            "user",
            JSON.stringify(result.user)
          );

          setSession(updatedSession);
        }
      } catch (error) {
        console.error("Session verification failed:", error);
      } finally {
        if (!cancelled) {
          setAuthLoading(false);
        }
      }
    }

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [session?.token, logout]);

  // Automatically expire the local session after 24 hours.
  useEffect(() => {
    if (!session) return;

    const remainingTime = session.expiresAt - Date.now();

    if (remainingTime <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(logout, remainingTime);

    return () => clearTimeout(timer);
  }, [session?.expiresAt, logout]);

  // Called after a successful login API response.
  const login = useCallback((token, user) => {
    const expiresAt = Date.now() + SESSION_DURATION;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem(
      "sessionExpiresAt",
      String(expiresAt)
    );

    setSession({ token, user, expiresAt });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        token: session?.token || null,
        isLoggedIn: Boolean(session),
        authLoading,
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
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
