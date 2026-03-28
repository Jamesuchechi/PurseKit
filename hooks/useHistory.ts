"use client";

import * as React from "react";
import { type Module, type HistoryItem } from "@/types";

/**
 * Hook for managing module-specific history backed by localStorage.
 * This completely removes the database/API dependency for history.
 */
export function useHistory<T = unknown>(module: Module) {
  const [items, setItems] = React.useState<HistoryItem<T>[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const STORAGE_KEY = `pulsekit_history_${module}`;

  // ─── Load on mount ─────────────────────────────────────────
  React.useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        }
      } catch (err) {
        console.error("[useHistory] Failed to load history from localStorage:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [module, STORAGE_KEY]);

  // ─── Helper: Persist to Storage ────────────────────────────
  const persist = (newItems: HistoryItem<T>[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      setItems(newItems);
    } catch (err) {
      console.error("[useHistory] Failed to persist history:", err);
    }
  };

  // ─── Save ────────────────────────────────────────────────────
  const save = async (
    itemData: Omit<HistoryItem<T>, "id" | "createdAt" | "timestamp" | "module">
  ): Promise<HistoryItem<T> | null> => {
    const now = new Date();
    const newItem: HistoryItem<T> = {
      ...itemData,
      id: crypto.randomUUID(),
      module,
      createdAt: now.toISOString(),
      timestamp: now.toLocaleString(),
    } as HistoryItem<T>;

    const newItems = [newItem, ...items].slice(0, 50);
    persist(newItems);
    return newItem;
  };

  // ─── Remove ──────────────────────────────────────────────────
  const remove = async (id: string): Promise<void> => {
    const newItems = items.filter((i) => i.id !== id);
    persist(newItems);
  };

  // ─── Clear ───────────────────────────────────────────────────
  const clear = async (): Promise<void> => {
    persist([]);
  };

  const find = (id: string) => items.find((i) => i.id === id);

  return { items, isLoading, save, remove, clear, find };
}
