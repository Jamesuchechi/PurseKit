# 📖 PulseKit — Documentation

Complete technical reference for developers building on or contributing to PulseKit.

---

## Table of Contents

1. [Environment Variables](#environment-variables)
2. [Module: DevLens](#module-devlens)
3. [Module: SpecForge](#module-specforge)
4. [Module: ChartGPT](#module-chartgpt)
5. [Shared Library](#shared-library)
6. [Custom Hooks](#custom-hooks)
7. [TypeScript Types](#typescript-types)
8. [UI Component Reference](#ui-component-reference)
9. [Prompt Engineering Guide](#prompt-engineering-guide)
10. [Contributing Guide](#contributing-guide)

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ Yes | Neon PostgreSQL connection string |
| `JWT_SECRET` | ✅ Yes | Secret for signing session cookies |
| `ANTHROPIC_API_KEY` | ✅ Yes | Your Anthropic API key |

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

> ⚠️ Never commit `.env.local` to version control.

---

## Module: DevLens

### Purpose
Analyze code pasted by the user. Returns a structured breakdown including bugs, complexity, refactor suggestions, and a plain-English explanation.

### Route
`/devlens` → `app/devlens/page.tsx`

### Input
- Code string (any language)
- Optional: language hint (auto-detected if omitted)

### Output Sections
| Section | Description |
|---|---|
| Summary | One-paragraph overview of what the code does |
| Bugs & Issues | Numbered list of detected problems with line references |
| Complexity | Estimated cyclomatic complexity + nesting depth |
| Refactor Suggestions | Before/after code rewrites |
| Security Flags | Any obvious vulnerabilities |
| Explanation | Plain-English walkthrough for non-experts |

### Prompt Template
See `lib/prompts.ts → devlensPrompt(code, language)`

### Key Components
- `components/devlens/CodeInput.tsx` — textarea with line numbers + language badge
- `components/devlens/AnalysisOutput.tsx` — renders structured AI response
- `components/devlens/LanguageSelector.tsx` — dropdown: JS, TS, Python, Go, Rust, SQL, Bash, Auto

---

## Module: SpecForge

### Purpose
Turn a rough feature description into a comprehensive Product Requirements Document (PRD).

### Route
`/specforge` → `app/specforge/page.tsx`

### Input
- Feature description (free text, 1 sentence to several paragraphs)
- Audience: `technical` | `product` | `executive`

### Output Sections
| Section | Description |
|---|---|
| Overview | TL;DR of the feature |
| User Stories | "As a [role], I want [x], so that [y]" |
| Acceptance Criteria | Testable, specific conditions per story |
| Edge Cases | What could go wrong or needs special handling |
| Out of Scope | Explicit exclusions |
| Data Schema | Suggested database models and fields |
| API Endpoints | Suggested REST routes with methods and payloads |

### Export
- Copy as Markdown (clipboard)
- Download as `.md` file

### Prompt Template
See `lib/prompts.ts → specforgePrompt(description, audience)`

### Key Components
- `components/specforge/FeatureInput.tsx` — rich textarea with character count
- `components/specforge/PRDOutput.tsx` — `react-markdown` renderer with custom styles
- `components/specforge/ExportButton.tsx` — copy + download controls

---

## Module: ChartGPT

### Purpose
Upload a CSV or JSON array → describe a chart in plain English → get an instant Recharts visualization.

### Route
`/chartgpt` → `app/chartgpt/page.tsx`

### Input
- File: `.csv` or `.json` (flat array of objects)
- Chart description: natural language (e.g. "show monthly revenue as a bar chart")

### Supported Chart Types
| Type | Recharts Component |
|---|---|
| Bar | `BarChart` |
| Line | `LineChart` |
| Area | `AreaChart` |
| Pie | `PieChart` |
| Scatter | `ScatterChart` |

### AI Response Schema (JSON mode)
```json
{
  "chartType": "bar",
  "xKey": "month",
  "yKey": "revenue",
  "title": "Monthly Revenue",
  "color": "accent",
  "description": "A bar chart showing monthly revenue from January to December."
}
```

### Key Components
- `components/chartgpt/FileDropzone.tsx` — drag-and-drop upload zone
- `components/chartgpt/DataPreview.tsx` — table of first 10 rows
- `components/chartgpt/ChartPromptInput.tsx` — natural language input
- `components/chartgpt/ChartRenderer.tsx` — maps AI config to Recharts component

---

## Shared Library

### `lib/anthropic.ts`

```ts
callClaude(
  messages: { role: 'user' | 'assistant', content: string }[],
  system?: string,
  stream?: boolean
): Promise<Response>
```

Wraps the Anthropic `/v1/messages` endpoint. Returns the raw `Response` for streaming or `await res.json()` for one-shot calls.

---

### `lib/prompts.ts`

| Export | Purpose |
|---|---|
| `devlensPrompt(code, lang)` | Returns `{ system, userMessage }` for DevLens |
| `specforgePrompt(desc, audience)` | Returns `{ system, userMessage }` for SpecForge |
| `chartgptPrompt(columns, description)` | Returns `{ system, userMessage }` for ChartGPT (JSON mode) |

---

### `lib/csv-parser.ts`

```ts
parseCSV(file: File): Promise<{ headers: string[], rows: Record<string, string>[] }>
parseJSON(file: File): Promise<{ headers: string[], rows: Record<string, unknown>[] }>
inferColumnTypes(rows): Record<string, 'number' | 'string' | 'date'>
```

---

### `lib/utils.ts`

```ts
cn(...classes: string[]): string           // clsx wrapper for conditional classnames
formatBytes(bytes: number): string         // "1.2 MB"
truncate(str: string, n: number): string   // "hello wor..."
downloadFile(content: string, filename: string, type?: string): void
copyToClipboard(text: string): Promise<void>
```

---

## Custom Hooks

### `useClaudeStream`

```ts
const { output, isLoading, error, run, reset } = useClaudeStream()
await run({ system, userMessage })
```

Streams Claude's response token-by-token into `output` (string). Handles SSE parsing internally.

---

### `useHistory`

```ts
const { items, isLoading, save, remove, clear } = useHistory<T>(module: Module)
```

Persists results to the **PostgreSQL database** via API routes (`/api/history`). Each item has an auto-generated UUID and is isolated by the authenticated user's ID.

---

### `useFileUpload`

```ts
const { file, data, headers, rows, error, upload, reset } = useFileUpload()
```

Handles file selection, type validation (CSV/JSON only), and automatic parsing via `lib/csv-parser.ts`.

---

## TypeScript Types

```ts
// types/index.ts

export type Module = 'devlens' | 'specforge' | 'chartgpt'

export interface HistoryItem<T = unknown> {
  id: string
  module: Module
  createdAt: string
  input: string
  result: T
}

export interface DevLensResult {
  summary: string
  bugs: Bug[]
  complexity: ComplexityReport
  refactors: Refactor[]
  securityFlags: string[]
  explanation: string
}

export interface Bug {
  line?: number
  description: string
  severity: 'low' | 'medium' | 'high'
}

export interface Refactor {
  before: string
  after: string
  reason: string
}

export interface ComplexityReport {
  score: number
  rating: 'low' | 'medium' | 'high'
  notes: string
}

export interface SpecForgeResult {
  overview: string
  userStories: UserStory[]
  acceptanceCriteria: Record<string, string[]>
  edgeCases: string[]
  outOfScope: string[]
  dataSchema: SchemaField[]
  apiEndpoints: APIEndpoint[]
}

export interface UserStory {
  role: string
  action: string
  benefit: string
}

export interface SchemaField {
  model: string
  fields: { name: string; type: string; required: boolean }[]
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  description: string
}

export interface ChartConfig {
  chartType: 'bar' | 'line' | 'area' | 'pie' | 'scatter'
  xKey: string
  yKey: string
  title: string
  color: 'accent' | 'amber' | 'violet'
  description: string
}
```

---

## UI Component Reference

### `<Button>`
```tsx
<Button variant="primary" | "secondary" | "ghost" size="sm" | "md" | "lg" onClick={...}>
  Label
</Button>
```

### `<Badge>`
```tsx
<Badge color="accent" | "amber" | "violet" | "subtle">label</Badge>
```

### `<Spinner>`
```tsx
<Spinner size="sm" | "md" color="accent" | "amber" | "violet" />
```

### `<Card>`
```tsx
<Card accent="accent" | "amber" | "violet" className="...">
  {children}
</Card>
```

---

## Prompt Engineering Guide

### Principles
1. **Always include a system prompt** that defines the AI's role, output format, and constraints
2. **Request JSON output** when you need structured data (ChartGPT)
3. **Request Markdown output** when you need rich formatted text (DevLens, SpecForge)
4. **Be explicit about format** — specify headers, bullet styles, max lengths
5. **Include the input inline** — don't reference "the code above"; paste it in

### Example: DevLens System Prompt
```
You are DevLens, a principal-level AI security researcher and code architect.
Your task is to analyze the provided code snippet and return a structured analysis in Markdown.

STRICT CONSTRAINTS:
- You MUST only analyze the code within the context and rules of its specific language and ecosystem.
- DO NOT compare the code to JavaScript, TypeScript, or any other ecosystem unless the user explicitly asks for a comparison in their input.
- Strictly adhere to the idioms, syntax, and architectural best practices of the detected/specified language.
- Ensure your security analysis and refactor suggestions are relevant to this specific language's runtime and standard library.

Structure your response exactly with these sections (using ### headings):
### Summary
### Bugs & Issues
### Complexity Analysis
### Refactor Suggestions
### Security Flags
### Explanation
```

---

## Contributing Guide

### Commit Convention
```
feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    Formatting (no logic change)
refactor: Code refactor (no feature change)
chore:    Tooling, deps, config
```

### Branch Naming
```
feat/devlens-bug-detection
fix/chartgpt-csv-parsing
docs/update-architecture
```

### Code Standards
- TypeScript strict mode — no `any`
- All components must have explicit prop types
- Prompts live in `lib/prompts.ts` — never inline
- No hardcoded colors — use Tailwind tokens only

---

_Last updated: Sprint 0_