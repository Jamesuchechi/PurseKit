"use client";

import * as React from "react";

/**
 * Hook to manage the first-visit onboarding state.
 * Uses localStorage to persist the status.
 */
export function useOnboarding() {
  const [isOnboarded, setIsOnboarded] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const status = window.localStorage.getItem("pulsekit_onboarded");
    setIsOnboarded(status === "true");
  }, []);

  const completeOnboarding = () => {
    window.localStorage.setItem("pulsekit_onboarded", "true");
    setIsOnboarded(true);
  };

  const resetOnboarding = () => {
    window.localStorage.removeItem("pulsekit_onboarded");
    setIsOnboarded(false);
  };

  return { 
    isOnboarded, 
    completeOnboarding, 
    resetOnboarding,
    isLoading: isOnboarded === null 
  };
}
