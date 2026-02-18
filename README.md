# 🧠 AI/ML Knowledge Hub

Production-ready full-stack AI/ML knowledge platform — Next.js 15.3.6, React 19, TypeScript.

---

## 🚀 Quick Start (3 steps)

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local
# → open .env.local and add at least one API key (see below)

# 3. Run
npm run dev
# Open http://localhost:3000
```

---

## 🔑 Environment Variables Setup

### Step 1 — Create your local env file
```bash
cp .env.example .env.local
```

### Step 2 — Add API Keys (open `.env.local` in your editor)

---

### 🤖 ANTHROPIC_API_KEY — Claude AI (Primary AI engine)

**Powers:** AI Assistant chatbot · Prompt Playground · Document analysis

| | |
|---|---|
| **Get key** | https://console.anthropic.com |
| **Steps** | Sign in → API Keys (left sidebar) → **Create Key** → copy it |
| **Format** | `sk-ant-api03-XXXXXXXX...` (starts with `sk-ant-`) |
| **Free tier** | ❌ No. Requires $5 minimum credit purchase |
| **Cost** | ~$3 / 1M input tokens · ~$15 / 1M output tokens (Sonnet 3.5) |
| **Typical cost** | Normal chat usage: ~$0.01–0.05 per conversation |

```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

---

### 🌐 GOOGLE_GEMINI_API_KEY — Gemini (Free fallback)

**Powers:** Fallback if Claude errors · Alternative playground model

| | |
|---|---|
| **Get key** | https://aistudio.google.com |
| **Steps** | Sign in with Google → **Get API Key** → **Create API key** → copy it |
| **Format** | `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` (starts with `AIzaSy`) |
| **Free tier** | ✅ Yes — Gemini 2.0 Flash is free up to rate limits |
| **Cost** | Flash: $0.15 / 1M input · $0.60 / 1M output. Often free for light use. |

```env
GOOGLE_GEMINI_API_KEY=AIzaSy-your-key-here
```

---

### 🗄️ DATABASE_URL — PostgreSQL (Optional)

**Used for:** Persistent upload metadata. Without it, the app works fully but uploaded file records reset between Vercel deploys.

**Option A — Neon (Recommended, free):**
1. Go to https://neon.tech → Create account → **New Project**
2. Dashboard → **Connection Details** → copy the connection string
```env
DATABASE_URL=postgresql://USER:PASS@HOST/DB?sslmode=require
```

**Option B — Supabase (free):**
1. Go to https://supabase.com → New project
2. **Settings → Database → Connection string → URI**
```env
DATABASE_URL=postgresql://postgres:PASS@db.XXX.supabase.co:5432/postgres
```

---

### Complete `.env.local` example

```env
# Required for AI features (get at least one)
ANTHROPIC_API_KEY=sk-ant-api03-...
GOOGLE_GEMINI_API_KEY=AIzaSy...

# Optional
OPENAI_API_KEY=sk-proj-...
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📦 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel deploy

# Set env vars in Vercel dashboard:
# Project → Settings → Environment Variables → add each key
```

Or: Connect GitHub repo at vercel.com → it deploys automatically on every push.

**Important:** Add your env vars in the Vercel dashboard under **Project → Settings → Environment Variables** — `.env.local` is not deployed.

---

## 📁 Project Structure

```
ai-ml-hub/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── fundamentals/page.tsx    # ML algorithms & deep learning
│   ├── llms/page.tsx            # LLMs, prompt engineering, agents
│   ├── applied/page.tsx         # DoD / federal AI use cases
│   ├── toolkit/page.tsx         # API guides & code snippets
│   ├── evaluation/page.tsx      # Model eval, algorithm selector
│   ├── advanced/page.tsx        # RAG, fine-tuning, research
│   ├── resources/page.tsx       # Courses, books, community
│   ├── upload/page.tsx          # Document upload UI
│   └── api/
│       ├── chat/route.ts        # AI chat (Claude + Gemini fallback)
│       ├── upload/route.ts      # File upload + AI analysis
│       └── search/route.ts      # Content search
├── components/
│   ├── layout/                  # Header, Sidebar, RightPanel, PageLayout
│   ├── ui/                      # CodeBlock, AlgorithmCard, ComparisonTable, Callout
│   └── features/                # AIAssistant, DocumentUpload, PromptPlayground, SearchModal
├── public/
│   ├── favicon.svg              # Neural network icon
│   └── uploads/                 # Local file upload storage
├── .env.example                 # Template — copy to .env.local
└── vercel.json                  # Vercel deployment config
```

---

## ✨ Features

- **AI Assistant** — floating chatbot (Claude primary, Gemini fallback)
- **Document Upload** — drag-drop PDF/PY/MD/CSV with AI analysis
- **Prompt Playground** — live API testing with templates
- **LLM Comparison Table** — filterable side-by-side model comparison
- **Algorithm Selector** — interactive decision tree
- **Cost Calculator** — live token pricing across 5 LLMs
- **Global Search** — `⌘K` instant search
- **Syntax-highlighted Code** — copy button, line numbers

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| AI Assistant unresponsive | Check `.env.local` has a valid API key; restart server with `npm run dev` |
| "API Key not configured" message | Add `ANTHROPIC_API_KEY` or `GOOGLE_GEMINI_API_KEY` to `.env.local` |
| Upload not persisting | Add `DATABASE_URL` for persistent storage, or use Cloudinary for files |
| Build fails on Vercel | Ensure all env vars are set in Vercel Dashboard → Settings → Env Variables |
| Favicon not showing | Hard refresh browser: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac) |

---

Built by **Peter Shang** · [MyThing Platform](https://shangthing.vercel.app) · [Portfolio](https://petershang.vercel.app)
