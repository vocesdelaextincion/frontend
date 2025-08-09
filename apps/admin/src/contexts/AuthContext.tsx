import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import api from "../services/api";

export interface AuthContextType {
  token: string | null;
  login: (token: string, callback?: () => void) => void;
  logout: (callback?: () => void) => void;
  isAuthenticated: boolean;
  validateToken: () => Promise<boolean>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const login = (newToken: string, callback?: () => void) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    // Set loading to false immediately since we just got a valid token
    setIsLoading(false);
    if (callback) {
      callback();
    }
  };

  const logout = (callback?: () => void) => {
    setToken(null);
    localStorage.removeItem("token");
    if (callback) {
      callback();
    }
  };

  const validateToken = useCallback(async (): Promise<boolean> => {
    if (!token) {
      setIsLoading(false);
      return false;
    }

    try {
      // Make a request to validate the token
      const response = await api.get("/auth/me");
      // If we get here without an error, the token is valid
      if (response && response.id) {
        setIsLoading(false);
        return true;
      }
      throw new Error("Invalid token");
    } catch {
      // Token is invalid, remove it
      setToken(null);
      localStorage.removeItem("token");
      setIsLoading(false);
      return false;
    }
  }, [token]);

  // Validate token on app startup
  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setIsLoading(false);
    }
  }, [token, validateToken]);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated,
        validateToken,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
