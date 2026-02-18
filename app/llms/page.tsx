import PageLayout from '@/components/layout/PageLayout';
import ComparisonTable from '@/components/ui/ComparisonTable';
import CodeBlock from '@/components/ui/CodeBlock';
import Callout from '@/components/ui/Callout';
import SectionHeader from '@/components/ui/SectionHeader';
import PromptPlayground from '@/components/features/PromptPlayground';

const tocItems = [
  { id: 'landscape', label: 'LLM Landscape', level: 2 },
  { id: 'comparison', label: 'Comparison Matrix', level: 3 },
  { id: 'claude', label: 'Claude API', level: 3 },
  { id: 'gemini', label: 'Gemini API', level: 3 },
  { id: 'gpt', label: 'GPT API', level: 3 },
  { id: 'prompting', label: 'Prompt Engineering', level: 2 },
  { id: 'agents', label: 'Agentic AI', level: 2 },
];

const claudeApiCode = `import anthropic

client = anthropic.Anthropic(api_key="your-key")

# Basic message
message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    system="You are a DoD financial analyst AI.",
    messages=[
        {"role": "user", "content": "Summarize FY2025 defense priorities"}
    ]
)
print(message.content[0].text)

# Tool use / Function calling
tools = [{
    "name": "search_budget_data",
    "description": "Search DoD budget database",
    "input_schema": {
        "type": "object",
        "properties": {
            "year": {"type": "integer", "description": "Fiscal year"},
            "service": {"type": "string", "description": "Military service branch"}
        },
        "required": ["year"]
    }
}]

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What was Army FY2024 budget?"}]
)`;

const geminiApiCode = `import { GoogleGenerativeAI } from '@google/genai';

const genai = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

// Function calling setup
const tools = [{
  functionDeclarations: [{
    name: "get_budget_data",
    description: "Retrieve DoD budget data",
    parameters: {
      type: "object",
      properties: {
        fiscal_year: { type: "string" },
        component: { type: "string" }
      }
    }
  }]
}];

async function runAgent(query: string) {
  const model = genai.getGenerativeModel({
    model: "gemini-2.0-flash",
    tools,
    systemInstruction: "You are a federal budget analyst AI."
  });

  const chat = model.startChat();
  const result = await chat.sendMessage(query);
  
  // Handle function calls
  const response = result.response;
  const parts = response.candidates?.[0]?.content?.parts || [];
  
  for (const part of parts) {
    if (part.functionCall) {
      console.log("Tool called:", part.functionCall.name);
      // Execute the function...
    }
  }
  
  return response.text();
}`;

const ragCode = `from anthropic import Anthropic
import numpy as np

# Simple RAG implementation
client = Anthropic()

def cosine_similarity(a: list, b: list) -> float:
    a, b = np.array(a), np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def simple_rag(query: str, documents: list[dict]) -> str:
    """
    Retrieval-Augmented Generation with Claude
    documents: [{"content": "...", "embedding": [...]}]
    """
    # 1. Embed the query (simplified - use real embedding API)
    # query_embedding = embed(query)
    
    # 2. Find most relevant docs
    context = "\\n\\n".join([
        f"[Source: {doc['source']}]\\n{doc['content']}"
        for doc in documents[:3]  # Top 3 relevant chunks
    ])
    
    # 3. Generate with context
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        system="""Answer questions using ONLY the provided context. 
        Cite sources when possible. If unsure, say so.""",
        messages=[{
            "role": "user",
            "content": f"Context:\\n{context}\\n\\nQuestion: {query}"
        }]
    )
    
    return response.content[0].text`;

const agentCode = `# Multi-Agent System (MyThing Platform Pattern)
from anthropic import Anthropic

client = Anthropic()

def route_query(query: str) -> str:
    """Determine which specialized agent to use"""
    routing = client.messages.create(
        model="claude-3-5-haiku-20241022",
        max_tokens=50,
        system="Classify the query. Respond with ONLY one word: portfolio, tech, dod, or notes",
        messages=[{"role": "user", "content": query}]
    )
    return routing.content[0].text.strip().lower()

AGENT_CONFIGS = {
    "portfolio": "You are a portfolio analyst for Peter Shang's projects...",
    "tech": "You are a tech trends analyst with expertise in AI/ML...",
    "dod": "You are a DoD policy and federal finance expert...",
    "notes": "You help retrieve and summarize personal notes...",
}

def run_agent(query: str) -> str:
    agent_type = route_query(query)
    system_prompt = AGENT_CONFIGS.get(agent_type, AGENT_CONFIGS["tech"])
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": query}]
    )
    
    return f"[{agent_type.upper()} Agent] {response.content[0].text}"

# Usage
print(run_agent("What AI projects has Peter built?"))  # → portfolio
print(run_agent("Latest trends in agentic AI?"))        # → tech
print(run_agent("Explain FIAR audit requirements"))     # → dod`;

export default function LLMsPage() {
  return (
    <PageLayout tocItems={tocItems}>
      <div className="mb-10">
        <p className="section-label mb-2">Section 2</p>
        <h1 className="text-4xl font-black text-[#F0F0FF] mb-3">
          LLMs & <span className="gradient-text">Generative AI</span>
        </h1>
        <p className="text-[#A0A0C0] text-base leading-relaxed max-w-2xl">
          Deep dive into the LLM landscape — model comparisons, API integration, prompt engineering mastery, and production agentic systems.
        </p>
      </div>

      {/* LLM Landscape */}
      <section id="landscape" className="mb-12">
        <SectionHeader
          label="2.1"
          title="LLM Landscape & Comparison"
          description="The major model families, their strengths, and when to use each."
        />

        {/* Comparison Table */}
        <div id="comparison">
          <h3 className="text-lg font-bold text-[#F0F0FF] mb-2">Interactive Comparison Matrix</h3>
          <ComparisonTable />
        </div>
      </section>

      {/* Claude API */}
      <section id="claude" className="mb-12">
        <SectionHeader
          label="2.2a"
          title="Anthropic Claude API"
          description="The preferred model for long-context tasks, safety-critical applications, and tool use. Powers this platform's AI assistant."
        />

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { model: 'claude-3-5-sonnet-20241022', tier: 'Best', context: '200K', cost: '$3/$15 per 1M', use: 'Production workloads' },
            { model: 'claude-3-5-haiku-20241022', tier: 'Fast', context: '200K', cost: '$0.80/$4 per 1M', use: 'High-volume, routing' },
            { model: 'claude-3-opus-20240229', tier: 'Power', context: '200K', cost: '$15/$75 per 1M', use: 'Complex reasoning' },
          ].map((m) => (
            <div key={m.model} className="card-base p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="badge bg-purple-900/30 text-purple-400 text-[9px]">{m.tier}</span>
                <span className="text-[10px] text-[#606080] font-mono">{m.context} ctx</span>
              </div>
              <p className="text-xs font-mono text-[#F0F0FF] mb-1">{m.model}</p>
              <p className="text-[10px] text-gold-400 font-mono mb-1">{m.cost}</p>
              <p className="text-[10px] text-[#606080]">{m.use}</p>
            </div>
          ))}
        </div>

        <CodeBlock code={claudeApiCode} language="python" filename="claude_api.py" />

        <Callout type="tip" title="Why Claude for This Platform">
          Claude's 200K token context window is ideal for analyzing long federal documents (NDAA, OMB Circulars).
          Constitutional AI training makes it particularly reliable for sensitive DoD policy questions.
        </Callout>
      </section>

      {/* Gemini API */}
      <section id="gemini" className="mb-12">
        <SectionHeader
          label="2.2b"
          title="Google Gemini API"
          description="Powers the MyThing platform agentic AI assistant with Google Search grounding and function calling."
        />

        <CodeBlock code={geminiApiCode} language="typescript" filename="gemini_agent.ts" />
      </section>

      {/* Prompt Engineering */}
      <section id="prompting" className="mb-12">
        <SectionHeader
          label="2.3"
          title="Prompt Engineering Mastery"
          description="Production-tested techniques for getting the best results from LLMs."
        />

        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { technique: 'Zero-Shot', desc: 'No examples — direct instruction. Works well with capable models.', emoji: '🎯', example: '"Classify this document as UNCLASSIFIED, CUI, or SECRET."' },
            { technique: 'Few-Shot', desc: 'Provide 2-5 examples before the task. Dramatically improves accuracy.', emoji: '📋', example: '"Example 1: X → Y. Example 2: A → B. Now classify: C → ?"' },
            { technique: 'Chain-of-Thought', desc: 'Ask the model to reason step-by-step before answering.', emoji: '🧠', example: '"Think step by step about the budget implications..."' },
            { technique: 'System Prompts', desc: 'Set role, constraints, output format at the system level.', emoji: '⚙️', example: '"You are a DoD analyst. Always cite FM references. Output JSON."' },
            { technique: 'Tree of Thoughts', desc: 'Explore multiple reasoning paths, select the best.', emoji: '🌳', example: 'Generate 3 approaches, evaluate each, pick the optimal.' },
            { technique: 'Structured Output', desc: 'Force JSON/XML output for programmatic processing.', emoji: '📊', example: '"Respond ONLY in JSON: {\"risk_level\": ..., \"factors\": [...]}"' },
          ].map((t) => (
            <div key={t.technique} className="card-base p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{t.emoji}</span>
                <h4 className="font-bold text-[#F0F0FF] text-sm">{t.technique}</h4>
              </div>
              <p className="text-xs text-[#A0A0C0] mb-3">{t.desc}</p>
              <code className="text-[10px] text-gold-400 font-mono bg-[#0A0A0F] p-2 rounded block leading-relaxed">
                {t.example}
              </code>
            </div>
          ))}
        </div>

        {/* Prompt Playground */}
        <div id="playground">
          <h3 className="text-lg font-bold text-[#F0F0FF] mb-4">Interactive Prompt Playground</h3>
          <PromptPlayground />
        </div>
      </section>

      {/* Agentic AI */}
      <section id="agents" className="mb-12">
        <SectionHeader
          label="2.4"
          title="Agentic AI Systems"
          description="Building multi-agent systems with tool use, routing, and orchestration — based on the MyThing platform implementation."
        />

        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { pattern: 'ReAct Agent', desc: 'Reason → Act → Observe loop. Tool use + reasoning interleaved.', icon: '🔄' },
            { pattern: 'Plan & Execute', desc: 'Generate a full plan first, then execute each step.', icon: '📋' },
            { pattern: 'Multi-Agent Router', desc: 'Classify query → route to specialized agent. (MyThing pattern)', icon: '🗺️' },
            { pattern: 'Reflexive Agent', desc: 'Self-critique and revise before final output.', icon: '🪞' },
          ].map((p) => (
            <div key={p.pattern} className="card-base p-4">
              <div className="text-2xl mb-2">{p.icon}</div>
              <h4 className="font-bold text-[#F0F0FF] text-sm mb-1">{p.pattern}</h4>
              <p className="text-xs text-[#A0A0C0]">{p.desc}</p>
            </div>
          ))}
        </div>

        <h4 className="text-base font-bold text-[#F0F0FF] mb-3">Case Study: MyThing Platform Agent Architecture</h4>
        <CodeBlock code={agentCode} language="python" filename="multi_agent.py" />

        <Callout type="success" title="Production Implementation">
          This multi-agent pattern is live at shangthing.vercel.app — routing between Portfolio, Tech Trends, DoD Policy, and Notes agents using Gemini 2.5 with Google Search grounding.
        </Callout>

        <div className="mt-6">
          <h4 className="text-base font-bold text-[#F0F0FF] mb-3">RAG (Retrieval-Augmented Generation)</h4>
          <CodeBlock code={ragCode} language="python" filename="rag.py" />
        </div>
      </section>
    </PageLayout>
  );
}
