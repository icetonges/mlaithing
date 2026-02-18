import { NextResponse } from 'next/server';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';

const mask = (k: string) =>
  k?.length > 12 ? `${k.slice(0, 8)}...${k.slice(-4)} (${k.length} chars)` : k ? '(too short)' : 'NOT SET';

export async function GET() {
  const geminiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  const anthropicKey = process.env.ANTHROPIC_API_KEY ?? '';

  // ── Test Gemini with exact same API as lib/gemini.ts ─────────────────────
  let geminiResult: any = { skipped: 'GOOGLE_GEMINI_API_KEY not set' };
  if (geminiKey) {
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    for (const model of ['gemini-2.5-flash', 'gemini-2.5-flash-lite']) {
      try {
        // ✅ Using ai.models.generateContent() — correct new SDK
        const response = await ai.models.generateContent({
          model,
          contents: 'Reply with exactly the word: OK',
          config: {
            maxOutputTokens: 10,
            temperature: 0,
            safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
            ],
          },
        });
        const text = response.text; // ✅ property not function
        geminiResult = { ok: true, model, reply: text?.trim() };
        break;
      } catch (err: any) {
        geminiResult = { ok: false, model, error: err.message };
        if (err.message?.includes('429') || err.message?.includes('quota')) continue;
        break;
      }
    }
  }

  // ── Test Anthropic ────────────────────────────────────────────────────────
  let anthropicResult: any = { skipped: 'ANTHROPIC_API_KEY not set' };
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
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Reply with exactly: OK' }],
        }),
      });
      const data = await res.json();
      anthropicResult = res.ok
        ? { ok: true, reply: data?.content?.[0]?.text?.trim() }
        : { ok: false, status: res.status, error: data?.error?.message };
    } catch (e: any) {
      anthropicResult = { ok: false, error: e.message };
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    sdk: '@google/genai (new SDK — ai.models.generateContent / ai.chats.create)',
    modelChain: ['gemini-2.5-flash', 'gemini-2.5-flash-lite'],
    keys: {
      GOOGLE_GEMINI_API_KEY: mask(geminiKey),
      ANTHROPIC_API_KEY: mask(anthropicKey),
    },
    liveTests: { gemini: geminiResult, anthropic: anthropicResult },
    status: geminiResult?.ok
      ? `✅ WORKING — ${geminiResult.model}`
      : `❌ Gemini failed: ${geminiResult?.error}`,
  }, { headers: { 'Cache-Control': 'no-store' } });
}
