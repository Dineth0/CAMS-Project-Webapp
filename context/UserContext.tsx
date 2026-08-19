"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: number;
  userName: string;
  image: string
  email: string;
  role: "USER" | "PLAYER" | "ADMIN";
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserFromStorage = () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem("user");
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to load user from storage", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser, refreshUser: loadUserFromStorage }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}