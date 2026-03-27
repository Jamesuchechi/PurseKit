// ============================================================
// PulseKit — Shared TypeScript Types
// ============================================================

export type Module = "devlens" | "specforge" | "chartgpt";

// ─── History ────────────────────────────────────────────────

export interface HistoryItem<T = unknown> {
  id: string;
  module: Module;
  createdAt: string;
  input: string;
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

export type ChartType = "bar" | "line" | "area" | "pie" | "scatter";
export type ChartColor = "accent" | "amber" | "violet";

export interface ChartConfig {
  chartType: ChartType;
  xKey: string;
  yKey: string;
  title: string;
  color: ChartColor;
  description: string;
  aggregation?: "sum" | "avg" | "count" | "none";
}

export interface ParsedData {
  headers: string[];
  rows: Record<string, string | number>[];
  rowCount: number;
  inferredTypes: Record<string, "number" | "string" | "date">;
}

// ─── AI ─────────────────────────────────────────────────────

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClaudeRequest {
  system?: string;
  userMessage: string;
  stream?: boolean;
  maxTokens?: number;
}
