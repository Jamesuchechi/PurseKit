"use client";

import * as React from "react";
import { type Module, type HistoryItem } from "@/types";

/**
 * Hook for managing module-specific history backed by the DB API.
 * The external API (items, save, remove, clear, find) is identical to
 * the previous localStorage version so no page components need changes.
 */
export function useHistory<T = unknown>(module: Module) {
  const [items, setItems] = React.useState<HistoryItem<T>[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // ─── Fetch on mount ─────────────────────────────────────────
  React.useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/history?module=${module}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch history");
        return res.json() as Promise<HistoryItem<T>[]>;
      })
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err) => {
        console.error("[useHistory] Failed to load history:", err);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [module]);

  // ─── Save ────────────────────────────────────────────────────
  const save = async (
    item: Omit<HistoryItem<T>, "id" | "createdAt" | "timestamp" | "module">
  ): Promise<HistoryItem<T> | null> => {
    try {
      const res = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, module }),
      });

      if (!res.ok) throw new Error("Failed to save history item");

      const newItem = (await res.json()) as HistoryItem<T>;
      setItems((prev) => [newItem, ...prev].slice(0, 50));
      return newItem;
    } catch (err) {
      console.error("[useHistory] Failed to save:", err);
      return null;
    }
  };

  // ─── Remove ──────────────────────────────────────────────────
  const remove = async (id: string): Promise<void> => {
    // Optimistic update
    setItems((prev) => prev.filter((i) => i.id !== id));

    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (!res.ok) {
        // Revert on failure
        const data = await fetch(`/api/history?module=${module}`).then((r) =>
          r.json()
        );
        setItems(data);
        throw new Error("Failed to delete history item");
      }
    } catch (err) {
      console.error("[useHistory] Failed to remove:", err);
    }
  };

  // ─── Clear ───────────────────────────────────────────────────
  const clear = async (): Promise<void> => {
    const snapshot = items;
    setItems([]);

    try {
      await Promise.all(
        snapshot.map((item) =>
          fetch(`/api/history/${item.id}`, { method: "DELETE" })
        )
      );
    } catch (err) {
      console.error("[useHistory] Failed to clear history:", err);
      setItems(snapshot);
    }
  };

  const find = (id: string) => items.find((i) => i.id === id);

  return { items, isLoading, save, remove, clear, find };
}
