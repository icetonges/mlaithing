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
  try {
    const body = await req.json();
    const { messages, system, temperature = 0.7, max_tokens = 1000 } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Fallback response if no API key
      return NextResponse.json({
        content: `**API Key not configured.** To enable the AI assistant:\n\n1. Add \`ANTHROPIC_API_KEY\` to your \`.env.local\` file\n2. Get your key from [console.anthropic.com](https://console.anthropic.com)\n3. Restart the development server\n\nYou can also use the \`GOOGLE_GEMINI_API_KEY\` as an alternative.`,
      });
    }

    // Try Anthropic Claude first
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens,
        system: system || SYSTEM_PROMPT,
        messages: messages.slice(-20), // Keep last 20 messages for context
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API error');
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    return NextResponse.json({ content, model: 'claude-3-5-sonnet' });
  } catch (error: any) {
    console.error('Chat API error:', error);
    
    // Try Gemini fallback
    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const body2 = await req.json().catch(() => ({}));
        const { messages = [], system = '' } = body2;
        
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: messages.map((m: any) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
              })),
            }),
          }
        );

        const gemData = await geminiRes.json();
        const content = gemData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
        return NextResponse.json({ content, model: 'gemini-2.0-flash' });
      } catch (gemErr) {
        console.error('Gemini fallback error:', gemErr);
      }
    }

    return NextResponse.json(
      { content: `Error: ${error.message}. Please check your API configuration.` },
      { status: 200 }
    );
  }
}
