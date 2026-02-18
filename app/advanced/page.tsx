import PageLayout from '@/components/layout/PageLayout';
import CodeBlock from '@/components/ui/CodeBlock';
import Callout from '@/components/ui/Callout';
import SectionHeader from '@/components/ui/SectionHeader';

const tocItems = [
  { id: 'landscape', label: '2026 AI Landscape', level: 2 },
  { id: 'rag', label: 'RAG Systems', level: 2 },
  { id: 'finetune', label: 'Fine-Tuning / LoRA', level: 2 },
  { id: 'rlhf', label: 'RLHF', level: 2 },
  { id: 'moe', label: 'Mixture of Experts', level: 2 },
  { id: 'papers', label: 'Notable Papers', level: 2 },
];

const loraCode = `# LoRA Fine-Tuning with Hugging Face + PEFT
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model, TaskType
from trl import SFTTrainer
import torch

# Load base model (4-bit quantized for efficiency)
model_name = "meta-llama/Llama-3.2-3B-Instruct"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    load_in_4bit=True,  # QLoRA - saves ~75% memory
    torch_dtype=torch.float16,
    device_map="auto"
)

# LoRA configuration
lora_config = LoraConfig(
    r=16,                    # Rank — higher = more parameters, better quality
    lora_alpha=32,           # Scaling factor
    target_modules=[         # Modules to apply LoRA to
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj"
    ],
    lora_dropout=0.05,
    bias="none",
    task_type=TaskType.CAUSAL_LM
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# trainable params: 3,670,016 || all params: 3,212,749,824
# trainable%: 0.1142% ← Only 0.1% of params trained!

# Training
trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,  # Your custom dataset
    args=TrainingArguments(
        output_dir="./fine-tuned-llama",
        num_train_epochs=3,
        per_device_train_batch_size=4,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        fp16=True,
        logging_steps=10,
        save_strategy="epoch",
    ),
    dataset_text_field="text",
    max_seq_length=2048,
)

trainer.train()
model.save_pretrained("./dod-financial-llama")`;

const ragAdvancedCode = `# Advanced RAG with Hybrid Search + Reranking
from anthropic import Anthropic
import chromadb
from chromadb.utils import embedding_functions

client = Anthropic()

class AdvancedRAG:
    def __init__(self, collection_name: str = "policy_docs"):
        self.chroma = chromadb.PersistentClient("./rag_db")
        self.ef = embedding_functions.OpenAIEmbeddingFunction(
            api_key="your-key",
            model_name="text-embedding-3-small"
        )
        self.collection = self.chroma.get_or_create_collection(
            collection_name, embedding_function=self.ef
        )
        self.anthropic = Anthropic()
    
    def add_documents(self, docs: list[dict]):
        """Add documents with metadata"""
        self.collection.add(
            documents=[d["content"] for d in docs],
            metadatas=[d["metadata"] for d in docs],
            ids=[d["id"] for d in docs]
        )
    
    def query_with_reranking(self, query: str, k: int = 5) -> str:
        # Step 1: Initial retrieval
        results = self.collection.query(
            query_texts=[query],
            n_results=k * 2  # Over-retrieve then rerank
        )
        
        docs = results["documents"][0]
        metas = results["metadatas"][0]
        
        # Step 2: LLM Reranking
        rerank_response = self.anthropic.messages.create(
            model="claude-3-5-haiku-20241022",
            max_tokens=500,
            messages=[{
                "role": "user",
                "content": f"""Given this query: "{query}"
Rank these {len(docs)} documents by relevance (1=most relevant).
Return ONLY a JSON array of indices: [3, 0, 2, 1, ...]
Documents:
{chr(10).join(f'{i}: {d[:200]}' for i, d in enumerate(docs))}"""
            }]
        )
        
        import json, re
        ranking_text = rerank_response.content[0].text
        idx_match = re.search(r'\\[.*?\\]', ranking_text, re.DOTALL)
        indices = json.loads(idx_match.group()) if idx_match else list(range(k))
        
        # Step 3: Generate with top-ranked context
        top_docs = [docs[i] for i in indices[:k] if i < len(docs)]
        context = "\\n\\n---\\n\\n".join([
            f"[Source: {metas[i].get('source', 'Unknown')}]\\n{docs[i]}"
            for i in indices[:k] if i < len(docs)
        ])
        
        response = self.anthropic.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1500,
            system="Answer based ONLY on provided context. Cite sources.",
            messages=[{"role": "user", "content": f"Context:\\n{context}\\n\\nQuery: {query}"}]
        )
        
        return response.content[0].text

# Usage
rag = AdvancedRAG()
answer = rag.query_with_reranking("What are FY2025 audit requirements?")`;

export default function AdvancedPage() {
  return (
    <PageLayout tocItems={tocItems}>
      <div className="mb-10">
        <p className="section-label mb-2">Section 6</p>
        <h1 className="text-4xl font-black text-[#F0F0FF] mb-3">
          Advanced <span className="gradient-text">Topics & Research</span>
        </h1>
        <p className="text-[#A0A0C0] text-base leading-relaxed max-w-2xl">
          Cutting-edge 2026 AI landscape, RAG systems, fine-tuning, RLHF, and the research papers that matter.
        </p>
      </div>

      {/* 2026 Landscape */}
      <section id="landscape" className="mb-12">
        <SectionHeader label="6.1" title="2026 AI Landscape" description="The major trends shaping AI/ML right now." />

        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            {
              trend: 'Agentic AI Revolution',
              icon: '🤖',
              desc: 'Models that plan, use tools, and take actions over multiple steps. From basic chatbots to autonomous AI workers.',
              impact: 'Critical',
              impactStyle: 'bg-red-900/30 text-red-400',
            },
            {
              trend: 'Multi-Million Token Contexts',
              icon: '📚',
              desc: 'Gemini 2.5 Pro at 2M tokens means entire codebases, years of documents, or entire books fit in context.',
              impact: 'High',
              impactStyle: 'bg-orange-900/30 text-orange-400',
            },
            {
              trend: 'Reasoning Models (o1/o3)',
              icon: '🧠',
              desc: 'Models that spend compute tokens thinking before answering. Dramatically better on math and logic.',
              impact: 'High',
              impactStyle: 'bg-orange-900/30 text-orange-400',
            },
            {
              trend: 'On-Device / Edge AI',
              icon: '📱',
              desc: 'Phi-4, Gemma, Llama running on device. Privacy-preserving, offline-capable, no API costs.',
              impact: 'Growing',
              impactStyle: 'bg-yellow-900/30 text-yellow-400',
            },
            {
              trend: 'Multimodal Everything',
              icon: '🎭',
              desc: 'Text + Images + Audio + Video as native inputs. GPT-4o, Gemini 2.0 Flash as examples.',
              impact: 'High',
              impactStyle: 'bg-orange-900/30 text-orange-400',
            },
            {
              trend: 'AI Governance & Policy',
              icon: '🏛️',
              desc: 'Executive orders, EU AI Act, DoD AI policies. Compliance becoming essential for federal AI.',
              impact: 'Critical for DoD',
              impactStyle: 'bg-purple-900/30 text-purple-400',
            },
          ].map((t) => (
            <div key={t.trend} className="card-base p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{t.icon}</span>
                  <h4 className="font-bold text-[#F0F0FF] text-sm">{t.trend}</h4>
                </div>
                <span className={`badge ${t.impactStyle} border border-current/20 text-[9px] shrink-0`}>{t.impact}</span>
              </div>
              <p className="text-xs text-[#A0A0C0] leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RAG */}
      <section id="rag" className="mb-12">
        <SectionHeader label="6.2" title="Advanced RAG Systems" description="Production-grade retrieval-augmented generation with hybrid search and reranking." />
        <CodeBlock code={ragAdvancedCode} language="python" filename="advanced_rag.py" />
        <Callout type="tip" title="When to Use RAG vs Fine-Tuning">
          Use RAG when: data changes frequently, you need source attribution, domain knowledge is large.
          Use fine-tuning when: you need a specific style/format, the task is narrow and stable, latency matters.
        </Callout>
      </section>

      {/* Fine-Tuning */}
      <section id="finetune" className="mb-12">
        <SectionHeader label="6.3" title="Fine-Tuning with LoRA / QLoRA" description="Parameter-efficient fine-tuning that trains only 0.1% of model parameters while achieving near-full fine-tune performance." />

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { method: 'Full Fine-Tune', params: '100%', memory: '~160GB', use: 'When resources allow' },
            { method: 'LoRA', params: '~1%', memory: '~40GB', use: 'Standard adaptation' },
            { method: 'QLoRA', params: '~0.1%', memory: '~10GB', use: 'Consumer GPU fine-tuning' },
          ].map((m) => (
            <div key={m.method} className="card-base p-4 text-center">
              <h4 className="font-bold text-[#F0F0FF] mb-3">{m.method}</h4>
              <div className="text-3xl font-black gradient-text-purple mb-1">{m.params}</div>
              <p className="text-[10px] text-[#606080] mb-2">trainable params</p>
              <p className="text-xs text-gold-400 font-mono mb-1">{m.memory} VRAM</p>
              <p className="text-[10px] text-[#606080]">{m.use}</p>
            </div>
          ))}
        </div>

        <CodeBlock code={loraCode} language="python" filename="lora_finetune.py" />
      </section>

      {/* RLHF */}
      <section id="rlhf" className="mb-12">
        <SectionHeader label="6.4" title="RLHF & Constitutional AI" description="How modern LLMs are aligned to be helpful, harmless, and honest." />

        <div className="grid grid-cols-2 gap-4 mb-5">
          {[
            {
              title: 'RLHF Process',
              steps: [
                '1. Pre-train on massive text corpus',
                '2. Supervised fine-tuning (SFT) on demonstrations',
                '3. Train reward model from human preferences',
                '4. RL (PPO) to maximize reward model score',
              ],
              icon: '🔄',
            },
            {
              title: 'Constitutional AI (Anthropic)',
              steps: [
                '1. Generate outputs from a model',
                '2. Use AI (not humans) to critique using a "constitution"',
                '3. Revise based on AI critique',
                '4. Train on revised outputs (RLAIF)',
              ],
              icon: '📜',
            },
          ].map((item) => (
            <div key={item.title} className="card-base p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{item.icon}</span>
                <h4 className="font-bold text-[#F0F0FF]">{item.title}</h4>
              </div>
              <ol className="space-y-2">
                {item.steps.map((step, i) => (
                  <li key={i} className="text-xs text-[#A0A0C0] flex items-start gap-2">
                    <span className="text-purple-400 shrink-0 font-mono">{step.split('.')[0]}.</span>
                    <span>{step.split('.').slice(1).join('.').trim()}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Notable Papers */}
      <section id="papers" className="mb-12">
        <SectionHeader label="6.5" title="Notable Papers" description="The research papers that changed everything." />

        <div className="space-y-3">
          {[
            { year: '2017', title: 'Attention Is All You Need', authors: 'Vaswani et al.', impact: 'Invented the transformer. The foundation of every modern LLM.', tag: 'Foundational' },
            { year: '2018', title: 'BERT: Pre-training of Deep Bidirectional Transformers', authors: 'Devlin et al.', impact: 'Transfer learning for NLP. Showed pre-training + fine-tuning dominance.', tag: 'NLP Revolution' },
            { year: '2020', title: 'Language Models are Few-Shot Learners (GPT-3)', authors: 'Brown et al.', impact: 'Demonstrated emergent capabilities at scale. Kick-started the LLM era.', tag: 'GPT-3' },
            { year: '2022', title: 'Chain-of-Thought Prompting Elicits Reasoning', authors: 'Wei et al.', impact: 'CoT prompting unlocks step-by-step reasoning. Now standard practice.', tag: 'Prompting' },
            { year: '2022', title: 'Training Language Models to Follow Instructions (InstructGPT)', authors: 'Ouyang et al.', impact: 'RLHF for instruction following. Led directly to ChatGPT.', tag: 'Alignment' },
            { year: '2023', title: 'LoRA: Low-Rank Adaptation of Large Language Models', authors: 'Hu et al.', impact: 'Parameter-efficient fine-tuning. Made fine-tuning accessible to everyone.', tag: 'Fine-Tuning' },
          ].map((paper) => (
            <div key={paper.title} className="card-base p-4 flex items-start gap-4">
              <div className="text-center shrink-0">
                <div className="text-xl font-black text-purple-400 font-mono">{paper.year}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-bold text-[#F0F0FF] text-sm">{paper.title}</h4>
                  <span className="badge bg-purple-900/30 text-purple-400 text-[9px] shrink-0">{paper.tag}</span>
                </div>
                <p className="text-[10px] text-[#606080] mb-1.5 font-mono">{paper.authors}</p>
                <p className="text-xs text-[#A0A0C0]">{paper.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
