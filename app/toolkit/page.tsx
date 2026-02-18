import PageLayout from '@/components/layout/PageLayout';
import CodeBlock from '@/components/ui/CodeBlock';
import Callout from '@/components/ui/Callout';
import SectionHeader from '@/components/ui/SectionHeader';

const tocItems = [
  { id: 'openai', label: 'OpenAI API', level: 2 },
  { id: 'anthropic', label: 'Anthropic API', level: 2 },
  { id: 'gemini', label: 'Gemini API', level: 2 },
  { id: 'sklearn', label: 'scikit-learn', level: 2 },
  { id: 'langchain', label: 'LangChain', level: 2 },
  { id: 'vectordb', label: 'Vector Databases', level: 2 },
  { id: 'snippets', label: 'Code Snippets', level: 2 },
];

const openaiCode = `from openai import OpenAI

client = OpenAI(api_key="your-key")

# Chat completion with function calling
tools = [{
    "type": "function",
    "function": {
        "name": "search_database",
        "description": "Search the DoD financial database",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {"type": "string"},
                "fiscal_year": {"type": "integer"}
            },
            "required": ["query"]
        }
    }
}]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Find FY2025 Army modernization data"}],
    tools=tools,
    tool_choice="auto",
    temperature=0.3
)

# Streaming
with client.chat.completions.stream(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Explain RAG in 3 sentences"}]
) as stream:
    for chunk in stream.text_stream:
        print(chunk, end="", flush=True)`;

const sklearnPipelineCode = `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import GridSearchCV
import joblib

# Production ML Pipeline
numeric_features = ['transaction_amount', 'days_outstanding', 'obligation_rate']
categorical_features = ['appropriation_type', 'vendor_category', 'service_branch']

numeric_transformer = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler()),
])

preprocessor = ColumnTransformer([
    ('num', numeric_transformer, numeric_features),
    ('cat', SimpleImputer(strategy='most_frequent'), categorical_features),
])

pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('classifier', GradientBoostingClassifier(random_state=42))
])

# Hyperparameter tuning
param_grid = {
    'classifier__n_estimators': [100, 200],
    'classifier__max_depth': [3, 5, 7],
    'classifier__learning_rate': [0.05, 0.1, 0.2],
}

search = GridSearchCV(pipeline, param_grid, cv=5, scoring='f1', n_jobs=-1)
search.fit(X_train, y_train)

print(f"Best params: {search.best_params_}")
print(f"Best F1: {search.best_score_:.4f}")

# Save the model
joblib.dump(search.best_estimator_, 'audit_risk_model_v1.pkl')`;

const vectordbCode = `# Chroma (local) - great for development
import chromadb
from chromadb.utils import embedding_functions

# Initialize local DB
client = chromadb.PersistentClient(path="./chroma_db")

# Use OpenAI or custom embeddings
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key="your-key",
    model_name="text-embedding-3-small"
)

collection = client.get_or_create_collection(
    name="policy_documents",
    embedding_function=openai_ef
)

# Add documents
collection.add(
    documents=["OMB Circular A-11 requires budget justification...",
               "FIAR requires detailed transaction-level data..."],
    metadatas=[{"source": "OMB A-11", "year": 2024},
               {"source": "FIAR", "year": 2024}],
    ids=["omb-a11-001", "fiar-001"]
)

# Semantic search
results = collection.query(
    query_texts=["budget submission requirements"],
    n_results=3
)

for doc, meta in zip(results['documents'][0], results['metadatas'][0]):
    print(f"[{meta['source']}] {doc[:100]}...")`;

const streamingCode = `# Streaming responses for better UX
from anthropic import Anthropic

client = Anthropic()

async def stream_analysis(document: str):
    """Stream AI analysis with real-time output"""
    with client.messages.stream(
        model="claude-3-5-sonnet-20241022",
        max_tokens=2000,
        messages=[{
            "role": "user",
            "content": f"Analyze this document: {document}"
        }]
    ) as stream:
        for text in stream.text_stream:
            yield text  # Send to frontend via SSE

# FastAPI streaming endpoint
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

app = FastAPI()

@app.post("/analyze-stream")
async def analyze_stream(request: dict):
    async def generate():
        async for chunk in stream_analysis(request["document"]):
            yield f"data: {chunk}\\n\\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")`;

export default function ToolkitPage() {
  return (
    <PageLayout tocItems={tocItems}>
      <div className="mb-10">
        <p className="section-label mb-2">Section 4</p>
        <h1 className="text-4xl font-black text-[#F0F0FF] mb-3">
          Developer <span className="gradient-text">Toolkit</span>
        </h1>
        <p className="text-[#A0A0C0] text-base leading-relaxed max-w-2xl">
          Production-ready API guides, library references, and copy-paste code snippets for shipping AI/ML applications.
        </p>
      </div>

      {/* OpenAI */}
      <section id="openai" className="mb-12">
        <SectionHeader label="4.1" title="OpenAI API" description="GPT-4o integration with function calling and streaming." />
        <CodeBlock code={openaiCode} language="python" filename="openai_integration.py" />
      </section>

      {/* scikit-learn */}
      <section id="sklearn" className="mb-12">
        <SectionHeader label="4.2" title="scikit-learn Production Pipeline" description="End-to-end ML pipeline with preprocessing, cross-validation, and model persistence." />
        <CodeBlock code={sklearnPipelineCode} language="python" filename="ml_pipeline.py" />
        <Callout type="tip" title="Production Tip">
          Always use Pipeline to prevent data leakage during cross-validation. 
          The preprocessor should be fit only on training data — Pipeline handles this automatically.
        </Callout>
      </section>

      {/* LangChain */}
      <section id="langchain" className="mb-12">
        <SectionHeader label="4.3" title="LangChain Guide" description="Framework for building LLM-powered applications with chains, agents, and memory." />

        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { name: 'LangChain', desc: 'Most mature, extensive integrations, large community. Best for complex chains.', badge: 'Popular', badgeStyle: 'bg-blue-900/30 text-blue-400' },
            { name: 'LlamaIndex', desc: 'Optimized for RAG and document indexing. Better structured data handling.', badge: 'RAG-first', badgeStyle: 'bg-green-900/30 text-green-400' },
            { name: 'AutoGen', desc: 'Multi-agent conversations. Microsoft\'s framework for agent orchestration.', badge: 'Agents', badgeStyle: 'bg-purple-900/30 text-purple-400' },
          ].map((f) => (
            <div key={f.name} className="card-base p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-[#F0F0FF]">{f.name}</span>
                <span className={`badge ${f.badgeStyle} text-[9px]`}>{f.badge}</span>
              </div>
              <p className="text-xs text-[#A0A0C0]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vector DBs */}
      <section id="vectordb" className="mb-12">
        <SectionHeader label="4.4" title="Vector Databases" description="Semantic search infrastructure for RAG systems." />

        <div className="overflow-x-auto rounded-xl border border-purple-900/30 mb-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-900/30 bg-purple-900/10">
                <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider">DB</th>
                <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider">Scale</th>
                <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider">Best For</th>
                <th className="text-left px-4 py-3 text-xs text-purple-400 font-mono uppercase tracking-wider">Cost</th>
              </tr>
            </thead>
            <tbody>
              {[
                { db: 'Chroma', type: 'Local/Cloud', scale: 'Small-Med', use: 'Development, prototypes', cost: 'Free' },
                { db: 'Pinecone', type: 'Managed', scale: 'Large', use: 'Production, real-time', cost: 'Paid' },
                { db: 'Weaviate', type: 'Self/Cloud', scale: 'Large', use: 'GraphQL + vectors', cost: 'Open source' },
                { db: 'pgvector', type: 'PostgreSQL', scale: 'Med-Large', use: 'Existing Postgres users', cost: 'Free' },
                { db: 'Qdrant', type: 'Self/Cloud', scale: 'Large', use: 'High performance Rust', cost: 'Open source' },
              ].map((row) => (
                <tr key={row.db} className="border-b border-[#1A1A35] hover:bg-purple-900/5">
                  <td className="px-4 py-3 font-semibold text-[#F0F0FF]">{row.db}</td>
                  <td className="px-4 py-3 text-xs text-[#A0A0C0]">{row.type}</td>
                  <td className="px-4 py-3 text-xs text-[#A0A0C0]">{row.scale}</td>
                  <td className="px-4 py-3 text-xs text-[#A0A0C0]">{row.use}</td>
                  <td className="px-4 py-3 text-xs text-green-400">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CodeBlock code={vectordbCode} language="python" filename="vectordb_chroma.py" />
      </section>

      {/* Snippets */}
      <section id="snippets" className="mb-12">
        <SectionHeader label="4.5" title="Production Code Snippets" description="Copy-paste ready patterns for common ML engineering tasks." />
        <CodeBlock code={streamingCode} language="python" filename="streaming_api.py" />
      </section>
    </PageLayout>
  );
}
