
markdown

# ✅ PulseKit — Build Phases

A comprehensive, phase-by-phase task list from project initialization to production launch.
Each phase has a clear goal, deliverables, and definition of done.

---

## Legend
- `[x]` — Done
- `[ ]` — Pending
- `[~]` — In progress
- `[!]` — Blocked / needs decision

---

## Phase 0 — Project Scaffold & Documentation
> **Goal:** A clean, well-documented skeleton that any developer can clone and understand immediately.

### Project Initialization
- [x] Initialize Next.js 15 with TypeScript, Tailwind CSS, ESLint, App Router
- [x] Configure `tsconfig.json` with strict mode and `@/*` path alias
- [x] Configure `postcss.config.mjs` and `tailwind.config.ts`
- [x] Define Tailwind design tokens — colors, fonts, animations, keyframes
- [x] Create `app/globals.css` — noise overlay, grid background, glow utilities, gradient text
- [x] Create `.env.example` with all required environment variables documented

### Documentation
- [x] Write `README.md` — overview, setup instructions, project structure, stack
- [x] Write `TODO.md` — this file
- [x] Write `ARCHITECTURE.md` — data flow, directory layout, AI integration, security
- [x] Write `DOCUMENTATION.md` — full technical reference for all modules, hooks, types, prompts

### App Shell
- [x] Create `app/layout.tsx` — root HTML shell, font imports, metadata
- [x] Create `app/page.tsx` — landing page with module cards
- [x] Create `components/shared/Navbar.tsx` — sticky nav with active module state
- [x] Scaffold module routes: `/devlens`, `/specforge`, `/chartgpt` with layout + page stubs

### Types & Config
- [x] Define all shared TypeScript interfaces in `types/index.ts`
- [x] Add `next-env.d.ts`
- [x] Create `eslint.config.mjs` with recommended Next.js rules

**✅ Phase 0 Done When:** Project runs locally (`npm run dev`), all pages render without errors, docs are complete.

---

## Phase 1 — Shared Infrastructure
> **Goal:** Build all reusable primitives — UI components, hooks, and library functions — that every module will depend on. Nothing module-specific yet.

### UI Primitives (`components/ui/`)
- [x] `Button.tsx` — variants: `primary`, `secondary`, `ghost`, `danger`; sizes: `sm`, `md`, `lg`; loading state
- [x] `Badge.tsx` — color variants: `accent`, `amber`, `violet`, `subtle`, `success`, `danger`
- [x] `Card.tsx` — accent border prop, hover glow, consistent padding
- [x] `Spinner.tsx` — sizes: `sm`, `md`, `lg`; color variants matching theme
- [x] `Textarea.tsx` — auto-resize, character count, error state, disabled state
- [x] `Input.tsx` — with icon slot, error state, disabled state
- [x] `Tooltip.tsx` — hover tooltip with arrow, keyboard accessible
- [x] `Dropdown.tsx` — select menu with search, keyboard nav
- [x] `Modal.tsx` — accessible dialog with backdrop, focus trap, Escape to close
- [x] `Tabs.tsx` — horizontal tabs with active indicator animation
- [x] `Skeleton.tsx` — animated loading placeholders for text, block, and card shapes
- [x] `EmptyState.tsx` — icon + heading + subtext + optional CTA slot
- [x] `ErrorState.tsx` — icon + message + retry button slot
- [x] `CopyButton.tsx` — copies text to clipboard, shows checkmark on success
- [x] `Toast.tsx` — success/error/info toasts, auto-dismiss, queue management

### Shared Components (`components/shared/`)
- [x] `Footer.tsx` — minimal footer with version, links, copyright
- [x] `PageHeader.tsx` — module icon + label + title + optional description slot
- [x] `HistorySidebar.tsx` — slide-in drawer, shared across all modules
- [x] `CommandPalette.tsx` — ⌘K modal with module navigation and action shortcuts
- [x] `ApiKeyBanner.tsx` — persistent warning banner for multi-provider AI keys

### Library (`lib/`)
- [x] `ai.ts` — Unified AI Service (Groq/Mistral/OpenRouter) with server-side proxying
- [x] `prompts.ts` — `devlensPrompt()`, `specforgePrompt()`, `chartgptPrompt()` — all system + user prompt templates
- [x] `csv-parser.ts` — PapaParse wrapper; `parseCSV()`, `parseJSON()`, `inferColumnTypes()`
- [x] `utils.ts` — `cn()`, `formatBytes()`, `truncate()`, `downloadFile()`, `copyToClipboard()`, `slugify()`, `generateId()`
- [x] `export.ts` — `exportMarkdown()`, `exportJSON()`, `exportPNG()` utilities

### Custom Hooks (`hooks/`)
- [x] `useAiStream.ts` — streams AI response token-by-token via SSE; exposes `{ output, isLoading, error, run, reset }`
- [x] `useAiJSON.ts` — one-shot AI call that returns parsed JSON; exposes `{ data, isLoading, error, run }`
- [x] `useHistory.ts` — DB-backed persistence (via /api/history); exposes `{ items, isLoading, save, remove, clear, find }`
- [x] `useFileUpload.ts` — file selection, type validation (CSV/JSON), auto-parse; exposes `{ file, parsedData, error, upload, reset }`
- [x] `useCopyToClipboard.ts` — wraps `navigator.clipboard`; exposes `{ copied, copy }`
- [x] `useLocalStorage.ts` — generic typed localStorage hook with SSR safety
- [x] `useDebounce.ts` — debounce a value with configurable delay
- [x] `useKeyboardShortcut.ts` — register global keyboard shortcuts with cleanup

**✅ Phase 1 Done When:** All primitives render in isolation, hooks work in a test component, `callClaude()` returns a real response from the API.

---

## Phase 2 — ChartGPT Module
> **Goal:** Upload a CSV → describe a chart in plain English → see an instant, beautiful visualization.
> *Build this first — it's the most visual, great for early momentum and demos.*

### Data Layer
- [x] Wire `useFileUpload` into ChartGPT page
- [x] CSV parsing with PapaParse — handle comma, semicolon, tab delimiters
- [x] JSON flat-array parsing
- [x] Column type inference (`number` | `string` | `date`)
- [x] Validate: max 10MB, max 50k rows, required headers present
- [x] Error handling: malformed file, unsupported format, empty file

### UI — Upload Step
- [x] `FileDropzone.tsx` — drag-and-drop zone + click-to-browse; accepts `.csv`, 'excel files' and `.json`
- [x] Upload progress indicator
- [x] File metadata display (name, size, row count, column count)
- [x] `DataPreview.tsx` — styled table of first 10 rows with column type badges
- [x] Column selector (optional override for AI suggestion)
- [x] Clear/reset button

### UI — Chart Step
- [x] `ChartPromptInput.tsx` — natural language input with placeholder examples
- [x] Prompt suggestion chips: "show as bar chart", "compare by category", "trend over time"
- [x] Generate button with loading state
- [x] `ChartRenderer.tsx` — Recharts wrapper mapping `ChartConfig` to components
- [x] Chart type badge (auto-detected, e.g. "Bar Chart")
- [x] Chart title display (AI-generated)
- [x] Chart description display (AI-generated)
- [x] Responsive sizing with `ResponsiveContainer`

### Supported Chart Types
- [x] **Bar Chart** — `BarChart` with `XAxis`, `YAxis`, `Tooltip`, `Legend`
- [x] **Line Chart** — `LineChart` with smooth curves, dot markers
- [x] **Area Chart** — `AreaChart` with gradient fill
- [x] **Pie Chart** — `PieChart` with `Cell` colors, `Label`
- [x] **Scatter Chart** — `ScatterChart` with axis labels
- [x] **Heatmap** — `Heatmap` with color scale (Graceful Fallback)
- [x] **Funnel Chart** — `FunnelChart` with `Funnel` and `LabelList`
- [x] **Radar Chart** — `RadarChart` with `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis`, `Radar`, `Legend`
- [x] **Treemap** — `Treemap` with `Treemap` and `LabelList`
- [x] **Radial Bar Chart** — `RadialBarChart` with `RadialBar` and `LabelList`
- [x] **Bubble Chart** — `BubbleChart` with `XAxis`, `YAxis`, `Tooltip`, `Legend`
- [x] **Composed Chart** — `ComposedChart` with `XAxis`, `YAxis`, `Tooltip`, `Legend`, `Area`, `Bar`, `Line`
- [x] **Sankey Diagram** — `SankeyChart` with `Sankey` and `LabelList`
- [x] **Gantt Chart** — `GanttChart` with `XAxis`, `YAxis`, `Tooltip`, `Legend`, `Bar` (Graceful Fallback)
- [x] **Violin Plot** — `ViolinPlot` with `XAxis`, `YAxis`, `Tooltip`, `Legend` (Graceful Fallback)
- [x] **Box Plot** — `BoxPlot` with `XAxis`, `YAxis`, `Tooltip`, `Legend` (Graceful Fallback)
- [x] **Chord Diagram** — `ChordDiagram` with `Chord` and `LabelList` (Graceful Fallback)
- [x] **Word Cloud** — `WordCloud` with `WordCloud` and `LabelList` (Graceful Fallback)

### AI Integration
- [x] Wire `useClaudeJSON` hook into chart generation
- [x] `chartgptPrompt()` — system prompt instructs Claude to return `ChartConfig` JSON only
- [x] Pass column names + sample rows + user description to Claude
- [x] Parse and validate returned `ChartConfig` before rendering
- [x] Fallback: if AI returns invalid config, show error + allow retry

### Export & History
- [x] Download chart as PNG via `html2canvas` or `recharts` SVG export
- [x] Copy chart config as JSON
- [x] Save chart + config to history via `useHistory`
- [x] Load previous chart from history sidebar

### Color Theming
- [x] Accent (cyan) palette for chart fills
- [x] Amber palette option
- [x] Violet palette option
- [x] Palette switcher UI

**✅ Phase 2 Done When:** Upload a CSV → type "show monthly sales as a bar chart" → chart renders correctly with title, axes, and correct data mapping.

---

## Phase 3 — DevLens Module
> **Goal:** Paste any code → get structured AI analysis with bugs, complexity, refactors, and explanation — streamed in real time.

### UI — Input
- [x] `CodeInput.tsx` — large textarea with monospace font, line numbers, tab-key support
- [x] Language auto-detect badge (shown as user types, updated on change)
- [x] `LanguageSelector.tsx` — dropdown: Auto, JavaScript, TypeScript, Python, Go, Rust, SQL, Bash, Java, C++, Other
- [x] Character/line count display
- [x] Clear code button
- [x] Sample code button (loads an example snippet for demo)
- [x] Analyze button with loading state

### UI — Output
- [x] `AnalysisOutput.tsx` — renders structured AI result
- [x] **Summary section** — one-paragraph overview with language badge
- [x] **Bugs & Issues section** — list with severity badges (`low` / `medium` / `high`), line references
- [x] **Complexity section** — score gauge (1–10), rating badge, notes
- [x] **Refactor Suggestions section** — before/after code blocks side by side
- [x] **Security Flags section** — flagged issues with category tags (SQLi, XSS, etc.)
- [x] **Explanation section** — plain-English walkthrough, paragraph format
- [x] All sections collapsible with animated chevron
- [x] Streaming: sections appear progressively as Claude responds
- [x] `Skeleton.tsx` shown during stream start
- [x] Copy-to-clipboard on each code block
- [x] Copy full analysis as Markdown

### AI Integration
- [x] Wire `Any Ai we are using` into DevLens page
- [x] `devlensPrompt(code, language)` — system prompt defines exact Markdown section format
- [x] Stream tokens into output state; parse sections client-side as stream completes
- [x] Handle: empty input, input too long (>50k chars), API error, timeout

### Language Support Matrix
- [x] JavaScript / TypeScript — JSX aware
- [x] Python — indentation, type hints, common patterns
- [x] Go — idiomatic checks
- [x] Rust — ownership hints
- [x] SQL — injection risks, N+1 patterns
- [x] Bash — quoting issues, safety flags
- [x] Auto-detect — default fallback

### Export & History
- [x] Export analysis as `.md` file download
- [x] Save to history with code snippet preview (first 3 lines)
- [x] Load from history sidebar

**✅ Phase 3 Done When:** Paste a buggy Python function → analysis streams in → bugs listed with severity → refactor suggestion shown with before/after → export as Markdown works.

---

## Phase 4 — SpecForge Module
> **Goal:** Describe a feature in plain text → get a full, export-ready PRD with user stories, acceptance criteria, schema, and API routes.

### UI — Input
- [x] `FeatureInput.tsx` — large textarea with word count, placeholder with example prompts
- [x] Audience selector: `Technical Engineer` | `Product Manager` | `Executive / Stakeholder`
- [x] Scope selector: `Small feature` | `Medium feature` | `Large epic`
- [x] Optional context fields (collapsible): tech stack, existing system description, constraints
- [x] Generate button with loading state
- [x] Example prompt chips: "User auth with OAuth", "CSV export feature", "Real-time notifications"

### UI — Output
- [x] `PRDOutput.tsx` — full markdown-rendered PRD
- [x] Section navigation sidebar (sticky, links to each PRD section)
- [x] Raw Markdown / Preview toggle
- [x] `react-markdown` with `rehype-sanitize` and custom component renderers
- [x] Custom styles for PRD headings, tables, code blocks, blockquotes

### PRD Sections (AI-generated)
- [x] **Overview** — feature summary paragraph
- [x] **Problem Statement** — what problem this solves and for whom
- [x] **Goals & Non-Goals** — explicit in/out of scope
- [x] **User Stories** — formatted "As a [role], I want [x], so that [y]"
- [x] **Acceptance Criteria** — testable, specific, one per story
- [x] **Edge Cases & Error States** — what could go wrong
- [x] **Data Schema** — models, fields, types, constraints in table format
- [x] **API Endpoints** — method, path, description, request/response shape
- [x] **Open Questions** — unresolved decisions flagged for the team
- [x] **Dependencies** — systems or teams this feature depends on

### AI Integration
- [x] Wire `Any Ai we are using` into SpecForge page
- [x] `specforgePrompt(description, audience, scope, context)` — system prompt enforces PRD structure
- [x] Stream Markdown tokens directly into preview pane
- [x] Handle: empty input, ambiguous description (ask for clarification), API error

### Export & History
- [x] Copy full PRD to clipboard as Markdown
- [x] Download as `.md` file
- [x] Download as `.txt` file (plain text, no markdown)
- [x] Save to history with feature title as preview label
- [x] Load from history sidebar
- [x] Regenerate — re-run same input with new output

**✅ Phase 4 Done When:** Type "Build a CSV export feature for a SaaS dashboard" → full PRD streams in with all sections → export as `.md` downloads correctly.

---

## Phase 5 — History Vault
> **Goal:** Every result from every module is saved, searchable, and retrievable — persisted in LocalStorage.

### Data Model
- [x] `HistoryItem<T>` interface: `id`, `module`, `createdAt`, `title`, `input`, `result`
- [x] Auto-generate UUID for each item
- [x] Auto-generate `title` from first line of input (truncated to 60 chars)
- [x] Store items in `history_items` table with `userId` foreign key


### `HistorySidebar.tsx`
- [x] Slide-in drawer from right, triggered by history button in Sidebar
- [x] Tabbed by module: All | DevLens | SpecForge | ChartGPT
- [x] Each item shows: module badge, title, relative timestamp ("2h ago")
- [x] Click item → load result into the relevant module
- [x] Hover item → show delete (×) button
- [x] Empty state illustration when no history
- [x] Search/filter bar — searches titles and input text
- [x] "Clear all" button with confirmation modal
- [x] Export all history as `.json` file

### Per-Module Integration
- [x] DevLens: save on successful analysis completion
- [x] SpecForge: save on successful PRD generation completion
- [x] ChartGPT: save on successful chart render
- [x] Each module shows "Saved ✓" toast on save
- [x] Each module has "Load from history" shortcut button

**✅ Phase 5 Done When:** Complete a DevLens analysis → close browser → reopen → result appears in history sidebar → clicking it reloads the analysis.

---

## Phase 6 — Unified AI Chat Sidebar
> **Goal:** A persistent, context-aware AI assistant that knows what you're working on in each module.

### UI
- [x] Floating chat button (bottom-right corner, accent color)
- [x] Slide-in chat panel (420px wide, full height)
- [x] Message list with user / assistant bubbles
- [x] Streaming response display
- [x] Input textarea with Send button and Enter shortcut
- [x] Clear conversation button
- [x] Close panel button

### Context Awareness
- [x] Detect active module (DevLens / SpecForge / ChartGPT / Home)
- [x] Inject last module result into system prompt as context
- [x] Show context pill: "Connected: [Module]"
- [x] "Include current result" toggle button
- [x] System prompt changes per module: DevLens, SpecForge, ChartGPT specialized personas

### AI Integration
- [x] Multi-turn conversation — pass full messages[] history
- [x] Unified streaming via custom useChat hook
- [x] Conversation scoped to session
- [x] Error handling with inline fallback and retry guidance

### Suggested Prompts
- [x] Per-module starter suggestions shown in empty state
- [x] DevLens: "Critical bug?", "Simple explanation"
- [x] SpecForge: "Edge cases?", "Technical challenges"
- [x] ChartGPT: "Trends/Anomalies?", "Better chart type?"

**✅ Phase 6 Done When:** Analyze code in DevLens → open chat → ask "what's the most critical bug?" → AI responds with context from the analysis.

---

## Phase 7 — Command Palette & Keyboard Shortcuts
> **Goal:** Power-user experience with keyboard-first navigation.

### `CommandPalette.tsx`
- [x] `CommandPalette.tsx`
- [x] Trigger: `⌘K` (Mac) / `Ctrl+K` (Windows/Linux)
- [x] Fuzzy search across: module navigation, recent history items, actions
- [x] Navigation commands: "Go to DevLens", "Go to SpecForge", "Go to ChartGPT"
- [x] Action commands: "Clear DevLens input", "Export last result", "Open history", "Open chat"
- [x] Recent history items listed as commands
- [x] Keyboard navigation: `↑` `↓` to move, `↵` to select, `Esc` to close
- [x] Command groups with visual separators and group labels
- [x] Empty state: "No results for '...'"

### Global Shortcuts
- [x] `⌘K` — Open command palette
- [x] `⌘/` — Open AI chat sidebar
- [x] `⌘H` — Open history sidebar
- [x] `⌘↵` — Submit/analyze in active module
- [x] `Esc` — Close any open panel/modal
- [x] `⌘E` — Export current result
- [x] `⌘C` (when result focused) — Copy result as Markdown

### Phase 8 — Polish & UX Refinement [COMPLETED]
> **Goal:** The app feels finished, fast, and delightful. Every edge case is handled. Every state is beautiful.

- [x] Build multi-step Onboarding walkthrough (`WelcomeModal.tsx`)
- [x] Implement global Connectivity Status banner
- [x] Generate premium abstract logo for branding
- [x] Add fluid page transitions with `framer-motion` in Platform Layout
- [x] Refine `ApiKeyBanner` with detailed provider instructions
- [x] Add "Try Example" quick-start stubs to all modules
- [x] Implement robust PWA support (`manifest.json` + `icons`)
- [x] Mobile layout stack & tablet responsiveness
- [x] Accessibility audit (ARIA labels, focus management)

### Phase 8.5 — Robust Analytics Dashboard [COMPLETED]
> **Goal:** Transform local workspace history into actionable engineering insights.

- [x] Update Sidebar with Analytics link & `⌘A` shortcut
- [x] Implement data aggregation logic for all history modules
- [x] Build `AnalyticsCharts.tsx` using Recharts (Area & Pie)
- [x] Design and implement `/analytics` main dashboard with collapsible Audit Trail
- [x] Add "Est. Time Saved" and "Token Velocity" metrics

### Phase 9 — Code Quality & Testing [IN PROGRESS]
> **Goal:** Codebase is clean, strictly typed, and passes all quality gates before production.

- [/] Final end-to-end platform audit (Consistency & Flow)
- [ ] Verify PWA installation and offline capabilities
- [ ] Performance and Accessibility (A11y) review
- [ ] Final project summary and delivery
- [x] Zero `any` in core modules (Refined in Analytics/ChartGPT)
- [x] ESLint & Prettier alignment
- [ ] Lighthouse score ≥ 90 on all pages
