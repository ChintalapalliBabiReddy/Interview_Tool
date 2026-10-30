
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { AUTH_API } from "../constants/apiConstants";

const AuthContext = createContext(null);

const LOGOUT_CHANNEL = "interview-tool-auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check whether the browser has an existing authenticated session.
  const refreshAuth = useCallback(async () => {
    try {
      const response = await fetch(AUTH_API.AUTH_ME, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        setUser(null);
        return false;
      }

      if (!response.ok) {
        throw new Error("Unable to validate authentication session");
      }

      const data = await response.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
        return true;
      }

      setUser(null);
      return false;
    } catch (error) {
      console.error("Session validation error:", error);
      setUser(null);
      return false;
    }
  }, []);

  // Validate the session when the application starts.
  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      try {
        await refreshAuth();
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      active = false;
    };
  }, [refreshAuth]);

  // Listen for logout events from other browser tabs.
  useEffect(() => {
    if (!("BroadcastChannel" in window)) {
      return;
    }

    const channel = new BroadcastChannel(LOGOUT_CHANNEL);

    channel.onmessage = (event) => {
      if (event.data?.type === "LOGOUT") {
        setUser(null);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  // Logout from the current session and notify other tabs.
  const logout = useCallback(async () => {
    const response = await fetch(AUTH_API.LOGOUT, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    setUser(null);

    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(LOGOUT_CHANNEL);
      channel.postMessage({ type: "LOGOUT" });
      channel.close();
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    refreshAuth,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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
