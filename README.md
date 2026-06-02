# AUROS — RWA Tokenization Platform

Luxury-minimal Next.js app: free asset score, 10-step wizard, AI dossier generation (Groq), PDF export.

## Stack

- Next.js App Router · TypeScript · Tailwind CSS v4
- Framer Motion · Groq (`llama3-8b-8192`) · `@react-pdf/renderer`

## Setup

```bash
npm install
cp .env.example .env.local
# Set GROQ_API_KEY in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**WSL :** si tu vois `Cannot find module '../lightningcss.linux-x64-gnu.node'`, réinstalle les deps **depuis WSL** (`rm -rf node_modules .next && npm install`). Voir [docs/DEV-WSL.md](docs/DEV-WSL.md).

## Flow

1. **/** — Describe asset → `/api/score` → score, yield, platform
2. **/wizard** — 10 steps, auto-save `localStorage` key `auros_wizard`
3. **Generate** — `/api/generate` streams 6 sections (SSE)
4. **PDF** — `/api/pdf` downloads dossier

## Routes

| Path | Description |
|------|-------------|
| `/` | Homepage + score widget |
| `/wizard` | Multi-step form + generation |
| `/dashboard` | Placeholder |

No authentication in this version.
