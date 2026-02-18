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
  // ✅ Read body ONCE - req.json() is a one-time stream; calling it twice always fails
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ content: 'Invalid request body.' }, { status: 400 });
  }

  const { messages = [], system, temperature = 0.7, max_tokens = 1000 } = body;

  // ── Attempt 1: Anthropic Claude ──────────────────────────────────────────
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens,
          system: system || SYSTEM_PROMPT,
          messages: messages.slice(-20),
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Anthropic HTTP ${response.status}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text ?? '';
      return NextResponse.json({ content, model: 'claude-3-5-sonnet' });
    } catch (err: any) {
      console.error('[Claude] error:', err.message);
      // fall through to Gemini
    }
  }

  // ── Attempt 2: Google Gemini fallback ────────────────────────────────────
  const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system || SYSTEM_PROMPT }] },
            contents: messages.map((m: any) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }],
            })),
            generationConfig: { maxOutputTokens: max_tokens, temperature },
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
      console.error('[Gemini] error:', err.message);
    }
  }

  // ── No API keys configured ────────────────────────────────────────────────
  return NextResponse.json({
    content: [
      '**⚠️ AI Assistant not configured yet.**',
      '',
      'Add at least one of these to your `.env.local` and restart the server:',
      '',
      '```',
      'ANTHROPIC_API_KEY=sk-ant-api03-...',
      'GOOGLE_GEMINI_API_KEY=AIzaSy...',
      '```',
      '',
      'See the README for step-by-step setup instructions.',
    ].join('\n'),
  });
}
