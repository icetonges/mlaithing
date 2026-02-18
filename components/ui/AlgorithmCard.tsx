'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import CodeBlock from './CodeBlock';

interface AlgorithmCardProps {
  title: string;
  overview: string;
  emoji?: string;
  bestFor: string[];
  avoidWhen: string[];
  tip?: string;
  complexity?: { time: string; space: string };
  code?: string;
  language?: string;
  category?: 'classification' | 'regression' | 'clustering' | 'deep-learning' | 'nlp';
}

const categoryColors = {
  classification: 'bg-blue-900/20 text-blue-400 border-blue-800/30',
  regression: 'bg-green-900/20 text-green-400 border-green-800/30',
  clustering: 'bg-orange-900/20 text-orange-400 border-orange-800/30',
  'deep-learning': 'bg-purple-900/20 text-purple-400 border-purple-800/30',
  nlp: 'bg-pink-900/20 text-pink-400 border-pink-800/30',
};

export default function AlgorithmCard({
  title,
  overview,
  emoji = '🧠',
  bestFor,
  avoidWhen,
  tip,
  complexity,
  code,
  language = 'python',
  category,
}: AlgorithmCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="card-base p-5 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{emoji}</span>
          <div>
            <h3 className="font-bold text-[#F0F0FF] text-base">{title}</h3>
            {category && (
              <span className={`badge border text-[10px] mt-0.5 ${categoryColors[category]}`}>
                {category}
              </span>
            )}
          </div>
        </div>
        {complexity && (
          <div className="text-right shrink-0">
            <div className="text-[10px] text-[#606080] font-mono">Time: <span className="text-purple-400">{complexity.time}</span></div>
            <div className="text-[10px] text-[#606080] font-mono">Space: <span className="text-purple-400">{complexity.space}</span></div>
          </div>
        )}
      </div>

      <p className="text-sm text-[#A0A0C0] leading-relaxed mb-4">{overview}</p>

      {/* Best For / Avoid When */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-[10px] text-green-500 font-mono uppercase tracking-wider mb-2">✅ Best For</p>
          <ul className="space-y-1">
            {bestFor.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-[#A0A0C0]">
                <CheckCircle className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] text-red-400 font-mono uppercase tracking-wider mb-2">❌ Avoid When</p>
          <ul className="space-y-1">
            {avoidWhen.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-[#A0A0C0]">
                <XCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {tip && (
        <div className="flex items-start gap-2 p-3 bg-gold-500/10 border border-gold-500/20 rounded-lg mb-3">
          <Lightbulb className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gold-300">{tip}</p>
        </div>
      )}

      {/* Code toggle */}
      {code && (
        <div>
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors mb-2"
          >
            {showCode ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {showCode ? 'Hide Code' : 'Show Implementation'}
          </button>
          {showCode && <CodeBlock code={code} language={language} />}
        </div>
      )}
    </div>
  );
}
