"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  clearUser,
  getStoredUser,
  saveUser,
} from "@/lib/auth-storage";
import type { User } from "@/lib/types";

type AuthContextValue = {
  user: User | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: Omit<User, "id" | "createdAt"> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setIsReady(true);
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    const existing = getStoredUser();
    if (existing && existing.email === email) {
      setUser(existing);
      return true;
    }
    if (email) {
      const demo: User = {
        id: "demo-user",
        name: "کاربر کوبار",
        email,
        phone: "۰۹۱۲۳۴۵۶۷۸۹",
        address: "تهران، نیاوران",
        createdAt: new Date().toISOString(),
      };
      saveUser(demo);
      setUser(demo);
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(
    async (data: Omit<User, "id" | "createdAt"> & { password: string }) => {
      const newUser: User = {
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        createdAt: new Date().toISOString(),
      };
      saveUser(newUser);
      setUser(newUser);
      return true;
    },
    [],
  );

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (data: Partial<User>) => {
      if (!user) return;
      const updated = { ...user, ...data };
      saveUser(updated);
      setUser(updated);
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{ user, isReady, login, signup, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
