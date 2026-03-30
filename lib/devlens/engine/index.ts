"use client";

/**
 * Local interfaces for external CDN-loaded libraries.
 */
interface Babel {
  transform: (
    code: string, 
    options: {
      presets: (string | [string, Record<string, unknown>])[];
      [key: string]: unknown;
    }
  ) => { code: string };
}

interface Pyodide {
  setStdout: (config: { batched: (msg: string) => void }) => void;
  setStderr: (config: { batched: (msg: string) => void }) => void;
  runPythonAsync: (code: string) => Promise<unknown>;
}

/**
 * Global registry for engines to prevent multiple initializations.
 */
let pyodideInstance: Pyodide | null = null;
let pyodidePromise: Promise<Pyodide | null> | null = null;
let babelInstance: Babel | null = null;
let babelPromise: Promise<Babel | null> | null = null;

// Track script loading promises to prevent duplicate script tags
const scriptPromises: Record<string, Promise<void>> = {};

const BABEL_URL = "https://unpkg.com/@babel/standalone/babel.min.js";
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";

/**
 * Loads a script from a URL and returns a promise.
 */
function loadScript(url: string, timeoutMs: number = 30000): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (url in scriptPromises) return scriptPromises[url];

  if (document.querySelector(`script[src="${url}"]`)) {
    return Promise.resolve();
  }

  scriptPromises[url] = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;

    const timeout = setTimeout(() => {
      reject(new Error(`Timeout loading script: ${url}`));
    }, timeoutMs);

    script.onload = () => {
      clearTimeout(timeout);
      resolve();
    };
    script.onerror = () => {
      clearTimeout(timeout);
      delete scriptPromises[url]; // Allow retry if it failed
      reject(new Error(`Failed to load script: ${url}`));
    };
    document.head.appendChild(script);
  });

  return scriptPromises[url];
}

/**
 * Initializes and returns the Babel instance.
 */
export async function getBabel(onLog?: (log: ExecutionLog) => void): Promise<Babel | null> {
  if (babelInstance) return babelInstance;
  if (babelPromise) return babelPromise;

  babelPromise = (async () => {
    try {
      if (typeof window === "undefined") return null;
      
      onLog?.({ type: "system", message: "Loading Babel transpiler...", timestamp: new Date() });
      await loadScript(BABEL_URL);
      
      babelInstance = (window as unknown as { Babel?: Babel }).Babel || null;
      if (babelInstance) {
        onLog?.({ type: "system", message: "Babel environment ready.", timestamp: new Date() });
      }
      return babelInstance;
    } catch (err) {
      babelPromise = null; // Reset so we can try again
      throw err;
    }
  })();

  return babelPromise;
}

/**
 * Initializes and returns the Pyodide instance.
 */
export async function getPyodide(onLog?: (log: ExecutionLog) => void): Promise<Pyodide | null> {
  if (pyodideInstance) return pyodideInstance;
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = (async () => {
    try {
      if (typeof window === "undefined") return null;

      onLog?.({ type: "system", message: "Downloading Python runtime (Pyodide)...", timestamp: new Date() });
      await loadScript(PYODIDE_URL);
      
      onLog?.({ type: "system", message: "Initializing WebAssembly environment...", timestamp: new Date() });
      const loadPyodide = (window as unknown as { loadPyodide: (options: Record<string, unknown>) => Promise<Pyodide> }).loadPyodide;
      
      pyodideInstance = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
      });

      onLog?.({ type: "system", message: "Python environment ready.", timestamp: new Date() });
      return pyodideInstance;
    } catch (err) {
      pyodidePromise = null; // Reset so we can try again
      throw err;
    }
  })();

  return pyodidePromise;
}

export type LogType = "info" | "warn" | "error" | "system";

export interface ExecutionLog {
  type: LogType;
  message: string;
  timestamp: Date;
  isSimulation?: boolean;
}

/**
 * Executes JavaScript/TypeScript/React code.
 */
export async function executeJS(
  code: string,
  onLog: (log: ExecutionLog) => void
): Promise<void> {
  const babel = await getBabel(onLog);
  if (!babel) {
    onLog({ type: "error", message: "Babel failed to load environment", timestamp: new Date() });
    return;
  }

  try {
    // Transpile TS/JSX to JS
    const transformed = babel.transform(code, {
      presets: ["react", ["typescript", { isTSX: true, allExtensions: true }]],
    }).code;

    // Create a custom console proxy
    const createLog = (type: LogType, ...args: unknown[]) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(" ");
      onLog({ type, message, timestamp: new Date() });
    };

    // Execute in a controlled environment
    // Use an IIFE with window proxies removed or shadowed if possible
    const runner = new Function("console", "require", transformed);
    
    // Shadow the global console
    runner({
      log: (...args: unknown[]) => createLog("info", ...args),
      warn: (...args: unknown[]) => createLog("warn", ...args),
      error: (...args: unknown[]) => createLog("error", ...args),
      info: (...args: unknown[]) => createLog("info", ...args),
    }, () => { throw new Error("require() is not supported in the live console.") });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    onLog({ type: "error", message, timestamp: new Date() });
  }
}

/**
 * Executes Python code using Pyodide.
 */
export async function executePython(
  code: string,
  onLog: (log: ExecutionLog) => void
): Promise<void> {
  try {
    const pyodide = await getPyodide(onLog);
    
    if (!pyodide) {
      onLog({ type: "error", message: "Pyodide failed to load environment", timestamp: new Date() });
      return;
    }
    
    // Set up stdout/stderr redirection
    pyodide.setStdout({
      batched: (msg: string) => onLog({ type: "info", message: msg, timestamp: new Date() }),
    });
    pyodide.setStderr({
      batched: (msg: string) => onLog({ type: "error", message: msg, timestamp: new Date() }),
    });

    await pyodide.runPythonAsync(code);
    onLog({ type: "system", message: "Python execution finished.", timestamp: new Date() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    onLog({ type: "error", message, timestamp: new Date() });
  }
}
