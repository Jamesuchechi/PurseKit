// ============================================================
// PulseKit — Shared TypeScript Types
// ============================================================

export type Module = "devlens" | "specforge" | "chartgpt";

// ─── History ────────────────────────────────────────────────

export interface HistoryItem<T = unknown> {
  id: string;
  module: Module;
  title: string;
  input: string;
  createdAt: string; // ISO string
  timestamp: string; // Human-readable fallback
  result: T;
}

// ─── DevLens ────────────────────────────────────────────────

export interface Bug {
  line?: number;
  description: string;
  severity: "low" | "medium" | "high";
}

export interface Refactor {
  before: string;
  after: string;
  reason: string;
}

export interface ComplexityReport {
  score: number;
  rating: "low" | "medium" | "high";
  notes: string;
}

export interface DevLensResult {
  summary: string;
  bugs: Bug[];
  complexity: ComplexityReport;
  refactors: Refactor[];
  securityFlags: string[];
  explanation: string;
  language: string;
}

// ─── SpecForge ──────────────────────────────────────────────

export interface UserStory {
  role: string;
  action: string;
  benefit: string;
}

export interface SchemaField {
  model: string;
  fields: { name: string; type: string; required: boolean }[];
}

export interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  requestBody?: string;
  responseExample?: string;
}

export interface SpecForgeResult {
  overview: string;
  userStories: UserStory[];
  acceptanceCriteria: Record<string, string[]>;
  edgeCases: string[];
  outOfScope: string[];
  dataSchema: SchemaField[];
  apiEndpoints: APIEndpoint[];
  rawMarkdown: string;
}

export type SpecForgeAudience = "technical" | "product" | "executive";

// ─── ChartGPT ───────────────────────────────────────────────

export interface ChartConfig {
  type: 
    | "bar" | "line" | "area" | "pie" | "scatter" 
    | "radar" | "composed" | "treemap" | "radialBar" 
    | "funnel" | "bubble" | "heatmap" | "sankey" 
    | "gantt" | "violin" | "box" | "chord" | "wordCloud";
  title: string;
  description: string;
  xAxis: string;
  yAxis?: string;
  dataKeys: {
    key: string;
    label: string;
    color?: string;
    type?: "bar" | "line" | "area";
  }[];
  options?: {
    stacked?: boolean;
    horizontal?: boolean;
    showLegend?: boolean;
    showGrid?: boolean;
    step?: boolean;
    smooth?: boolean;
  };
}

// ─── AI ─────────────────────────────────────────────────────

export interface AiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AiRequestOptions {
  provider?: "groq" | "mistral" | "openrouter";
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}
