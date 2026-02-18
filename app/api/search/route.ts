import { NextRequest, NextResponse } from 'next/server';

const searchIndex = [
  { id: 'linear-regression', title: 'Linear Regression', section: 'Fundamentals', href: '/fundamentals#linear-regression', content: 'supervised learning regression algorithm gradient descent least squares' },
  { id: 'random-forest', title: 'Random Forest', section: 'Fundamentals', href: '/fundamentals#random-forest', content: 'ensemble decision trees classification bagging feature importance' },
  { id: 'transformers', title: 'Transformers Architecture', section: 'Fundamentals', href: '/fundamentals#transformers', content: 'attention mechanism self-attention multi-head BERT GPT encoder decoder' },
  { id: 'gpt', title: 'GPT Series', section: 'LLMs', href: '/llms#gpt', content: 'openai gpt-4 gpt-4o language model API function calling vision' },
  { id: 'claude', title: 'Claude API', section: 'LLMs', href: '/llms#claude', content: 'anthropic claude sonnet haiku opus messages API tool use computer use' },
  { id: 'gemini', title: 'Gemini API', section: 'LLMs', href: '/llms#gemini', content: 'google gemini flash pro multimodal function calling 1M context grounding' },
  { id: 'prompt-engineering', title: 'Prompt Engineering', section: 'LLMs', href: '/llms#prompting', content: 'zero-shot few-shot chain-of-thought system prompts temperature structured output' },
  { id: 'rag', title: 'RAG Systems', section: 'Advanced', href: '/advanced#rag', content: 'retrieval augmented generation vector database embedding semantic search' },
  { id: 'langchain', title: 'LangChain', section: 'Toolkit', href: '/toolkit#langchain', content: 'llm framework chain agents tools memory output parsers' },
  { id: 'budget-forecast', title: 'DoD Budget Forecasting', section: 'Applied', href: '/applied#budget', content: 'federal finance XGBoost time series appropriations OMB DoD Pentagon' },
];

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.toLowerCase() || '';

  if (!query) {
    return NextResponse.json({ results: searchIndex.slice(0, 5) });
  }

  const results = searchIndex.filter((item) => {
    const searchable = `${item.title} ${item.section} ${item.content}`.toLowerCase();
    return searchable.includes(query);
  });

  return NextResponse.json({ results });
}
