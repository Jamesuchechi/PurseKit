import { downloadFile, setCookie } from "./utils";

const STORAGE_KEYS = [
  "pulsekit_history_devlens",
  "pulsekit_history_specforge",
  "pulsekit_history_chartgpt",
  "pulsekit-guest-id",
  "pulsekit-guest-name",
  "pulsekit-ai-provider",
  "pulsekit_notifications"
];

export interface PulseWorkspace {
  version: string;
  source: string;
  timestamp: string;
  data: Record<string, string | null>;
}

/**
 * Aggregates all PulseKit local storage data into a single .pulse file.
 */
export function exportWorkspace() {
  const workspaceData: Record<string, string | null> = {};

  STORAGE_KEYS.forEach(key => {
    workspaceData[key] = localStorage.getItem(key);
  });

  const workspace: PulseWorkspace = {
    version: "1.0.0",
    source: "PulseKit Desktop",
    timestamp: new Date().toISOString(),
    data: workspaceData
  };

  const fileName = `pulsekit-workspace-${new Date().toISOString().split('T')[0]}.pulse`;
  downloadFile(JSON.stringify(workspace, null, 2), fileName, "application/json");
}

/**
 * Hydrates the local storage and cookies from a .pulse workspace object.
 */
export function importWorkspace(workspace: PulseWorkspace): boolean {
  try {
    if (workspace.version !== "1.0.0" && workspace.version !== "1.1.0") {
      console.warn("Unsupported workspace version:", workspace.version);
    }

    Object.entries(workspace.data).forEach(([key, value]) => {
      if (value !== null) {
        localStorage.setItem(key, value);
        
        // Sync critical identity keys to cookies as well
        if (key === "pulsekit-guest-id") {
          setCookie("guest-id", value);
        }
        if (key === "pulsekit-guest-name") {
          setCookie("guest-name", value);
        }
      }
    });

    return true;
  } catch (error) {
    console.error("Failed to import workspace:", error);
    return false;
  }
}
