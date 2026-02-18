'use client';

import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import ComparisonTable from '@/components/ui/ComparisonTable';
import Callout from '@/components/ui/Callout';
import SectionHeader from '@/components/ui/SectionHeader';

const tocItems = [
  { id: 'llm', label: 'LLM Evaluation', level: 2 },
  { id: 'benchmarks', label: 'Benchmarks', level: 3 },
  { id: 'selector', label: 'Algorithm Selector', level: 2 },
  { id: 'calculator', label: 'Cost Calculator', level: 2 },
];

// Algorithm Decision Tree
type Question = {
  text: string;
  options: { label: string; next: string | string[] }[];
};

const questions: Record<string, Question> = {
  start: {
    text: "What type of output do you need?",
    options: [
      { label: "Predict a number (continuous)", next: "regression_data" },
      { label: "Classify into categories", next: "classification_data" },
      { label: "Generate text", next: "generative" },
      { label: "Find patterns/clusters", next: "clustering" },
    ],
  },
  regression_data: {
    text: "How large is your dataset?",
    options: [
      { label: "< 10K rows", next: "regression_small" },
      { label: "10K - 1M rows", next: "regression_medium" },
      { label: "> 1M rows", next: "regression_large" },
    ],
  },
  regression_small: {
    text: "Do you need interpretability (explain predictions)?",
    options: [
      { label: "Yes — stakeholders need explanations", next: "rec_linear" },
      { label: "No — just accuracy matters", next: "rec_rf_reg" },
    ],
  },
  classification_data: {
    text: "What's your data type?",
    options: [
      { label: "Tabular / structured data", next: "classification_size" },
      { label: "Text / NLP", next: "rec_llm_cls" },
      { label: "Images", next: "rec_cnn" },
    ],
  },
  classification_size: {
    text: "Dataset size?",
    options: [
      { label: "< 10K rows", next: "classification_interp" },
      { label: "> 10K rows", next: "rec_xgboost" },
    ],
  },
  classification_interp: {
    text: "Interpretability required?",
    options: [
      { label: "Yes (regulatory/audit context)", next: "rec_logistic" },
      { label: "No", next: "rec_rf_cls" },
    ],
  },
  generative: {
    text: "What's the task?",
    options: [
      { label: "Chat / Q&A", next: "rec_claude_gpt" },
      { label: "Document analysis / long context", next: "rec_claude" },
      { label: "Code generation", next: "rec_gpt4" },
      { label: "Fast/cheap bulk processing", next: "rec_gemini_flash" },
    ],
  },
  clustering: {
    text: "Do you know the number of clusters?",
    options: [
      { label: "Yes", next: "rec_kmeans" },
      { label: "No", next: "rec_dbscan" },
    ],
  },
  regression_medium: { text: "Need feature importance?", options: [{ label: "Yes", next: "rec_xgboost_reg" }, { label: "No", next: "rec_nn_reg" }] },
  regression_large: { text: "Data type?", options: [{ label: "Tabular", next: "rec_xgboost_reg" }, { label: "Time Series", next: "rec_lstm" }] },
  rec_linear: { text: "✅ Recommendation: Linear Regression", options: [] },
  rec_rf_reg: { text: "✅ Recommendation: Random Forest Regressor", options: [] },
  rec_rf_cls: { text: "✅ Recommendation: Random Forest Classifier", options: [] },
  rec_logistic: { text: "✅ Recommendation: Logistic Regression", options: [] },
  rec_xgboost: { text: "✅ Recommendation: XGBoost / LightGBM", options: [] },
  rec_xgboost_reg: { text: "✅ Recommendation: XGBoost Regressor", options: [] },
  rec_nn_reg: { text: "✅ Recommendation: Neural Network (MLP)", options: [] },
  rec_lstm: { text: "✅ Recommendation: LSTM / Transformer-XL", options: [] },
  rec_llm_cls: { text: "✅ Recommendation: Fine-tuned BERT / Claude zero-shot", options: [] },
  rec_cnn: { text: "✅ Recommendation: CNN (EfficientNet/ResNet) + Transfer Learning", options: [] },
  rec_claude_gpt: { text: "✅ Recommendation: Claude 3.5 Sonnet or GPT-4o", options: [] },
  rec_claude: { text: "✅ Recommendation: Claude 3.5 Sonnet (200K context)", options: [] },
  rec_gpt4: { text: "✅ Recommendation: GPT-4o (best coding)", options: [] },
  rec_gemini_flash: { text: "✅ Recommendation: Gemini 2.0 Flash (fastest, cheapest)", options: [] },
  rec_kmeans: { text: "✅ Recommendation: K-Means Clustering", options: [] },
  rec_dbscan: { text: "✅ Recommendation: DBSCAN or Hierarchical Clustering", options: [] },
};

function AlgorithmSelector() {
  const [current, setCurrent] = useState('start');
  const [history, setHistory] = useState<string[]>([]);

  const question = questions[current];
  const isRecommendation = question.options.length === 0;

  const choose = (next: string) => {
    setHistory((h) => [...h, current]);
    setCurrent(next);
  };

  const back = () => {
    if (history.length > 0) {
      setCurrent(history[history.length - 1]);
      setHistory((h) => h.slice(0, -1));
    }
  };

  const reset = () => {
    setCurrent('start');
    setHistory([]);
  };

  return (
    <div className="card-base p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-[#F0F0FF]">Interactive Algorithm Selector</h3>
        <div className="flex gap-2">
          {history.length > 0 && (
            <button onClick={back} className="text-xs text-[#606080] hover:text-white px-3 py-1.5 rounded-lg border border-[#2A2A4A] hover:border-purple-700/30 transition-all">
              ← Back
            </button>
          )}
          {current !== 'start' && (
            <button onClick={reset} className="text-xs text-[#606080] hover:text-white px-3 py-1.5 rounded-lg border border-[#2A2A4A] hover:border-purple-700/30 transition-all">
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < history.length ? 'bg-purple-500' : 'bg-[#1A1A35]'}`} />
        ))}
      </div>

      {/* Question */}
      <div className={`text-lg font-bold mb-5 ${isRecommendation ? 'text-green-400' : 'text-[#F0F0FF]'}`}>
        {question.text}
      </div>

      {isRecommendation ? (
        <div className="space-y-3">
          <p className="text-sm text-[#A0A0C0]">Based on your requirements, this is the best starting point. You can always experiment with alternatives.</p>
          <button onClick={reset} className="px-5 py-2.5 bg-purple-700 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors">
            Start Over
          </button>
        </div>
      ) : (
        <div className="grid gap-2">
          {question.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => choose(opt.next as string)}
              className="text-left px-4 py-3 rounded-xl border border-purple-900/30 text-sm text-[#A0A0C0] hover:text-white hover:border-purple-600/50 hover:bg-purple-900/20 transition-all"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Token Cost Calculator
const modelPricing = [
  { model: 'GPT-4o', inputPer1M: 5, outputPer1M: 15 },
  { model: 'Claude 3.5 Sonnet', inputPer1M: 3, outputPer1M: 15 },
  { model: 'Claude 3.5 Haiku', inputPer1M: 0.8, outputPer1M: 4 },
  { model: 'Gemini 2.5 Flash', inputPer1M: 0.15, outputPer1M: 0.6 },
  { model: 'Gemini 2.5 Pro', inputPer1M: 3.5, outputPer1M: 10.5 },
];

function CostCalculator() {
  const [inputTokens, setInputTokens] = useState(1000);
  const [outputTokens, setOutputTokens] = useState(500);
  const [requests, setRequests] = useState(1000);

  return (
    <div className="card-base p-6">
      <h3 className="font-bold text-[#F0F0FF] mb-5">Token Cost Calculator</h3>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Input Tokens / Request', value: inputTokens, setter: setInputTokens, max: 100000 },
          { label: 'Output Tokens / Request', value: outputTokens, setter: setOutputTokens, max: 10000 },
          { label: 'Requests / Month', value: requests, setter: setRequests, max: 100000 },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-xs text-[#606080] font-mono uppercase tracking-wider block mb-2">
              {field.label}: <span className="text-purple-400">{field.value.toLocaleString()}</span>
            </label>
            <input
              type="range" min="100" max={field.max} value={field.value}
              onChange={(e) => field.setter(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-purple-900/30">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-purple-900/30 bg-purple-900/10">
              <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase">Model</th>
              <th className="text-right px-4 py-3 text-xs text-purple-400 font-mono uppercase">Per Request</th>
              <th className="text-right px-4 py-3 text-xs text-purple-400 font-mono uppercase">Monthly</th>
              <th className="text-right px-4 py-3 text-xs text-purple-400 font-mono uppercase">Annual</th>
            </tr>
          </thead>
          <tbody>
            {modelPricing
              .map((m) => {
                const inputCost = (inputTokens / 1_000_000) * m.inputPer1M;
                const outputCost = (outputTokens / 1_000_000) * m.outputPer1M;
                const perRequest = inputCost + outputCost;
                const monthly = perRequest * requests;
                const annual = monthly * 12;
                return { ...m, perRequest, monthly, annual };
              })
              .sort((a, b) => a.monthly - b.monthly)
              .map((m, i) => (
                <tr key={m.model} className={`border-b border-[#1A1A35] ${i === 0 ? 'bg-green-900/10' : ''}`}>
                  <td className="px-4 py-3 font-medium text-[#F0F0FF]">
                    {i === 0 && <span className="badge bg-green-900/30 text-green-400 text-[9px] mr-2">Cheapest</span>}
                    {m.model}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-[#A0A0C0]">${m.perRequest.toFixed(4)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-bold text-gold-400">${m.monthly.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-[#A0A0C0]">${m.annual.toFixed(0)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function EvaluationPage() {
  return (
    <PageLayout tocItems={tocItems}>
      <div className="mb-10">
        <p className="section-label mb-2">Section 5</p>
        <h1 className="text-4xl font-black text-[#F0F0FF] mb-3">
          Model <span className="gradient-text">Evaluation</span>
        </h1>
        <p className="text-[#A0A0C0] text-base leading-relaxed max-w-2xl">
          Decision frameworks, benchmark guides, interactive algorithm selector, and cost calculators.
        </p>
      </div>

      {/* LLM Evaluation */}
      <section id="llm" className="mb-12">
        <SectionHeader label="5.1" title="LLM Evaluation Framework" description="How to evaluate and compare LLMs for your specific use case." />

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { dim: 'Accuracy', desc: 'Correct answers on domain-specific test cases you create', icon: '🎯' },
            { dim: 'Reasoning', desc: 'Multi-step problem solving (math, logic, policy interpretation)', icon: '🧠' },
            { dim: 'Instruction Following', desc: 'Does it output the exact format you need (JSON, markdown)?', icon: '📋' },
            { dim: 'Context Length', desc: 'Correctly use information from very long inputs', icon: '📏' },
            { dim: 'Safety/Alignment', desc: 'Appropriate refusals, no hallucinations on critical info', icon: '🛡️' },
            { dim: 'Cost-Performance', desc: 'Quality per dollar — often Gemini Flash wins here', icon: '💰' },
          ].map((d) => (
            <div key={d.dim} className="card-base p-4">
              <div className="text-2xl mb-2">{d.icon}</div>
              <h4 className="font-bold text-[#F0F0FF] text-sm mb-1">{d.dim}</h4>
              <p className="text-xs text-[#A0A0C0]">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benchmarks */}
      <section id="benchmarks" className="mb-12">
        <SectionHeader label="5.2" title="Key Benchmarks" description="Standard evaluations and what they actually measure." />

        <div className="overflow-x-auto rounded-xl border border-purple-900/30 mb-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-900/30 bg-purple-900/10">
                <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase">Benchmark</th>
                <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase">Measures</th>
                <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase">Questions</th>
                <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase">Limitations</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'MMLU', measures: 'Knowledge across 57 subjects', q: '14K', limit: 'Multiple choice only, no reasoning' },
                { name: 'HumanEval', measures: 'Python code generation', q: '164', limit: 'Small scale, outdated problems' },
                { name: 'GSM8K', measures: 'Grade school math', q: '8.5K', limit: 'Limited difficulty range' },
                { name: 'MATH', measures: 'Competition mathematics', q: '12.5K', limit: 'Narrow domain' },
                { name: 'HellaSwag', measures: 'Common sense reasoning', q: '70K', limit: 'Easy for modern models' },
                { name: 'BIG-Bench', measures: 'Diverse tasks', q: '204 tasks', limit: 'Too broad, varies widely' },
              ].map((row) => (
                <tr key={row.name} className="border-b border-[#1A1A35] hover:bg-purple-900/5">
                  <td className="px-4 py-3 font-semibold text-[#F0F0FF]">{row.name}</td>
                  <td className="px-4 py-3 text-xs text-[#A0A0C0]">{row.measures}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gold-400">{row.q}</td>
                  <td className="px-4 py-3 text-xs text-[#606080]">{row.limit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout type="warning" title="Benchmark Caveat">
          Public benchmarks are gamed. Models increasingly train on benchmark data (contamination). 
          The best evaluation is always a custom test set built from YOUR real tasks.
        </Callout>
      </section>

      {/* Algorithm Selector */}
      <section id="selector" className="mb-12">
        <SectionHeader label="5.3" title="Interactive Algorithm Selector" description="Answer questions about your problem and get a personalized algorithm recommendation." />
        <AlgorithmSelector />
      </section>

      {/* Cost Calculator */}
      <section id="calculator" className="mb-12">
        <SectionHeader label="5.4" title="Token Cost Calculator" description="Estimate API costs across different models based on your usage patterns." />
        <CostCalculator />
      </section>
    </PageLayout>
  );
}
