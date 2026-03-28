# 🏛️ PulseKit — Architecture

This document describes the technical architecture, data flow, and key design decisions behind PulseKit.

---

## Overview

PulseKit is a **Next.js 15** application using a hybrid architecture: AI logic is handled via Anthropic's Claude API, while user data and history are persisted in a **PostgreSQL** database (via Neon) using **Drizzle ORM**.

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│   ┌──────────┐  ┌──────────────┐  ┌─────────────────┐  │
│   │ DevLens  │  │  SpecForge   │  │    ChartGPT     │  │
│   └────┬─────┘  └──────┬───────┘  └────────┬────────┘  │
│        │               │                   │            │
│        └───────────────┼───────────────────┘            │
│                        │                                │
│              ┌─────────▼──────────┐                     │
│              │   Next.js API      │                     │
│              │   (Route Handlers) │                     │
│              └─────────┬──────────┘                     │
│                        │                                │
└────────────────────────┼────────────────────────────────┘
                         │
        ┌────────────────┴──────────────────┐
        ▼                                   ▼
┌────────────────────────┐      ┌────────────────────────┐
│  Anthropic Claude API  │      │   PostgreSQL (Neon)    │
│  (AI Intelligence)     │      │   (Data Persistence)   │
└────────────────────────┘      └────────────────────────┘
```

---

## Tech Stack Rationale

### Next.js 15 (App Router)
- File-based routing cleanly maps to our three modules
- React Server Components for static parts (nav, layouts)
- Client Components (`"use client"`) for interactive AI-driven modules
- Easy Vercel deployment

### Tailwind CSS
- Design tokens defined in `tailwind.config.ts` keep the dark theme consistent
- Utility-first approach speeds up module UI development
- Custom `keyframes` for animations without a motion library dependency

### Anthropic Claude API (direct browser call)
- No Express/Node proxy needed for local dev
- For production: wrap in a Next.js Route Handler (`app/api/ai/route.ts`) to hide the key
- Streaming via `stream: true` + `ReadableStream` for real-time output

---

## Directory Architecture

```
pulsekit/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root HTML shell, global font imports
│   ├── page.tsx                  # Landing / module picker
│   ├── globals.css               # CSS variables, Tailwind directives, utilities
│   │
│   ├── devlens/
│   │   ├── layout.tsx            # DevLens chrome (header, module label)
│   │   └── page.tsx              # DevLens interactive UI
│   │
│   ├── specforge/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   └── chartgpt/
│       ├── layout.tsx
│       └── page.tsx
│
├── components/
│   ├── shared/
│   │   ├── Navbar.tsx            # Global top nav with module links
│   │   └── Footer.tsx
│   │
│   ├── ui/                       # Headless-style primitives
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Spinner.tsx
│   │   └── Textarea.tsx
│   │
│   ├── devlens/
│   │   ├── CodeInput.tsx         # Monaco-lite or textarea with highlighting
│   │   ├── AnalysisOutput.tsx    # Rendered AI result with sections
│   │   └── LanguageSelector.tsx
│   │
│   ├── specforge/
│   │   ├── FeatureInput.tsx
│   │   ├── PRDOutput.tsx         # Markdown-rendered PRD
│   │   └── ExportButton.tsx
│   │
│   └── chartgpt/
│       ├── FileDropzone.tsx      # CSV/JSON upload
│       ├── DataPreview.tsx       # First-10-rows table
│       ├── ChartRenderer.tsx     # Recharts wrapper
│       └── ChartPromptInput.tsx  # Natural language input
│
├── lib/
│   ├── db.ts                     # Drizzle client (Neon)
│   ├── schema.ts                 # Database schema definitions
│   ├── users.ts                  # User creation and lookup (bcrypt)
│   ├── auth.ts                   # JWT session management
│   ├── prompts.ts                # All system + user prompt templates
│   ├── csv-parser.ts             # PapaParse wrapper + column inference
│   └── utils.ts                  # cn(), formatBytes(), truncate(), etc.
│
├── hooks/
│   ├── useAiStream.ts            # Streams AI response token-by-token
│   ├── useHistory.ts             # API-backed persistence for results
│   └── useFileUpload.ts          # File selection, parsing, validation
│
└── types/
    └── index.ts                  # Shared TS interfaces
```

---

## Data Flow

### DevLens
```
User pastes code
    → CodeInput component captures value
    → useClaudeStream(prompts.devlens(code, language))
    → Streams tokens into AnalysisOutput
    → User can save result via useHistory
```

### SpecForge
```
User types feature description
    → FeatureInput captures value
    → useClaudeStream(prompts.specforge(description, audience))
    → Streams PRD markdown into PRDOutput
    → User can export as .md file
```

### ChartGPT
```
User uploads CSV
    → FileDropzone → csv-parser.ts → raw data array
    → DataPreview renders first 10 rows
    → User types chart description
    → Claude API (non-streaming, JSON mode)
        → returns { chartType, xKey, yKey, title, color }
    → ChartRenderer maps config to Recharts component
```

---

## AI Integration Pattern

All AI calls go through `lib/anthropic.ts`:

```ts
// lib/anthropic.ts
export async function callClaude(messages, system?, stream = false) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system,
      messages,
      stream,
    }),
  });
  return res;
}
```

Prompts are centralized in `lib/prompts.ts` — never inline in components.

---

## State Management

No global state library (Redux, Zustand). State is local to each module:

- **Component state** (`useState`) for UI inputs and transient values
- **Custom hooks** encapsulate async logic and side effects
- **PostgreSQL** (via `useHistory` → API) for persisting saved results across sessions
- **JWT Cookies** for secure, server-side session management

---

## Security Considerations

| Concern | Approach |
|---|---|
| API key exposure | Use Next.js Route Handler in production |
| User data | Persisted in PostgreSQL; isolated by userId |
| Authentication | Bcrypt-hashed passwords + JWT session cookies |
| CSV injection | Parse-only — no eval, no formula execution |
| XSS in markdown | Use `react-markdown` with `rehype-sanitize` |

---

## Deployment

```
Vercel + Neon
├── Branch: main → Production
├── Branch: dev  → Preview
├── Env vars: ANTHROPIC_API_KEY (server-side)
└── Env vars: DATABASE_URL (staged/prod Neon connection)
```

For production, move the API call to `app/api/ai/route.ts` so the key is never exposed to the browser.

---

_Last updated: Sprint 0_