'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
  badge?: string;
}

const navStructure: NavItem[] = [
  {
    label: '📚 Fundamentals',
    href: '/fundamentals',
    children: [
      { label: 'ML Basics', href: '/fundamentals#ml-basics' },
      { label: 'Core Algorithms', href: '/fundamentals#algorithms' },
      { label: 'Deep Learning', href: '/fundamentals#deep-learning' },
      { label: 'Transformers', href: '/fundamentals#transformers' },
      { label: 'Model Evaluation', href: '/fundamentals#evaluation' },
    ],
  },
  {
    label: '🤖 LLMs & GenAI',
    href: '/llms',
    badge: 'HOT',
    children: [
      { label: 'LLM Landscape', href: '/llms#landscape' },
      { label: 'GPT Series', href: '/llms#gpt' },
      { label: 'Claude Series', href: '/llms#claude' },
      { label: 'Gemini Series', href: '/llms#gemini' },
      { label: 'Open Source Models', href: '/llms#opensource' },
      { label: 'Comparison Matrix', href: '/llms#comparison' },
      { label: 'Prompt Engineering', href: '/llms#prompting' },
      { label: 'Agentic AI', href: '/llms#agents' },
    ],
  },
  {
    label: '⚡ Applied AI',
    href: '/applied',
    children: [
      { label: 'Federal Finance / DoD', href: '/applied#dod' },
      { label: 'Budget Forecasting', href: '/applied#budget' },
      { label: 'Policy Analysis', href: '/applied#policy' },
      { label: 'News Aggregation', href: '/applied#news' },
      { label: 'Text Processing', href: '/applied#text' },
      { label: 'Computer Vision', href: '/applied#cv' },
      { label: 'Time Series', href: '/applied#timeseries' },
    ],
  },
  {
    label: '🛠 Toolkit',
    href: '/toolkit',
    children: [
      { label: 'OpenAI API', href: '/toolkit#openai' },
      { label: 'Anthropic API', href: '/toolkit#anthropic' },
      { label: 'Google Gemini API', href: '/toolkit#gemini' },
      { label: 'Hugging Face', href: '/toolkit#huggingface' },
      { label: 'scikit-learn', href: '/toolkit#sklearn' },
      { label: 'PyTorch / TF', href: '/toolkit#pytorch' },
      { label: 'LangChain', href: '/toolkit#langchain' },
      { label: 'Vector DBs', href: '/toolkit#vectordb' },
      { label: 'Code Snippets', href: '/toolkit#snippets' },
    ],
  },
  {
    label: '📊 Evaluation',
    href: '/evaluation',
    children: [
      { label: 'LLM Eval Framework', href: '/evaluation#llm' },
      { label: 'Benchmarks', href: '/evaluation#benchmarks' },
      { label: 'Algorithm Selector', href: '/evaluation#selector' },
      { label: 'Cost Calculator', href: '/evaluation#calculator' },
    ],
  },
  {
    label: '🔬 Advanced',
    href: '/advanced',
    children: [
      { label: '2026 AI Landscape', href: '/advanced#landscape' },
      { label: 'RAG Systems', href: '/advanced#rag' },
      { label: 'Fine-Tuning / LoRA', href: '/advanced#finetune' },
      { label: 'MoE Architecture', href: '/advanced#moe' },
      { label: 'RLHF', href: '/advanced#rlhf' },
      { label: 'Notable Papers', href: '/advanced#papers' },
    ],
  },
  {
    label: '📖 Resources',
    href: '/resources',
    children: [
      { label: 'Courses', href: '/resources#courses' },
      { label: 'Books', href: '/resources#books' },
      { label: 'Tools & Platforms', href: '/resources#tools' },
      { label: 'Community', href: '/resources#community' },
    ],
  },
];

function NavSection({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(
    pathname === item.href || item.children?.some((c) => pathname === c.href)
  );

  const isActive = pathname === item.href;
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className={depth === 0 ? 'mb-1' : ''}>
      <div
        className={`nav-item ${isActive ? 'active' : ''} ${depth > 0 ? 'text-xs py-1 pl-8' : 'font-medium'}`}
        onClick={() => hasChildren && setOpen(!open)}
      >
        {item.href && !hasChildren ? (
          <Link href={item.href} className="flex-1 truncate">{item.label}</Link>
        ) : (
          <span className="flex-1 truncate">{item.label}</span>
        )}

        {item.badge && (
          <span className="badge bg-gold-500/20 text-gold-400 text-[9px]">{item.badge}</span>
        )}

        {hasChildren && (
          <span className="ml-auto text-[#606080]">
            {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </span>
        )}
      </div>

      {hasChildren && open && (
        <div className="mt-0.5">
          {item.children!.map((child) => (
            <NavSection key={child.href || child.label} item={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="sidebar-left w-56 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-4 pr-2">
      <div className="mb-4 px-3">
        <p className="section-label text-[10px]">Navigation</p>
      </div>

      <nav className="space-y-0.5">
        {navStructure.map((item) => (
          <NavSection key={item.href || item.label} item={item} />
        ))}

        <div className="mt-4 pt-4 border-t border-purple-900/30">
          <Link href="/upload" className="nav-item text-gold-400 hover:text-gold-300">
            <span>📄</span>
            <span className="font-medium">Upload Document</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
}
