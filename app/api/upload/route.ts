import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

async function analyzeWithAI(content: string, filename: string): Promise<{ summary: string; insights: string[] }> {
  const apiKey = process.env.ANTHROPIC_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
  
  if (!apiKey) {
    return {
      summary: 'AI analysis unavailable — configure ANTHROPIC_API_KEY or GOOGLE_GEMINI_API_KEY to enable automatic document analysis.',
      insights: ['Configure API key for AI-powered insights', 'Document uploaded successfully'],
    };
  }

  const prompt = `Analyze this document and provide:
1. A 2-3 sentence summary
2. 3-5 key insights or concepts (especially ML/AI related ones)

Document name: ${filename}
Content (first 3000 chars):
${content.substring(0, 3000)}

Respond in JSON format:
{
  "summary": "...",
  "insights": ["...", "...", "..."]
}`;

  try {
    if (process.env.ANTHROPIC_API_KEY) {
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
      const text = data.content?.[0]?.text || '{}';
      const clean = text.replace(/```json|```/g, '').trim();
      return JSON.parse(clean);
    } else if (process.env.GOOGLE_GEMINI_API_KEY) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      return JSON.parse(text);
    }
  } catch (err) {
    console.error('AI analysis error:', err);
  }

  return {
    summary: 'Document uploaded successfully. AI analysis failed — check API configuration.',
    insights: ['Upload successful', 'AI analysis unavailable'],
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const analyze = formData.get('analyze') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${safeName}`;
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    // Extract text content for analysis
    let textContent = '';
    if (file.type.includes('text') || 
        file.name.endsWith('.md') || 
        file.name.endsWith('.py') || 
        file.name.endsWith('.js') || 
        file.name.endsWith('.ts') ||
        file.name.endsWith('.json') ||
        file.name.endsWith('.csv')) {
      textContent = buffer.toString('utf-8');
    }

    // AI Analysis
    let analysis = { summary: '', insights: [] as string[] };
    if (analyze && textContent) {
      analysis = await analyzeWithAI(textContent, file.name);
    } else if (analyze) {
      analysis = {
        summary: `${file.name} uploaded successfully (${(file.size / 1024).toFixed(1)} KB). Text extraction not available for this file type.`,
        insights: ['File stored successfully', 'Binary file — text extraction requires additional processing'],
      };
    }

    return NextResponse.json({
      id: filename,
      name: file.name,
      size: file.size,
      type: file.type,
      url: `/uploads/${filename}`,
      summary: analysis.summary,
      insights: analysis.insights,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Return list of uploaded files
  try {
    const { readdirSync, statSync } = await import('fs');
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = readdirSync(uploadsDir).map((name) => {
      const stat = statSync(join(uploadsDir, name));
      return {
        name: name.replace(/^\d+_/, ''),
        filename: name,
        size: stat.size,
        url: `/uploads/${name}`,
        uploadedAt: stat.birthtime,
      };
    });

    return NextResponse.json({ files: files.reverse() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
