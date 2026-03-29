"use client";

import * as React from "react";
import { type Notification } from "@/types";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "pulsekit_notifications";

const INITIAL_WELCOME_NOTIFICATION: Notification = {
  id: "welcome",
  type: "success",
  title: "Welcome to PulseKit",
  message: "Your AI-native workspace is ready. Explore DevLens, SpecForge, and ChartGPT to accelerate your workflow.",
  time: new Date().toISOString(),
  read: false,
  action: "Get Started",
  actionHref: "/dashboard"
};

export function useNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // ─── Initial Load ─────────────────────────────────────────
  React.useEffect(() => {
    const loadNotifications = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setNotifications(JSON.parse(stored));
        } else {
          const welcome = {
            ...INITIAL_WELCOME_NOTIFICATION,
            time: new Date().toISOString()
          };
          const initial = [welcome];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
          setNotifications(initial);
        }
      } catch (err) {
        console.error("[useNotifications] Failed to load notifications:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      loadNotifications();
    }
  }, []);

  // ─── Sync with LocalStorage ─────────────────────────────────
  const syncStorage = (newNotifications: Notification[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotifications));
    } catch (err) {
      console.error("[useNotifications] Sync failed:", err);
    }
  };

  // ─── Add ───────────────────────────────────────────────────
  const addNotification = React.useCallback((
    data: Omit<Notification, "id" | "time" | "read">
  ) => {
    const newNotification: Notification = {
      ...data,
      id: generateId(),
      time: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 100);
      syncStorage(updated);
      return updated;
    });
    
    return newNotification;
  }, []);

  // ─── Mark Read ─────────────────────────────────────────────
  const markAsRead = React.useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map((n) => n.id === id ? { ...n, read: true } : n);
      syncStorage(updated);
      return updated;
    });
  }, []);

  const markAllAsRead = React.useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      syncStorage(updated);
      return updated;
    });
  }, []);

  // ─── Remove ────────────────────────────────────────────────
  const removeNotification = React.useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.filter((n) => n.id !== id);
      syncStorage(updated);
      return updated;
    });
  }, []);

  const clearAll = React.useCallback(() => {
    setNotifications([]);
    syncStorage([]);
  }, []);

  return {
    notifications,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
}
