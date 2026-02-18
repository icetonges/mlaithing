// lib/gemini.ts
// Matches shangthing.vercel.app exactly — based on GEMINI-SDK-SETUP-GUIDE.md
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';

// Support both env var names
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

// Same model chain as shangthing.vercel.app
const MODEL_CHAIN = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
] as const;

// Same safety settings as shangthing
const SAFETY = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

export interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface GeminiResponse {
  content: string;
  model: string;
}

/**
 * Multi-turn chat using ai.chats.create() — correct new SDK API
 * Mirrors shangthing.vercel.app agent pattern
 */
export async function callGemini(
  messages: GeminiMessage[],
  systemInstruction: string,
  options: { maxOutputTokens?: number; temperature?: number } = {}
): Promise<GeminiResponse> {
  if (!API_KEY) throw new Error('GOOGLE_GEMINI_API_KEY not set in .env.local');

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const { maxOutputTokens = 1000, temperature = 0.7 } = options;

  const validMessages = messages.filter((m) => m?.content?.trim());
  if (validMessages.length === 0) {
    validMessages.push({ role: 'user', content: 'Hello' });
  }

  // All messages except the last go into history
  const historyMessages = validMessages.slice(0, -1);
  const lastMessage = validMessages[validMessages.length - 1];

  // Format for new SDK: role "model" not "assistant", parts array
  const history = historyMessages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  for (const model of MODEL_CHAIN) {
    try {
      // ✅ Correct new SDK: ai.chats.create() for multi-turn
      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction,
          maxOutputTokens,
          temperature,
          safetySettings: SAFETY,
        },
        history,
      });

      const response = await chat.sendMessage({
        message: lastMessage.content,
      });

      const text = response.text; // ✅ property, NOT function call
      if (!text?.trim()) throw new Error('Empty response');

      return { content: text, model };
    } catch (err: any) {
      const isQuota =
        err.message?.includes('429') ||
        err.message?.includes('quota') ||
        err.message?.includes('RESOURCE_EXHAUSTED');

      if (isQuota && model !== MODEL_CHAIN[MODEL_CHAIN.length - 1]) {
        console.warn(`[Gemini] ${model} quota hit, trying fallback...`);
        continue;
      }
      throw err;
    }
  }

  throw new Error('All Gemini models failed');
}

/**
 * Single-shot text generation using ai.models.generateContent()
 * Used for document analysis, summarization
 */
export async function generateText(
  prompt: string,
  systemInstruction = 'You are a helpful AI assistant.',
  options: { maxOutputTokens?: number; temperature?: number } = {}
): Promise<GeminiResponse> {
  if (!API_KEY) throw new Error('GOOGLE_GEMINI_API_KEY not set in .env.local');

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const { maxOutputTokens = 500, temperature = 0.3 } = options;

  for (const model of MODEL_CHAIN) {
    try {
      // ✅ Correct new SDK: ai.models.generateContent() for single shot
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          maxOutputTokens,
          temperature,
          safetySettings: SAFETY,
        },
      });

      const text = response.text; // ✅ property, NOT function call
      if (!text?.trim()) throw new Error('Empty response');

      return { content: text, model };
    } catch (err: any) {
      const isQuota =
        err.message?.includes('429') ||
        err.message?.includes('quota') ||
        err.message?.includes('RESOURCE_EXHAUSTED');

      if (isQuota && model !== MODEL_CHAIN[MODEL_CHAIN.length - 1]) {
        console.warn(`[Gemini] ${model} quota hit, trying fallback...`);
        continue;
      }
      throw err;
    }
  }

  throw new Error('All Gemini models failed');
}
