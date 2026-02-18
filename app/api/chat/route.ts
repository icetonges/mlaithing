import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';

const SYSTEM_PROMPT = `You are an expert AI/ML knowledge assistant for Peter Shang's AI/ML Knowledge Hub.
You specialize in machine learning algorithms, deep learning, LLMs (GPT, Claude, Gemini),
prompt engineering, agentic AI, Python ML libraries, federal finance/DoD AI applications,
and production ML deployment. Be concise, accurate, and practical. Use markdown and code examples when helpful.`;

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ content: 'Invalid request body.' }, { status: 400 });
  }

  const { messages = [], system, temperature = 0.7, max_tokens = 1000 } = body;
  const systemPrompt = system || SYSTEM_PROMPT;

  // ── 1st: Gemini 2.5 Flash → 2.5 Flash Lite (FREE, same as shangthing) ────
  if (process.env.GOOGLE_GEMINI_API_KEY) {
    try {
      const { content, model } = await callGemini(messages, systemPrompt, {
        maxOutputTokens: max_tokens,
        temperature,
      });
      return NextResponse.json({ content, model });
    } catch (err: any) {
      console.error('[Gemini] all models failed:', err.message);
    }
  }

  // ── 2nd: Anthropic Claude (paid fallback) ────────────────────────────────
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens,
          system: systemPrompt,
          messages: messages.filter((m: any) => m?.content?.trim()).slice(-20),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? `HTTP ${res.status}`);
      const content = data?.content?.[0]?.text;
      if (!content) throw new Error('Empty response');
      return NextResponse.json({ content, model: 'claude-3-5-sonnet' });
    } catch (err: any) {
      console.error('[Claude] failed:', err.message);
    }
  }

  // ── 3rd: OpenAI (last resort) ────────────────────────────────────────────
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens,
          temperature,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.filter((m: any) => m?.content?.trim()).slice(-20),
          ],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message ?? `HTTP ${res.status}`);
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error('Empty response');
      return NextResponse.json({ content, model: 'gpt-4o-mini' });
    } catch (err: any) {
      console.error('[OpenAI] failed:', err.message);
    }
  }

  return NextResponse.json({
    content:
      '**No AI provider available.**\n\n' +
      '- **Gemini** (free): Add `GOOGLE_GEMINI_API_KEY` to `.env.local`\n' +
      '- **Claude**: Add `ANTHROPIC_API_KEY` to `.env.local`',
  });
}
