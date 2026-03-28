"use client";

import * as React from "react";
import { type Module, type HistoryItem } from "@/types";

/**
 * Hook for managing module-specific history in localStorage.
 */
export function useHistory<T = unknown>(module: Module) {
  const [items, setItems] = React.useState<HistoryItem<T>[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem(`pulsekit_history_${module}`);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, [module]);

  const save = (item: Omit<HistoryItem<T>, "id" | "createdAt" | "timestamp" | "module">) => {
    const now = new Date();
    const newItem: HistoryItem<T> = {
      ...item,
      id: Math.random().toString(36).substring(2, 11),
      module,
      createdAt: now.toISOString(),
      timestamp: now.toLocaleString(),
    } as HistoryItem<T>;

    const updated = [newItem, ...items].slice(0, 50); // Keep last 50
    setItems(updated);
    localStorage.setItem(`pulsekit_history_${module}`, JSON.stringify(updated));
    return newItem;
  };

  const remove = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    localStorage.setItem(`pulsekit_history_${module}`, JSON.stringify(updated));
  };

  const clear = () => {
    setItems([]);
    localStorage.removeItem(`pulsekit_history_${module}`);
  };

  const find = (id: string) => items.find((i) => i.id === id);

  return { items, save, remove, clear, find };
}
