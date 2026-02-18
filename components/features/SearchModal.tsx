'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const searchData = [
  { title: 'Linear Regression', section: 'Fundamentals', href: '/fundamentals#linear-regression', tags: ['regression', 'supervised'] },
  { title: 'Random Forest', section: 'Fundamentals', href: '/fundamentals#random-forest', tags: ['classification', 'ensemble'] },
  { title: 'Neural Networks', section: 'Fundamentals', href: '/fundamentals#neural-networks', tags: ['deep learning'] },
  { title: 'Transformers Architecture', section: 'Fundamentals', href: '/fundamentals#transformers', tags: ['attention', 'NLP'] },
  { title: 'GPT-4o Overview', section: 'LLMs & GenAI', href: '/llms#gpt', tags: ['openai', 'llm'] },
  { title: 'Claude API Setup', section: 'LLMs & GenAI', href: '/llms#claude', tags: ['anthropic', 'api'] },
  { title: 'Gemini Integration', section: 'LLMs & GenAI', href: '/llms#gemini', tags: ['google', 'api'] },
  { title: 'Prompt Engineering', section: 'LLMs & GenAI', href: '/llms#prompting', tags: ['prompts', 'techniques'] },
  { title: 'Agentic AI Systems', section: 'LLMs & GenAI', href: '/llms#agents', tags: ['agents', 'tools'] },
  { title: 'DoD Budget Forecasting', section: 'Applied AI', href: '/applied#budget', tags: ['federal', 'forecasting'] },
  { title: 'LangChain Guide', section: 'Toolkit', href: '/toolkit#langchain', tags: ['framework', 'llm'] },
  { title: 'Vector Databases', section: 'Toolkit', href: '/toolkit#vectordb', tags: ['pinecone', 'weaviate'] },
  { title: 'RAG Systems', section: 'Advanced', href: '/advanced#rag', tags: ['retrieval', 'augmented'] },
  { title: 'Fine-Tuning with LoRA', section: 'Advanced', href: '/advanced#finetune', tags: ['training', 'adaptation'] },
  { title: 'LLM Benchmark Guide', section: 'Evaluation', href: '/evaluation#benchmarks', tags: ['mmlu', 'humaneval'] },
  { title: 'Token Cost Calculator', section: 'Evaluation', href: '/evaluation#calculator', tags: ['cost', 'pricing'] },
  { title: 'Upload Documents', section: 'Tools', href: '/upload', tags: ['pdf', 'analysis'] },
];

interface SearchModalProps {
  onClose: () => void;
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(searchData.slice(0, 5));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(searchData.slice(0, 5));
      return;
    }
    const q = query.toLowerCase();
    const filtered = searchData.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q) ||
        item.tags.some((t) => t.includes(q))
    );
    setResults(filtered.slice(0, 8));
  }, [query]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#0F0F1A] border border-purple-800/30 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-purple-900/30">
          <Search className="w-4.5 h-4.5 text-purple-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search algorithms, models, guides..."
            className="flex-1 bg-transparent text-[#F0F0FF] placeholder-[#3B3B5C] outline-none text-sm"
          />
          <button onClick={onClose}>
            <X className="w-4 h-4 text-[#606080] hover:text-white" />
          </button>
        </div>

        {/* Results */}
        <div className="py-2 max-h-[400px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-[#606080] text-sm">No results found</div>
          ) : (
            <>
              <p className="px-4 py-1.5 text-[10px] text-[#606080] uppercase tracking-wider font-mono">
                {query ? `${results.length} results` : 'Recent topics'}
              </p>
              {results.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-4 py-3 hover:bg-purple-900/20 transition-colors group"
                >
                  <div>
                    <p className="text-sm text-[#F0F0FF] group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[#606080]">{item.section}</span>
                      {item.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[9px] bg-[#1A1A35] text-[#606080] px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#3B3B5C] group-hover:text-purple-400 transition-colors" />
                </Link>
              ))}
            </>
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-purple-900/30 flex items-center gap-4 text-[10px] text-[#606080]">
          <span><kbd className="bg-[#1A1A35] px-1.5 py-0.5 rounded text-[9px]">↑↓</kbd> navigate</span>
          <span><kbd className="bg-[#1A1A35] px-1.5 py-0.5 rounded text-[9px]">↵</kbd> open</span>
          <span><kbd className="bg-[#1A1A35] px-1.5 py-0.5 rounded text-[9px]">esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
