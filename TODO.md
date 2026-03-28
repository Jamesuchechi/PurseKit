
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
- [x] `useHistory.ts` — localStorage R/W per module namespace; exposes `{ items, save, remove, clear, find }`
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
- [ ] Wire `useFileUpload` into ChartGPT page
- [ ] CSV parsing with PapaParse — handle comma, semicolon, tab delimiters
- [ ] JSON flat-array parsing
- [ ] Column type inference (`number` | `string` | `date`)
- [ ] Validate: max 10MB, max 50k rows, required headers present
- [ ] Error handling: malformed file, unsupported format, empty file

### UI — Upload Step
- [ ] `FileDropzone.tsx` — drag-and-drop zone + click-to-browse; accepts `.csv`, 'excel files' and `.json`
- [ ] Upload progress indicator
- [ ] File metadata display (name, size, row count, column count)
- [ ] `DataPreview.tsx` — styled table of first 10 rows with column type badges
- [ ] Column selector (optional override for AI suggestion)
- [ ] Clear/reset button

### UI — Chart Step
- [ ] `ChartPromptInput.tsx` — natural language input with placeholder examples
- [ ] Prompt suggestion chips: "show as bar chart", "compare by category", "trend over time"
- [ ] Generate button with loading state
- [ ] `ChartRenderer.tsx` — Recharts wrapper mapping `ChartConfig` to components
- [ ] Chart type badge (auto-detected, e.g. "Bar Chart")
- [ ] Chart title display (AI-generated)
- [ ] Chart description display (AI-generated)
- [ ] Responsive sizing with `ResponsiveContainer`

### Supported Chart Types
- [ ] **Bar Chart** — `BarChart` with `XAxis`, `YAxis`, `Tooltip`, `Legend`
- [ ] **Line Chart** — `LineChart` with smooth curves, dot markers
- [ ] **Area Chart** — `AreaChart` with gradient fill
- [ ] **Pie Chart** — `PieChart` with `Cell` colors, `Label`
- [ ] **Scatter Chart** — `ScatterChart` with axis labels
- [ ] **Heatmap** — `Heatmap` with color scale
- [ ] **Funnel Chart** — `FunnelChart` with `Funnel` and `LabelList`
- [ ] **Radar Chart** — `RadarChart` with `PolarGrid`, `PolarAngleAxis`, `PolarRadiusAxis`, `Radar`, `Legend`
- [ ] **Treemap** — `Treemap` with `Treemap` and `LabelList`
- [ ] **Radial Bar Chart** — `RadialBarChart` with `RadialBar` and `LabelList`
- [ ] **Bubble Chart** — `BubbleChart` with `XAxis`, `YAxis`, `Tooltip`, `Legend`
- [ ] **Composed Chart** — `ComposedChart` with `XAxis`, `YAxis`, `Tooltip`, `Legend`, `Area`, `Bar`, `Line`
- [ ] **Sankey Diagram** — `SankeyChart` with `Sankey` and `LabelList`
- [ ] **Gantt Chart** — `GanttChart` with `XAxis`, `YAxis`, `Tooltip`, `Legend`, `Bar`
- [ ] **Violin Plot** — `ViolinPlot` with `XAxis`, `YAxis`, `Tooltip`, `Legend`
- [ ] **Box Plot** — `BoxPlot` with `XAxis`, `YAxis`, `Tooltip`, `Legend`
- [ ] **Chord Diagram** — `ChordDiagram` with `Chord` and `LabelList`
- [ ] **Word Cloud** — `WordCloud` with `WordCloud` and `LabelList`

### AI Integration
- [ ] Wire `useClaudeJSON` hook into chart generation
- [ ] `chartgptPrompt()` — system prompt instructs Claude to return `ChartConfig` JSON only
- [ ] Pass column names + sample rows + user description to Claude
- [ ] Parse and validate returned `ChartConfig` before rendering
- [ ] Fallback: if AI returns invalid config, show error + allow retry

### Export & History
- [ ] Download chart as PNG via `html2canvas` or `recharts` SVG export
- [ ] Copy chart config as JSON
- [ ] Save chart + config to history via `useHistory`
- [ ] Load previous chart from history sidebar

### Color Theming
- [ ] Accent (cyan) palette for chart fills
- [ ] Amber palette option
- [ ] Violet palette option
- [ ] Palette switcher UI

**✅ Phase 2 Done When:** Upload a CSV → type "show monthly sales as a bar chart" → chart renders correctly with title, axes, and correct data mapping.

---

## Phase 3 — DevLens Module
> **Goal:** Paste any code → get structured AI analysis with bugs, complexity, refactors, and explanation — streamed in real time.

### UI — Input
- [ ] `CodeInput.tsx` — large textarea with monospace font, line numbers, tab-key support
- [ ] Language auto-detect badge (shown as user types, updated on change)
- [ ] `LanguageSelector.tsx` — dropdown: Auto, JavaScript, TypeScript, Python, Go, Rust, SQL, Bash, Java, C++, Other
- [ ] Character/line count display
- [ ] Clear code button
- [ ] Sample code button (loads an example snippet for demo)
- [ ] Analyze button with loading state

### UI — Output
- [ ] `AnalysisOutput.tsx` — renders structured AI result
- [ ] **Summary section** — one-paragraph overview with language badge
- [ ] **Bugs & Issues section** — list with severity badges (`low` / `medium` / `high`), line references
- [ ] **Complexity section** — score gauge (1–10), rating badge, notes
- [ ] **Refactor Suggestions section** — before/after code blocks side by side
- [ ] **Security Flags section** — flagged issues with category tags (SQLi, XSS, etc.)
- [ ] **Explanation section** — plain-English walkthrough, paragraph format
- [ ] All sections collapsible with animated chevron
- [ ] Streaming: sections appear progressively as Claude responds
- [ ] `Skeleton.tsx` shown during stream start
- [ ] Copy-to-clipboard on each code block
- [ ] Copy full analysis as Markdown

### AI Integration
- [ ] Wire `useClaudeStream` into DevLens page
- [ ] `devlensPrompt(code, language)` — system prompt defines exact Markdown section format
- [ ] Stream tokens into output state; parse sections client-side as stream completes
- [ ] Handle: empty input, input too long (>50k chars), API error, timeout

### Language Support Matrix
- [ ] JavaScript / TypeScript — JSX aware
- [ ] Python — indentation, type hints, common patterns
- [ ] Go — idiomatic checks
- [ ] Rust — ownership hints
- [ ] SQL — injection risks, N+1 patterns
- [ ] Bash — quoting issues, safety flags
- [ ] Auto-detect — default fallback

### Export & History
- [ ] Export analysis as `.md` file download
- [ ] Save to history with code snippet preview (first 3 lines)
- [ ] Load from history sidebar

**✅ Phase 3 Done When:** Paste a buggy Python function → analysis streams in → bugs listed with severity → refactor suggestion shown with before/after → export as Markdown works.

---

## Phase 4 — SpecForge Module
> **Goal:** Describe a feature in plain text → get a full, export-ready PRD with user stories, acceptance criteria, schema, and API routes.

### UI — Input
- [ ] `FeatureInput.tsx` — large textarea with word count, placeholder with example prompts
- [ ] Audience selector: `Technical Engineer` | `Product Manager` | `Executive / Stakeholder`
- [ ] Scope selector: `Small feature` | `Medium feature` | `Large epic`
- [ ] Optional context fields (collapsible): tech stack, existing system description, constraints
- [ ] Generate button with loading state
- [ ] Example prompt chips: "User auth with OAuth", "CSV export feature", "Real-time notifications"

### UI — Output
- [ ] `PRDOutput.tsx` — full markdown-rendered PRD
- [ ] Section navigation sidebar (sticky, links to each PRD section)
- [ ] Raw Markdown / Preview toggle
- [ ] `react-markdown` with `rehype-sanitize` and custom component renderers
- [ ] Custom styles for PRD headings, tables, code blocks, blockquotes

### PRD Sections (AI-generated)
- [ ] **Overview** — feature summary paragraph
- [ ] **Problem Statement** — what problem this solves and for whom
- [ ] **Goals & Non-Goals** — explicit in/out of scope
- [ ] **User Stories** — formatted "As a [role], I want [x], so that [y]"
- [ ] **Acceptance Criteria** — testable, specific, one per story
- [ ] **Edge Cases & Error States** — what could go wrong
- [ ] **Data Schema** — models, fields, types, constraints in table format
- [ ] **API Endpoints** — method, path, description, request/response shape
- [ ] **Open Questions** — unresolved decisions flagged for the team
- [ ] **Dependencies** — systems or teams this feature depends on

### AI Integration
- [ ] Wire `useClaudeStream` into SpecForge page
- [ ] `specforgePrompt(description, audience, scope, context)` — system prompt enforces PRD structure
- [ ] Stream Markdown tokens directly into preview pane
- [ ] Handle: empty input, ambiguous description (ask for clarification), API error

### Export & History
- [ ] Copy full PRD to clipboard as Markdown
- [ ] Download as `.md` file
- [ ] Download as `.txt` file (plain text, no markdown)
- [ ] Save to history with feature title as preview label
- [ ] Load from history sidebar
- [ ] Regenerate — re-run same input with new output

**✅ Phase 4 Done When:** Type "Build a CSV export feature for a SaaS dashboard" → full PRD streams in with all sections → export as `.md` downloads correctly.

---

## Phase 5 — History Vault
> **Goal:** Every result from every module is saved, searchable, and retrievable — persisted in localStorage.

### Data Model
- [ ] `HistoryItem<T>` interface: `id`, `module`, `createdAt`, `title`, `input`, `result`
- [ ] Auto-generate `id` (nanoid or crypto.randomUUID)
- [ ] Auto-generate `title` from first line of input (truncated to 60 chars)
- [ ] Store up to 100 items per module (FIFO eviction beyond limit)

### `HistorySidebar.tsx`
- [ ] Slide-in drawer from right, triggered by history button in Navbar
- [ ] Tabbed by module: All | DevLens | SpecForge | ChartGPT
- [ ] Each item shows: module badge, title, relative timestamp ("2h ago")
- [ ] Click item → load result into the relevant module
- [ ] Hover item → show delete (×) button
- [ ] Empty state illustration when no history
- [ ] Search/filter bar — searches titles and input text
- [ ] "Clear all" button with confirmation modal
- [ ] Export all history as `.json` file

### Per-Module Integration
- [ ] DevLens: save on successful analysis completion
- [ ] SpecForge: save on successful PRD generation completion
- [ ] ChartGPT: save on successful chart render
- [ ] Each module shows "Saved ✓" toast on save
- [ ] Each module has "Load from history" shortcut button

**✅ Phase 5 Done When:** Complete a DevLens analysis → close browser → reopen → result appears in history sidebar → clicking it reloads the analysis.

---

## Phase 6 — Unified AI Chat Sidebar
> **Goal:** A persistent, context-aware AI assistant that knows what you're working on in each module.

### UI
- [ ] Floating chat button (bottom-right corner, accent color)
- [ ] Slide-in chat panel (400px wide, full height)
- [ ] Message list with user / assistant bubbles
- [ ] Streaming response display
- [ ] Input textarea with Send button and ↵ shortcut
- [ ] Clear conversation button
- [ ] Close panel button

### Context Awareness
- [ ] Detect active module (DevLens / SpecForge / ChartGPT / Home)
- [ ] Inject last module result into system prompt as context
- [ ] Show context pill: "Talking about your last DevLens result"
- [ ] "Use current [code / spec / chart] as context" toggle button
- [ ] System prompt changes per module: DevLens → code review assistant, SpecForge → product thinking assistant, ChartGPT → data analysis assistant

### AI Integration
- [ ] Multi-turn conversation — pass full `messages[]` history to each API call
- [ ] `useClaudeStream` for token-by-token streaming
- [ ] Conversation scoped to session (not persisted in localStorage)
- [ ] Max 20 messages before auto-summarization + context reset
- [ ] Handle API errors gracefully with inline error message + retry

### Suggested Prompts
- [ ] Per-module starter suggestions shown in empty state
- [ ] DevLens: "What's the worst bug in my code?", "Explain this in simple terms"
- [ ] SpecForge: "Add an admin role to these user stories", "What am I missing?"
- [ ] ChartGPT: "What trends do you see in this data?", "Suggest a better chart type"

**✅ Phase 6 Done When:** Analyze code in DevLens → open chat → ask "what's the most critical bug?" → AI responds with context from the analysis.

---

## Phase 7 — Command Palette & Keyboard Shortcuts
> **Goal:** Power-user experience with keyboard-first navigation.

### `CommandPalette.tsx`
- [ ] Trigger: `⌘K` (Mac) / `Ctrl+K` (Windows/Linux)
- [ ] Fuzzy search across: module navigation, recent history items, actions
- [ ] Navigation commands: "Go to DevLens", "Go to SpecForge", "Go to ChartGPT"
- [ ] Action commands: "Clear DevLens input", "Export last result", "Open history", "Open chat"
- [ ] Recent history items listed as commands
- [ ] Keyboard navigation: `↑` `↓` to move, `↵` to select, `Esc` to close
- [ ] Command groups with visual separators and group labels
- [ ] Empty state: "No results for '...'"

### Global Shortcuts
- [ ] `⌘K` — Open command palette
- [ ] `⌘/` — Open AI chat sidebar
- [ ] `⌘H` — Open history sidebar
- [ ] `⌘↵` — Submit/analyze in active module
- [ ] `Esc` — Close any open panel/modal
- [ ] `⌘E` — Export current result
- [ ] `⌘C` (when result focused) — Copy result as Markdown

### Shortcut Cheatsheet
- [ ] `?` key → opens shortcuts reference modal
- [ ] List all shortcuts grouped by context

**✅ Phase 7 Done When:** Navigate the entire app, submit analyses, open sidebars, and export results without touching the mouse.

---

## Phase 8 — Polish & UX Refinement
> **Goal:** The app feels finished, fast, and delightful. Every edge case is handled. Every state is beautiful.

### Onboarding
- [ ] First-visit welcome modal — brief tour of the 3 modules
- [ ] Per-module empty state with illustration, description, and "Try an example" button
- [ ] API key setup guide — shown if key is missing, links to Anthropic console
- [ ] Dismiss and "Don't show again" option (localStorage flag)

### Micro-interactions & Animation
- [ ] Page transitions between modules (fade + slide)
- [ ] Module card hover animations on landing page
- [ ] Staggered section reveal in DevLens output
- [ ] Chart render animation (bars grow up, lines draw in)
- [ ] Streaming text cursor animation (blinking `|`)
- [ ] Toast slide-in/out animations
- [ ] Sidebar slide animations

### Error Handling (Exhaustive)
- [ ] API key missing → `ApiKeyBanner` + blocked UI with setup link
- [ ] API rate limit → toast with retry countdown
- [ ] API timeout → error state with retry button
- [ ] Network offline → persistent banner + disable submit buttons
- [ ] File too large → inline error on dropzone
- [ ] Invalid file format → inline error with accepted formats listed
- [ ] Empty input submit → field shake animation + inline message
- [ ] Result parse failure → fallback to raw text display

### Accessibility
- [ ] All interactive elements keyboard accessible
- [ ] Focus trap in modals and sidebars
- [ ] ARIA labels on icon-only buttons
- [ ] Screen reader announcements for async state changes
- [ ] Color contrast ≥ WCAG AA on all text
- [ ] Skip-to-content link

### Responsive Design
- [ ] Mobile layout (< 640px): stacked, touch-friendly, full-width panels
- [ ] Tablet layout (640–1024px): adjusted spacing, collapsible sidebar
- [ ] Desktop layout (> 1024px): full two-column layout where applicable
- [ ] Navbar collapses to icon-only on mobile
- [ ] History and chat sidebars become bottom sheets on mobile

### Assets
- [ ] Custom favicon (PulseKit lightning bolt)
- [ ] OG image for social sharing (1200×630)
- [ ] Apple touch icon
- [ ] Manifest for PWA basics

**✅ Phase 8 Done When:** A new user can complete a full workflow in each module without confusion. All error states render correctly. App is fully keyboard navigable.

---

## Phase 9 — Code Quality & Testing
> **Goal:** Codebase is clean, strictly typed, and passes all quality gates before production.

### TypeScript
- [ ] Zero `any` — strict mode with no suppressions
- [ ] All component props explicitly typed
- [ ] All hook return types explicitly typed
- [ ] All API response shapes validated at runtime (zod or manual guards)
- [ ] No unused imports or variables

### ESLint & Formatting
- [ ] ESLint: zero errors, zero warnings
- [ ] Prettier config — consistent formatting
- [ ] Pre-commit hook with `lint-staged` + `husky`
- [ ] Import order enforced (external → internal → relative)

### Performance
- [ ] Lighthouse score ≥ 90 on all pages (Performance, Accessibility, B
