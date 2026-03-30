"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Hook to generate links that preserve the `view=app` parameter
 * if it's already present in the current URL.
 */
export function useAdaptiveLink() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  const getAdaptiveHref = useCallback((href: string) => {
    // If we're already on a page with view=app, or if it's an app-specific path,
    // we want to ensure any internal static page link includes ?view=app.
    if (view === "app") {
      const url = new URL(href, "http://localhost"); // Base doesn't matter for relative paths
      url.searchParams.set("view", "app");
      return url.pathname + url.search;
    }
    return href;
  }, [view]);

  return { getAdaptiveHref, isAppView: view === "app" };
}
