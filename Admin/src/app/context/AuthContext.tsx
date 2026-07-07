"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";


interface AuthContextType {
  isLoggedIn: boolean;
  adminEmail: string;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("asg_auth") === "true");
    setAdminEmail(localStorage.getItem("asg_email") || "");
  }, []);

  const login = (email: string) => {
    setIsLoggedIn(true);
    setAdminEmail(email);
    localStorage.setItem("asg_auth", "true");
    localStorage.setItem("asg_email", email);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAdminEmail("");
    localStorage.removeItem("asg_auth");
    localStorage.removeItem("asg_email");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, adminEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

