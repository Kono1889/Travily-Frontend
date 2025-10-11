// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import config from '../config'; // Import the config file

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

  // Use config.apiUrl instead of getBaseUrl function
  const apiFetch = async (endpoint, options = {}) => {
    const url = `${config.apiUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned HTML instead of JSON: ${text.substring(0, 100)}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API call failed for ${url}:`, error);
      throw error;
    }
  };

  // ---- Anonymous Session Creator ----
  const createAnonymousSession = useCallback(async (retryCount = 0) => {
    if (retryCount > 2) {
      console.error("Max retries reached for anonymous session");
      return;
    }
    try {
      const data = await apiFetch('/api/auth/anonymous', {
        method: "POST",
      });

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
      // Only retry in development
      if (config.apiUrl.includes('localhost')) {
        setTimeout(() => createAnonymousSession(retryCount + 1), 1000);
      }
    }
  }, []);

  // ---- Initialize Auth on App Load ----
  const initializeAuth = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("travily_token");
      const storedUser = localStorage.getItem("travily_user");

      if (storedToken && storedUser) {
        try {
          const data = await apiFetch('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (data.valid) {
            setUser(data.user);
            setToken(storedToken);
            setIsAuthenticated(true);
            setIsAnonymous(data.user.isAnonymous || false);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log("Token verification failed:", error);
          // Continue to anonymous session
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
      
      const data = await apiFetch('/api/auth/register', {
        method: "POST",
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          username: userData.username,
          anonymousId: currentUser.anonymousId,
        }),
      });

      localStorage.setItem("travily_token", data.token);
      localStorage.setItem("travily_user", JSON.stringify(data.user));

      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      setIsAnonymous(false);
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = error.message;
      
      // Better error messages for users
      if (errorMessage.includes('HTML instead of JSON')) {
        errorMessage = "Server configuration error. Please contact support.";
      } else if (errorMessage.includes('Failed to fetch')) {
        errorMessage = "Network error. Please check your connection.";
      }
      
      throw new Error(errorMessage);
    }
  };

  // ---- Login ----
  const login = async (credentials) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("travily_user") || "{}");
      
      const data = await apiFetch('/api/auth/login', {
        method: "POST",
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          anonymousId: currentUser.anonymousId,
        }),
      });

      localStorage.setItem("travily_token", data.token);
      localStorage.setItem("travily_user", JSON.stringify(data.user));

      setUser(data.user);
      setToken(data.token);
      setIsAuthenticated(true);
      setIsAnonymous(false);
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = error.message;
      
      // Better error messages for users
      if (errorMessage.includes('HTML instead of JSON')) {
        errorMessage = "Server configuration error. Please contact support.";
      } else if (errorMessage.includes('Failed to fetch')) {
        errorMessage = "Network error. Please check your connection.";
      } else if (errorMessage.includes('401')) {
        errorMessage = "Invalid email or password.";
      }
      
      throw new Error(errorMessage);
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
    if (config.apiUrl.includes('localhost')) {
      createAnonymousSession();
    }
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