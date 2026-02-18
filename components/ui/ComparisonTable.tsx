'use client';

import { useState } from 'react';

interface ModelData {
  name: string;
  provider: string;
  contextWindow: string;
  inputCost: string;
  outputCost: string;
  speed: 1 | 2 | 3 | 4 | 5;
  intelligence: 1 | 2 | 3 | 4 | 5;
  multimodal: boolean;
  functionCalling: boolean;
  streaming: boolean;
  strengths: string[];
  badge?: string;
  badgeColor?: string;
}

const models: ModelData[] = [
  {
    name: 'GPT-4o',
    provider: 'OpenAI',
    contextWindow: '128K',
    inputCost: '$5/1M',
    outputCost: '$15/1M',
    speed: 4,
    intelligence: 5,
    multimodal: true,
    functionCalling: true,
    streaming: true,
    strengths: ['Coding', 'Reasoning', 'Vision'],
    badge: 'Popular',
    badgeColor: 'bg-blue-900/30 text-blue-400',
  },
  {
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    contextWindow: '200K',
    inputCost: '$3/1M',
    outputCost: '$15/1M',
    speed: 4,
    intelligence: 5,
    multimodal: true,
    functionCalling: true,
    streaming: true,
    strengths: ['Long context', 'Safety', 'Writing'],
    badge: 'Preferred',
    badgeColor: 'bg-purple-900/30 text-purple-400',
  },
  {
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    contextWindow: '1M',
    inputCost: '$0.15/1M',
    outputCost: '$0.60/1M',
    speed: 5,
    intelligence: 4,
    multimodal: true,
    functionCalling: true,
    streaming: true,
    strengths: ['Speed', 'Long context', 'Cost'],
    badge: 'Fast',
    badgeColor: 'bg-green-900/30 text-green-400',
  },
  {
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    contextWindow: '2M',
    inputCost: '$3.50/1M',
    outputCost: '$10.50/1M',
    speed: 3,
    intelligence: 5,
    multimodal: true,
    functionCalling: true,
    streaming: true,
    strengths: ['Reasoning', 'Huge context', 'Code'],
    badge: 'Power',
    badgeColor: 'bg-gold-500/20 text-gold-400',
  },
  {
    name: 'Llama 3.3 70B',
    provider: 'Meta (OSS)',
    contextWindow: '128K',
    inputCost: 'Free*',
    outputCost: 'Free*',
    speed: 3,
    intelligence: 4,
    multimodal: false,
    functionCalling: true,
    streaming: true,
    strengths: ['Open source', 'Privacy', 'Fine-tunable'],
    badge: 'OSS',
    badgeColor: 'bg-orange-900/30 text-orange-400',
  },
  {
    name: 'Phi-4',
    provider: 'Microsoft',
    contextWindow: '16K',
    inputCost: 'Free*',
    outputCost: 'Free*',
    speed: 5,
    intelligence: 3,
    multimodal: false,
    functionCalling: true,
    streaming: true,
    strengths: ['On-device', 'Small size', 'Reasoning'],
    badge: 'Tiny',
    badgeColor: 'bg-cyan-900/30 text-cyan-400',
  },
];

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i <= value ? 'bg-purple-400' : 'bg-[#2A2A4A]'}`}
        />
      ))}
    </div>
  );
}

function Bool({ value }: { value: boolean }) {
  return value ? (
    <span className="text-green-400 text-sm">✓</span>
  ) : (
    <span className="text-[#3B3B5C] text-sm">–</span>
  );
}

export default function ComparisonTable() {
  const [selected, setSelected] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<keyof ModelData>('intelligence');

  const filteredModels = selected.length > 0
    ? models.filter((m) => selected.includes(m.name))
    : models;

  return (
    <div className="my-6">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-xs text-[#606080] pt-1">Filter:</span>
        {models.map((m) => (
          <button
            key={m.name}
            onClick={() =>
              setSelected((prev) =>
                prev.includes(m.name) ? prev.filter((n) => n !== m.name) : [...prev, m.name]
              )
            }
            className={`px-3 py-1 rounded-full text-xs border transition-all ${
              selected.includes(m.name) || selected.length === 0
                ? 'bg-purple-900/30 border-purple-700/50 text-purple-300'
                : 'border-[#2A2A4A] text-[#606080] hover:border-purple-700/30'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-purple-900/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple-900/30">
              <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider bg-purple-900/10">Model</th>
              <th className="text-left px-3 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider bg-purple-900/10">Context</th>
              <th className="text-left px-3 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider bg-purple-900/10">Cost In</th>
              <th className="text-left px-3 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider bg-purple-900/10">Cost Out</th>
              <th className="text-left px-3 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider bg-purple-900/10">Speed</th>
              <th className="text-left px-3 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider bg-purple-900/10">Intelligence</th>
              <th className="text-center px-3 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider bg-purple-900/10">Vision</th>
              <th className="text-center px-3 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider bg-purple-900/10">Tools</th>
              <th className="text-left px-3 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider bg-purple-900/10">Strengths</th>
            </tr>
          </thead>
          <tbody>
            {filteredModels.map((model, i) => (
              <tr
                key={model.name}
                className="border-b border-[#1A1A35] hover:bg-purple-900/5 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-semibold text-[#F0F0FF] text-sm">{model.name}</div>
                      <div className="text-[10px] text-[#606080]">{model.provider}</div>
                    </div>
                    {model.badge && (
                      <span className={`badge text-[9px] px-1.5 py-0.5 ${model.badgeColor}`}>
                        {model.badge}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 font-mono text-xs text-gold-400">{model.contextWindow}</td>
                <td className="px-3 py-3 font-mono text-xs text-[#A0A0C0]">{model.inputCost}</td>
                <td className="px-3 py-3 font-mono text-xs text-[#A0A0C0]">{model.outputCost}</td>
                <td className="px-3 py-3"><Stars value={model.speed} /></td>
                <td className="px-3 py-3"><Stars value={model.intelligence} /></td>
                <td className="px-3 py-3 text-center"><Bool value={model.multimodal} /></td>
                <td className="px-3 py-3 text-center"><Bool value={model.functionCalling} /></td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {model.strengths.map((s) => (
                      <span key={s} className="text-[9px] bg-[#1A1A35] text-[#A0A0C0] px-2 py-0.5 rounded border border-[#2A2A4A]">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[10px] text-[#606080] mt-2">* Hosting costs apply for self-hosted open-source models. Pricing approximate and subject to change.</p>
    </div>
  );
}
