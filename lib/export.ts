import { downloadFile } from "./utils";

/**
 * Core export utilities for Markdown and JSON.
 * PNG export is usually handled client-side via html2canvas/dom-to-image (not implemented yet).
 */

export function exportMarkdown(content: string, fileName = "pulsekit-export.md") {
  downloadFile(content, fileName, "text/markdown");
}

export function exportJSON(data: unknown, fileName = "pulsekit-export.json") {
  const content = JSON.stringify(data, null, 2);
  downloadFile(content, fileName, "application/json");
}

export function exportPNG(_elementId: string) {
  // Placeholder for PNG export logic
  // This would typically use html2canvas or similar libraries
  console.warn(`PNG export not implemented for element ID: ${_elementId}. Requires additional dependencies.`);
}
