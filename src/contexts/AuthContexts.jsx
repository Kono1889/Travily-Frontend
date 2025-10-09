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

  // ---- Anonymous Session Creator ----
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
        localStorage.setItem("travily_user", JSON.stringify(data.user));

        setUser(data.user);
        setToken(data.token);
        setIsAuthenticated(true);
        setIsAnonymous(true);
      }
    } catch (error) {
      console.error("Anonymous session error:", error);
      setTimeout(() => createAnonymousSession(retryCount + 1), 1000);
    }
  }, []);

  // ---- Initialize Auth on App Load ----
  const initializeAuth = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("travily_token");
      const storedUser = localStorage.getItem("travily_user");

      if (storedToken && storedUser) {
        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.valid) {
            setUser(data.user);
            setToken(storedToken);
            setIsAuthenticated(true);
            setIsAnonymous(data.user.isAnonymous || false);
            setLoading(false);
            return;
          }
        }
        // If verification fails, clear invalid tokens
        localStorage.removeItem("travily_token");
        localStorage.removeItem("travily_user");
      }
      
      // Create anonymous session if no valid auth
      await createAnonymousSession();
    } catch (error) {
      console.error("Auth init error:", error);
      await createAnonymousSession();
    } finally {
      setLoading(false);
    }
  }, [createAnonymousSession]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // ---- Register ----
  const register = async (userData) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("travily_user") || "{}");
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          username: userData.username,
          anonymousId: currentUser.anonymousId,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Your backend returns { error: "message" } for errors
        throw new Error(data.error || "Registration failed");
      }

      // Your backend returns { token, user } on success
      localStorage.setItem("travily_token", data.token);
      localStorage.setItem("travily_user", JSON.stringify(data.user));

      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      setIsAnonymous(false);
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // ---- Login ----
  const login = async (credentials) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("travily_user") || "{}");
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          anonymousId: currentUser.anonymousId,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Your backend returns { error: "Invalid credentials" } for login failures
        throw new Error(data.error || "Login failed");
      }

      // Your backend returns { token, user } on success
      localStorage.setItem("travily_token", data.token);
      localStorage.setItem("travily_user", JSON.stringify(data.user));

      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      setIsAnonymous(false);
      
      return true;
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
    
    // Create new anonymous session after logout
    createAnonymousSession();
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