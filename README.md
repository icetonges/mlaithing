# 🧠 AI/ML Knowledge Hub

**A production-ready, full-stack AI/ML knowledge platform** built with Next.js 15, React 19, and TypeScript. Deployable to Vercel with zero configuration.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/ai-ml-hub)

## ✨ Features

- **7 Major Sections** — Fundamentals, LLMs & GenAI, Applied AI, Toolkit, Evaluation, Advanced Topics, Resources
- **🤖 AI Assistant** — Claude-powered chatbot for ML Q&A (bottom-right corner)
- **📄 Document Upload** — Upload PDFs, notebooks, scripts with AI analysis
- **⚡ Prompt Playground** — Interactive testing with real Claude API
- **📊 LLM Comparison Table** — Interactive side-by-side model comparison
- **🎯 Algorithm Selector** — Interactive decision tree for choosing the right ML algorithm
- **💰 Cost Calculator** — Token cost estimator across all major LLMs
- **🔍 Global Search** — Full-text search across all content (⌘K)
- **💻 Syntax-Highlighted Code** — Copy button, line numbers, language icons
- **📱 Responsive Design** — Three-column on desktop, mobile-friendly

## 🏗️ Tech Stack

```
Frontend:    Next.js 15, React 19, TypeScript, Tailwind CSS
AI APIs:     Anthropic Claude (primary), Google Gemini (fallback)
Fonts:       Syne (display), Space Mono (code)
Icons:       Lucide React
Code:        react-syntax-highlighter (VS Code Dark+ theme)
Upload:      react-dropzone + Next.js API Routes
Search:      Client-side Fuse.js
Deploy:      Vercel (recommended)
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd ai-ml-hub
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Required for AI Assistant & Prompt Playground
ANTHROPIC_API_KEY=sk-ant-...

# Optional fallback
GOOGLE_GEMINI_API_KEY=AIza...

# Optional database (for persistent uploads metadata)
DATABASE_URL=postgresql://...
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel
```bash
npm install -g vercel
vercel deploy
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

## 📁 Project Structure

```
ai-ml-hub/
├── app/
│   ├── page.tsx                 # Homepage / Hub overview
│   ├── fundamentals/page.tsx    # ML fundamentals (algorithms, deep learning)
│   ├── llms/page.tsx            # LLMs, prompt engineering, agents
│   ├── applied/page.tsx         # Applied AI / DoD use cases
│   ├── toolkit/page.tsx         # API guides, libraries, snippets
│   ├── evaluation/page.tsx      # Model evaluation, algorithm selector
│   ├── advanced/page.tsx        # Advanced topics, RAG, fine-tuning
│   ├── resources/page.tsx       # Courses, books, community
│   ├── upload/page.tsx          # Document upload interface
│   └── api/
│       ├── chat/route.ts        # AI chat API (Claude + Gemini fallback)
│       ├── upload/route.ts      # Document upload + AI analysis
│       └── search/route.ts      # Search API
├── components/
│   ├── layout/
│   │   ├── Header.tsx           # Navigation with mobile menu
│   │   ├── Sidebar.tsx          # Left nav tree (collapsible)
│   │   ├── RightPanel.tsx       # TOC + quick links
│   │   └── PageLayout.tsx       # Three-column layout wrapper
│   ├── ui/
│   │   ├── CodeBlock.tsx        # Syntax-highlighted code with copy button
│   │   ├── AlgorithmCard.tsx    # Algorithm display with expandable code
│   │   ├── ComparisonTable.tsx  # Interactive LLM comparison
│   │   ├── Callout.tsx          # Info/warning/tip boxes
│   │   └── SectionHeader.tsx    # Section heading with divider
│   └── features/
│       ├── AIAssistant.tsx      # Floating AI chatbot
│       ├── DocumentUpload.tsx   # Drag-drop file upload with AI analysis
│       ├── PromptPlayground.tsx # Interactive prompt testing
│       └── SearchModal.tsx      # Global search (⌘K)
├── .env.example                 # Environment variable template
└── README.md
```

## 🔑 API Keys

| Key | Required | Purpose |
|-----|----------|---------|
| `ANTHROPIC_API_KEY` | Recommended | AI Assistant, Prompt Playground, document analysis |
| `GOOGLE_GEMINI_API_KEY` | Optional | Fallback AI provider |
| `DATABASE_URL` | Optional | Persistent storage for uploaded file metadata |

Get keys:
- Anthropic: [console.anthropic.com](https://console.anthropic.com)
- Google Gemini: [aistudio.google.com](https://aistudio.google.com)

**Note:** The app works without API keys — AI features show configuration instructions instead.

## 📄 Document Upload

Supported formats: `.pdf`, `.py`, `.md`, `.docx`, `.csv`, `.json`, `.ts`, `.js`, `.txt`

Max size: 10MB per file

When API key is configured, uploaded documents receive:
- AI-generated summary (2-3 sentences)
- Key insights (3-5 bullet points)
- Concepts identified

Files are saved to `public/uploads/` directory.

## 🎨 Customization

### Colors (globals.css)
```css
:root {
  --purple-primary: #8B5CF6;  /* Primary brand color */
  --gold: #F5C518;             /* Accent color */
  --bg-base: #0A0A0F;         /* Page background */
}
```

### Adding Content
Each page uses a consistent structure:
```tsx
// Add a new algorithm to fundamentals
<AlgorithmCard
  title="Your Algorithm"
  emoji="🔮"
  category="classification"
  overview="Brief description..."
  bestFor={['Use case 1', 'Use case 2']}
  avoidWhen={['Anti-pattern 1']}
  code={yourCodeString}
/>
```

## 🔗 Related Projects

- **[MyThing Platform](https://shangthing.vercel.app)** — Personal knowledge platform
- **[Portfolio](https://petershang.vercel.app)** — Interactive resume with agentic AI

## 📝 License

MIT — Built by Peter Shang
