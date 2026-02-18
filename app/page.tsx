'use client';

import PageLayout from '@/components/layout/PageLayout';
import Link from 'next/link';
import { Brain, Code2, Zap, BookOpen, Target, FlaskConical, Upload, ArrowRight, Sparkles } from 'lucide-react';

const sections = [
  {
    href: '/fundamentals',
    icon: BookOpen,
    emoji: '📚',
    label: 'Fundamentals',
    title: 'ML Foundations',
    desc: 'Core algorithms, deep learning, neural networks, model evaluation — from theory to implementation.',
    items: ['Linear/Logistic Regression', 'Decision Trees & Random Forests', 'Neural Networks & CNNs', 'Transformers Architecture'],
    color: 'from-blue-600 to-blue-800',
    border: 'border-blue-800/30',
    tag: '15+ algorithms',
  },
  {
    href: '/llms',
    icon: Brain,
    emoji: '🤖',
    label: 'LLMs & GenAI',
    title: 'LLMs & Generative AI',
    desc: 'Deep dive into GPT, Claude, Gemini, prompt engineering, and agentic AI systems.',
    items: ['GPT / Claude / Gemini comparison', 'Prompt Engineering Mastery', 'Function Calling & Tool Use', 'Multi-Agent Architecture'],
    color: 'from-purple-600 to-purple-800',
    border: 'border-purple-800/30',
    tag: 'HOT',
    badge: true,
  },
  {
    href: '/applied',
    icon: Target,
    emoji: '⚡',
    label: 'Applied AI',
    title: 'Applied AI Use Cases',
    desc: 'Production AI in federal finance, DoD, policy analysis, and news aggregation.',
    items: ['DoD Budget Forecasting (XGBoost)', 'Audit Risk Prediction', 'Policy Document NLP', 'Tech News Aggregation'],
    color: 'from-gold-600 to-amber-800',
    border: 'border-amber-800/30',
    tag: 'Real-world',
  },
  {
    href: '/toolkit',
    icon: Code2,
    emoji: '🛠',
    label: 'Toolkit',
    title: 'Developer Toolkit',
    desc: 'API guides, code libraries, production snippets — everything you need to ship ML.',
    items: ['OpenAI / Anthropic / Gemini APIs', 'scikit-learn & PyTorch', 'LangChain & LlamaIndex', 'FastAPI & Vercel Deployment'],
    color: 'from-green-600 to-green-800',
    border: 'border-green-800/30',
    tag: 'Production-ready',
  },
  {
    href: '/evaluation',
    icon: Zap,
    emoji: '📊',
    label: 'Evaluation',
    title: 'Model Evaluation',
    desc: 'Decision frameworks, benchmarks, cost calculators, and algorithm selectors.',
    items: ['LLM Evaluation Framework', 'MMLU / HumanEval Benchmarks', 'Interactive Algorithm Selector', 'Token Cost Calculator'],
    color: 'from-cyan-600 to-cyan-800',
    border: 'border-cyan-800/30',
    tag: 'Decision tools',
  },
  {
    href: '/advanced',
    icon: FlaskConical,
    emoji: '🔬',
    label: 'Advanced',
    title: 'Advanced Topics',
    desc: '2026 AI landscape, RAG systems, fine-tuning with LoRA, RLHF, and research papers.',
    items: ['RAG Systems & Vector DBs', 'Fine-Tuning / LoRA / QLoRA', 'Mixture of Experts (MoE)', 'Constitutional AI & RLHF'],
    color: 'from-pink-600 to-rose-800',
    border: 'border-pink-800/30',
    tag: 'Cutting-edge',
  },
];

const stats = [
  { value: '15+', label: 'Algorithms Covered' },
  { value: '6+', label: 'LLM Families' },
  { value: '100+', label: 'Code Examples' },
  { value: '7', label: 'Major Sections' },
];

export default function HomePage() {
  return (
    <PageLayout showSidebars={false}>
      {/* Hero */}
      <section id="top" className="relative pt-16 pb-20 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-700/30 text-purple-400 text-xs font-mono mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            AI/ML Knowledge Repository — Living Document
          </div>

          <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-none tracking-tight">
            <span className="gradient-text">AI/ML</span>
            <br />
            <span className="text-[#F0F0FF]">Knowledge Hub</span>
          </h1>

          <p className="text-lg text-[#A0A0C0] max-w-2xl mx-auto mb-3 leading-relaxed">
            From fundamentals to production-ready AI — algorithms, LLM comparisons,
            prompt engineering, agentic systems, and real-world implementations.
          </p>
          <p className="text-sm text-[#606080] mb-10 font-mono">
            Built by <span className="text-purple-400">Peter Shang</span> · Pentagon · DoD · Federal AI · Full-Stack
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/fundamentals"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-700 to-purple-600 text-white font-medium rounded-xl hover:from-purple-600 hover:to-purple-500 transition-all hover:scale-105"
            >
              Start Learning <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/llms"
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-purple-700/30 text-[#F0F0FF] font-medium rounded-xl hover:bg-white/10 transition-all"
            >
              <Brain className="w-4 h-4 text-purple-400" /> LLM Comparison
            </Link>
            <Link
              href="/upload"
              className="flex items-center gap-2 px-6 py-3 bg-gold-500/10 border border-gold-500/30 text-gold-400 font-medium rounded-xl hover:bg-gold-500/20 transition-all"
            >
              <Upload className="w-4 h-4" /> Upload Document
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-16 py-6 border-y border-purple-900/20">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-black gradient-text-purple">{stat.value}</div>
            <div className="text-xs text-[#606080] mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Section Cards Grid */}
      <section className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <p className="section-label">Explore the Hub</p>
          <div className="flex-1 h-px bg-gradient-to-r from-purple-600/30 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="card-base p-6 group flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {section.badge ? (
                    <span className="badge bg-gold-500/20 text-gold-400 border border-gold-500/30">
                      {section.tag}
                    </span>
                  ) : (
                    <span className="text-xs text-[#606080] font-mono">{section.tag}</span>
                  )}
                </div>

                <h3 className="font-bold text-[#F0F0FF] text-base mb-2 group-hover:text-purple-300 transition-colors">
                  {section.title}
                </h3>
                <p className="text-xs text-[#A0A0C0] leading-relaxed mb-4 flex-1">{section.desc}</p>

                <ul className="space-y-1.5">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-[#606080]">
                      <span className="w-1 h-1 rounded-full bg-purple-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center gap-1 text-xs text-purple-400 group-hover:gap-2 transition-all">
                  Explore section <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick links bottom */}
      <section className="max-w-6xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card-base p-6 border-purple-700/30">
          <h3 className="font-bold text-[#F0F0FF] mb-3">🤖 AI Assistant</h3>
          <p className="text-xs text-[#A0A0C0] mb-4">Ask anything about ML, algorithms, or code. Click the brain icon in the bottom right.</p>
          <div className="text-xs text-purple-400 font-mono">Powered by Claude API →</div>
        </div>
        <Link href="/upload" className="card-base p-6 border-gold-700/20 group">
          <h3 className="font-bold text-[#F0F0FF] mb-3 group-hover:text-gold-400 transition-colors">📄 Document Upload</h3>
          <p className="text-xs text-[#A0A0C0] mb-4">Upload PDFs, notebooks, research papers — get AI-powered analysis and insights.</p>
          <div className="text-xs text-gold-400 font-mono">Upload & analyze →</div>
        </Link>
        <Link href="https://shangthing.vercel.app" target="_blank" className="card-base p-6 group">
          <h3 className="font-bold text-[#F0F0FF] mb-3 group-hover:text-purple-300 transition-colors">✦ MyThing Platform</h3>
          <p className="text-xs text-[#A0A0C0] mb-4">Full personal knowledge platform with agentic AI, tech trends, federal finance, and notes.</p>
          <div className="text-xs text-purple-400 font-mono">shangthing.vercel.app →</div>
        </Link>
      </section>
    </PageLayout>
  );
}
