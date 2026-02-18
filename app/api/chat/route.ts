import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an expert AI/ML knowledge assistant for Peter Shang's AI/ML Knowledge Hub.
You specialize in:
- Machine learning algorithms (supervised, unsupervised, reinforcement learning)
- Deep learning and neural networks
- Large Language Models (GPT, Claude, Gemini, Llama)
- Prompt engineering and agentic AI systems
- Python ML libraries (scikit-learn, PyTorch, TensorFlow, XGBoost)
- Federal finance and DoD applications of AI/ML
- Production deployment of ML systems

Provide concise, accurate, technically precise answers. Use code examples when helpful.
Format responses in markdown when appropriate. Be direct and practical.`;

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ content: 'Invalid request body.' }, { status: 400 });
  }

  const { messages = [], system, temperature = 0.7, max_tokens = 1000 } = body;
  const systemPrompt = system || SYSTEM_PROMPT;

  // ── 1st: Google Gemini (FREE — always try first) ─────────────────────────
  const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: messages.map((m: any) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }],
            })),
            generationConfig: {
              maxOutputTokens: max_tokens,
              temperature,
            },
          }),
        }
      );

      if (!geminiRes.ok) {
        const err = await geminiRes.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Gemini HTTP ${geminiRes.status}`);
      }

      const gemData = await geminiRes.json();
      const content =
        gemData.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response generated.';
      return NextResponse.json({ content, model: 'gemini-2.0-flash' });
    } catch (err: any) {
      console.error('[Gemini] error — falling back to Claude:', err.message);
    }
  }

  // ── 2nd: Anthropic Claude (fallback) ─────────────────────────────────────
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens,
          system: systemPrompt,
          messages: messages.slice(-20),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Anthropic HTTP ${res.status}`);
      }

      const data = await res.json();
      const content = data.content?.[0]?.text ?? '';
      return NextResponse.json({ content, model: 'claude-3-5-sonnet' });
    } catch (err: any) {
      console.error('[Claude] error:', err.message);
    }
  }

  // ── 3rd: OpenAI (last resort) ────────────────────────────────────────────
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_tokens,
          temperature,
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.slice(-20),
          ],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `OpenAI HTTP ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content ?? '';
      return NextResponse.json({ content, model: 'gpt-4o-mini' });
    } catch (err: any) {
      console.error('[OpenAI] error:', err.message);
    }
  }

  // ── No keys configured ───────────────────────────────────────────────────
  return NextResponse.json({
    content: [
      '**⚠️ No AI provider configured.**',
      '',
      'Add to your `.env.local` (free option first):',
      '',
      '```env',
      '# FREE — get at aistudio.google.com',
      'GOOGLE_GEMINI_API_KEY=AIzaSy...',
      '',
      '# Paid fallback — get at console.anthropic.com',
      'ANTHROPIC_API_KEY=sk-ant-api03-...',
      '```',
      '',
      'Then restart the server: `npm run dev`',
    ].join('\n'),
  });
}
