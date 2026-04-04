"use client";

import { type Module } from "@/types";
import { v4 as uuidv4 } from "uuid";

export type AuditEvent = 
  | "GENERATE"
  | "EXPORT" 
  | "ERROR"
  | "PROVIDER_SWITCH"
  | "LOGIN"
  | "THEME_CHANGE"
  | "HISTORY_CLEAR";

export interface AuditRecord {
  id: string;
  timestamp: string;
  event: AuditEvent;
  module: Module | "system";
  message: string;
  metadata?: Record<string, unknown>;
}

const STORAGE_KEY = "pulsekit_audit_trail";

/**
 * PulseKit Audit Service
 */
export const AuditService = {
  /**
   * Logs a new event to the audit trail.
   */
  log: (params: {
    event: AuditEvent;
    module: Module | "system";
    message: string;
    metadata?: Record<string, unknown>;
  }) => {
    if (typeof window === "undefined") return;

    try {
      const record: AuditRecord = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        ...params,
      };

      const existing = localStorage.getItem(STORAGE_KEY);
      const trail: AuditRecord[] = existing ? JSON.parse(existing) : [];
      
      // Limit to 1000 records for performance
      const updated = [record, ...trail].slice(0, 1000);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Optional: Dispatch event for real-time UI updates
      window.dispatchEvent(new CustomEvent("pulsekit:audit_log", { detail: record }));
    } catch (err) {
      console.error("Failed to log audit event:", err);
    }
  },

  /**
   * Returns all audit records.
   */
  getTrail: (): AuditRecord[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  /**
   * Clears the entire audit trail.
   */
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    AuditService.log({
      event: "HISTORY_CLEAR",
      module: "system",
      message: "User manually cleared the entire audit trail."
    });
  }
};
