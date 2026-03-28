"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface User {
  id: string;
  name: string;
  email: string;
}

interface SessionContextType {
  user: User | null;
  isLoading: boolean;
  initializeSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function LocalSessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncToCookies = (id: string, name: string) => {
    // Set cookies that the server (lib/auth.ts) can read
    document.cookie = `guest-id=${id}; path=/; max-age=31536000; SameSite=Lax`;
    document.cookie = `guest-name=${name}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const initializeSession = React.useCallback(() => {
    let storedId = localStorage.getItem("pulsekit-guest-id");
    const storedName = localStorage.getItem("pulsekit-guest-name") || "Guest User";

    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("pulsekit-guest-id", storedId);
      localStorage.setItem("pulsekit-guest-name", storedName);
    }

    const newUser: User = {
      id: storedId as string,
      name: storedName,
      email: "guest@example.com",
    };

    setUser(newUser);
    syncToCookies(newUser.id, newUser.name);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const storedId = localStorage.getItem("pulsekit-guest-id");
    if (storedId) {
      const storedName = localStorage.getItem("pulsekit-guest-name") || "Guest User";
      const existingUser: User = {
        id: storedId,
        name: storedName,
        email: "guest@example.com",
      };
      setUser(existingUser);
      syncToCookies(existingUser.id, existingUser.name);
      setIsLoading(false);
    } else {
      // Auto-initialize for new visitors or deep links
      initializeSession();
    }
  }, [initializeSession]);

  return (
    <SessionContext.Provider value={{ user, isLoading, initializeSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useLocalSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useLocalSession must be used within a LocalSessionProvider");
  }
  return context;
}
