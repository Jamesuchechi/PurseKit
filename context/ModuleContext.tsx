"use client";

import * as React from "react";
import { type Module } from "@/types";

interface ModuleContextType {
  activeModule: Module | "home";
  lastResult: unknown;
  updateContext: (module: Module | "home", result: unknown) => void;
  clearContext: () => void;
}

const ModuleContext = React.createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const [activeModule, setActiveModule] = React.useState<Module | "home">("home");
  const [lastResult, setLastResult] = React.useState<unknown>(null);

  const updateContext = React.useCallback((module: Module | "home", result: unknown) => {
    setActiveModule(module);
    setLastResult(result);
  }, []);

  const clearContext = React.useCallback(() => {
    setLastResult(null);
  }, []);

  return (
    <ModuleContext.Provider value={{ activeModule, lastResult, updateContext, clearContext }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModuleContext() {
  const context = React.useContext(ModuleContext);
  if (!context) {
    throw new Error("useModuleContext must be used within a ModuleProvider");
  }
  return context;
}
