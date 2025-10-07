// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(true);

  // ---- Anonymous Session Creator (with retry limit) ----
  const createAnonymousSession = useCallback(async (retryCount = 0) => {
    if (retryCount > 3) {
      console.error("Max retries reached for anonymous session");
      return;
    }
    try {
      const response = await fetch("/api/auth/anonymous", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to create anonymous session");
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("travily_token", data.token);
        const userData = { isAnonymous: true, anonymousId: data.anonymousId };
        localStorage.setItem("travily_user", JSON.stringify(userData));

        setUser(userData);
        setToken(data.token);
        setIsAuthenticated(true);
        setIsAnonymous(true);
      }
    } catch (error) {
      console.error("Anonymous session error:", error);
      setTimeout(() => createAnonymousSession(retryCount + 1), 1000); // backoff retry
    }
  }, []);

  // ---- Initialize Auth on App Load ----
  const initializeAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("travily_token");
      const userData = localStorage.getItem("travily_user");

      if (token && userData) {
        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userDataObj = JSON.parse(userData);
          setUser(userDataObj);
          setToken(token);
          setIsAuthenticated(true);
          setIsAnonymous(userDataObj.isAnonymous || false);
        } else if (!isAuthenticated) {
          // only create anon session if not already authenticated
          await createAnonymousSession();
        }
      } else if (!isAuthenticated) {
        await createAnonymousSession();
      }
    } catch (error) {
      console.error("Auth init error:", error);
      if (!isAuthenticated) {
        await createAnonymousSession();
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, createAnonymousSession]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // ---- Register ----
  const register = async (userData) => {
    try {
      let currentUser = {};
      try {
        currentUser = JSON.parse(localStorage.getItem("travily_user") || "{}");
      } catch {
        currentUser = {};
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...userData,
          anonymousId: currentUser.anonymousId,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      if (data.token && data.user) {
        localStorage.setItem("travily_token", data.token);
        localStorage.setItem("travily_user", JSON.stringify(data.user));

        setUser(data.user);
        setToken(data.token);
        setIsAuthenticated(true);
        setIsAnonymous(false);
        return true;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // ---- Login ----
  const login = async (credentials) => {
    try {
      let currentUser = {};
      try {
        currentUser = JSON.parse(localStorage.getItem("travily_user") || "{}");
      } catch {
        currentUser = {};
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...credentials,
          anonymousId: currentUser.anonymousId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      if (data.token && data.user) {
        localStorage.setItem("travily_token", data.token);
        localStorage.setItem("travily_user", JSON.stringify(data.user));

        setUser(data.user);
        setToken(data.token);
        setIsAuthenticated(true);
        setIsAnonymous(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // ---- Logout ----
  const logout = () => {
    localStorage.removeItem("travily_token");
    localStorage.removeItem("travily_user");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setIsAnonymous(true);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isAnonymous,
    loading,
    register,
    login,
    logout,
    createAnonymousSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
