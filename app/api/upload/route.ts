import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { generateText } from '@/lib/gemini';

// ── AI document analysis using same Gemini lib as chat ───────────────────────
async function analyzeWithAI(
  content: string,
  filename: string
): Promise<{ summary: string; insights: string[] }> {
  const prompt = `Analyze this document and provide:
1. A 2-3 sentence summary
2. 3-5 key insights or concepts (especially ML/AI related ones)

Document name: ${filename}
Content (first 3000 chars):
${content.substring(0, 3000)}

Respond in JSON format ONLY — no markdown, no backticks:
{"summary":"...","insights":["...","...","..."]}`;

  // Try Gemini first (same model chain as chat)
  if (process.env.GOOGLE_GEMINI_API_KEY) {
    try {
      const { content: text } = await generateText(prompt, 'You are a document analysis assistant. Always respond with valid JSON only.', {
        maxOutputTokens: 500,
        temperature: 0.3,
      });
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      return { summary: parsed.summary, insights: parsed.insights };
    } catch (err) {
      console.error('[Upload/Gemini] analysis failed:', err);
    }
  }

  // Fallback to Anthropic
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
          model: 'claude-3-5-haiku-20241022',
          max_tokens: 500,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text ?? '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      return { summary: parsed.summary, insights: parsed.insights };
    } catch (err) {
      console.error('[Upload/Claude] analysis failed:', err);
    }
  }

  return {
    summary: 'Document uploaded successfully. Add a GOOGLE_GEMINI_API_KEY or ANTHROPIC_API_KEY to enable AI-powered analysis.',
    insights: ['Configure API key for AI-powered insights', 'Document uploaded and stored'],
  };
}

// ── File upload handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    // Validate file type
    const allowed = ['.pdf', '.txt', '.md', '.csv', '.json', '.py', '.ts', '.js', '.docx'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: `File type ${ext} not allowed` }, { status: 400 });
    }

    // Save file
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true });

    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filepath = join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    // Extract text for analysis
    let textContent = '';
    const textTypes = ['.txt', '.md', '.csv', '.json', '.py', '.ts', '.js'];
    if (textTypes.includes(ext)) {
      textContent = await file.text();
    }

    // AI analysis
    const analysis = textContent
      ? await analyzeWithAI(textContent, file.name)
      : {
          summary: `${file.name} uploaded successfully. Text extraction not available for ${ext} files.`,
          insights: ['File stored successfully', `Type: ${ext}`, `Size: ${(file.size / 1024).toFixed(1)}KB`],
        };

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        filename,
        size: file.size,
        type: file.type,
        url: `/uploads/${filename}`,
      },
      analysis,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}

// ── List uploaded files ───────────────────────────────────────────────────────
export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) return NextResponse.json({ files: [] });

    const files = await readdir(uploadsDir);
    const fileList = await Promise.all(
      files
        .filter((f) => f !== '.gitkeep')
        .map(async (f) => {
          const s = await stat(join(uploadsDir, f));
          return { name: f, size: s.size, url: `/uploads/${f}`, modified: s.mtime };
        })
    );

    return NextResponse.json({ files: fileList });
  } catch {
    return NextResponse.json({ files: [] });
  }
}
