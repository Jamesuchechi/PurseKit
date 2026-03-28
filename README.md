# ⚡ PulseKit

> The AI workspace built for engineers and data scientists.

PulseKit is an AI-native workspace that combines three powerful tools into one cohesive interface — code intelligence, spec generation, and data visualization. Powered by Next.js 15, Drizzle ORM, and Neon PostgreSQL.

---

## 🧩 Modules

| Module | Description |
|---|---|
| 🧠 **DevLens** | Paste code → AI-powered bug detection, complexity analysis, and refactor suggestions |
| 📋 **SpecForge** | Describe a feature → full PRD with user stories, acceptance criteria, edge cases, and data schema |
| 📊 **ChartGPT** | Upload a CSV → describe your chart in natural language → instant visualization |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
git clone https://github.com/your-username/pulsekit.git
cd pulsekit
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Add your API key to `.env.local`:

```env
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_api_key_here
```

> ⚠️ **Note:** In production, never expose API keys in the browser. Use a server-side proxy route. For local development, `NEXT_PUBLIC_` is fine.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure

```
pulsekit/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── devlens/                # DevLens module
│   ├── specforge/              # SpecForge module
│   └── chartgpt/               # ChartGPT module
├── components/
│   ├── shared/                 # Navbar, Footer, layout primitives
│   ├── ui/                     # Reusable UI components (Button, Badge, etc.)
│   ├── devlens/                # DevLens-specific components
│   ├── specforge/              # SpecForge-specific components
│   └── chartgpt/               # ChartGPT-specific components
├── hooks/
│   ├── useAiStream.ts          # Streaming AI responses
│   ├── useHistory.ts           # Per-user history (PostgreSQL API)
│   └── useFileUpload.ts        # File upload + parsing
├── lib/
│   ├── db.ts                   # Drizzle client (Neon)
│   ├── schema.ts               # Database schema
│   ├── users.ts                # User management
│   ├── auth.ts                 # JWT Auth setup
│   ├── prompts.ts              # All AI prompts
│   ├── csv-parser.ts           # CSV/JSON parsing utilities
│   └── utils.ts                # General helpers
├── types/
│   └── index.ts                # Shared TypeScript types
└── public/                     # Static assets
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| AI | Anthropic Claude API |
| Charts | Recharts |
| CSV Parsing | PapaParse |
| Code Highlighting | react-syntax-highlighter |
| Markdown | react-markdown |
| Icons | lucide-react |

---

## 📋 Roadmap

See [`TODO.md`](./TODO.md) for the full task list.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT © PulseKit Contributors