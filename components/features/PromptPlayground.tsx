'use client';

import { useState } from 'react';
import { Play, Copy, Check, Loader2, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

const TEMPLATES = [
  {
    name: 'DoD Budget Summarizer',
    system: 'You are a DoD financial analyst AI. Analyze budget documents and provide concise summaries highlighting key appropriations, major funding changes, and strategic implications.',
    user: 'Summarize the FY2025 defense budget priorities for Army modernization...',
  },
  {
    name: 'Code Explainer',
    system: 'You are an expert ML engineer. Explain code clearly, line by line when helpful, highlighting the ML concepts being implemented.',
    user: 'Explain this XGBoost implementation:\n```python\nmodel = xgb.XGBClassifier(n_estimators=100, max_depth=6, learning_rate=0.1)\nmodel.fit(X_train, y_train)\n```',
  },
  {
    name: 'Algorithm Advisor',
    system: 'You are an ML algorithm expert. Help users choose the best algorithm for their specific problem. Always ask clarifying questions about data size, interpretability requirements, and performance needs.',
    user: 'I have 50,000 tabular records with 20 features and want to predict customer churn. Which model should I use?',
  },
  {
    name: 'Chain-of-Thought Reasoning',
    system: 'Think through problems step by step. Show your reasoning process explicitly before giving your final answer.',
    user: 'Should I use a transformer or LSTM for time-series anomaly detection on DoD spending data?',
  },
];

export default function PromptPlayground() {
  const [system, setSystem] = useState(TEMPLATES[0].system);
  const [userPrompt, setUserPrompt] = useState(TEMPLATES[0].user);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const run = async () => {
    if (!userPrompt.trim() || loading) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system,
          messages: [{ role: 'user', content: userPrompt }],
          temperature,
          max_tokens: maxTokens,
        }),
      });

      const data = await res.json();
      setResponse(data.content || 'No response generated');
    } catch {
      setResponse('Error: Could not connect to AI API. Check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = async () => {
    if (!response) return;
    await navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="card-base p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-[#F0F0FF]">Prompt Playground</h3>
          <p className="text-xs text-[#606080] mt-0.5">Test prompts against Claude · Powered by Anthropic API</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-purple-900/30 text-purple-400' : 'bg-white/5 text-[#606080] hover:text-white'}`}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Templates */}
      <div className="flex flex-wrap gap-2 mb-4">
        {TEMPLATES.map((t) => (
          <button
            key={t.name}
            onClick={() => { setSystem(t.system); setUserPrompt(t.user); setResponse(''); }}
            className="px-3 py-1.5 text-xs border border-purple-800/30 text-[#A0A0C0] hover:text-purple-300 hover:border-purple-600/50 rounded-lg transition-all"
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="grid grid-cols-2 gap-4 p-4 bg-[#0A0A0F] rounded-xl border border-purple-900/20 mb-4">
          <div>
            <label className="text-xs text-[#606080] font-mono uppercase tracking-wider">
              Temperature: <span className="text-purple-400">{temperature}</span>
            </label>
            <input
              type="range" min="0" max="1" step="0.1" value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full mt-2 accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-[#3B3B5C]">
              <span>Precise</span><span>Creative</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-[#606080] font-mono uppercase tracking-wider">
              Max Tokens: <span className="text-purple-400">{maxTokens}</span>
            </label>
            <input
              type="range" min="100" max="4000" step="100" value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full mt-2 accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-[#3B3B5C]">
              <span>Short</span><span>Long</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Left: Inputs */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-purple-400 font-mono uppercase tracking-wider mb-2 block">
              System Prompt
            </label>
            <textarea
              value={system}
              onChange={(e) => setSystem(e.target.value)}
              rows={5}
              className="w-full bg-[#0A0A0F] border border-purple-900/20 rounded-lg p-3 text-xs text-[#A0A0C0] outline-none focus:border-purple-600/50 resize-none leading-relaxed"
              placeholder="Set the AI's role and behavior..."
            />
          </div>
          <div>
            <label className="text-xs text-gold-400 font-mono uppercase tracking-wider mb-2 block">
              User Prompt
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              rows={6}
              className="w-full bg-[#0A0A0F] border border-purple-900/20 rounded-lg p-3 text-xs text-[#A0A0C0] outline-none focus:border-gold-500/50 resize-none leading-relaxed"
              placeholder="Enter your prompt here..."
            />
          </div>
          <button
            onClick={run}
            disabled={loading || !userPrompt.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-700 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Running...</>
            ) : (
              <><Play className="w-4 h-4" /> Run Prompt</>
            )}
          </button>
        </div>

        {/* Right: Response */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-green-400 font-mono uppercase tracking-wider">Response</label>
            {response && (
              <button onClick={copyResponse} className="flex items-center gap-1 text-xs text-[#606080] hover:text-white transition-colors">
                {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
          <div className="h-[calc(100%-2rem)] min-h-[280px] bg-[#0A0A0F] border border-purple-900/20 rounded-lg p-3 overflow-y-auto">
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-[#606080]">
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                Generating response...
              </div>
            ) : response ? (
              <p className="text-xs text-[#A0A0C0] leading-relaxed whitespace-pre-wrap">{response}</p>
            ) : (
              <p className="text-xs text-[#3B3B5C] italic">Response will appear here after running...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
