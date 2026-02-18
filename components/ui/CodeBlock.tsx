'use client';

import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlight?: number[];
}

export default function CodeBlock({
  code,
  language = 'python',
  filename,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const languageIcons: Record<string, string> = {
    python: '🐍',
    typescript: '🔷',
    javascript: '🟨',
    bash: '💻',
    json: '📋',
    sql: '🗄️',
    yaml: '⚙️',
    markdown: '📝',
  };

  return (
    <div className="code-block my-4 group">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1E1E2E] border-b border-purple-900/30">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">{languageIcons[language] || <Terminal className="w-3.5 h-3.5" />}</span>
            {filename ? (
              <span className="text-xs text-[#A0A0C0] font-mono">{filename}</span>
            ) : (
              <span className="text-xs text-[#606080] uppercase tracking-wider font-mono">{language}</span>
            )}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-[#606080] hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto text-sm">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            background: '#0D0D1A',
            fontSize: '0.8rem',
            lineHeight: '1.6',
            padding: '1.25rem 1rem',
          }}
          lineNumberStyle={{
            color: '#3B3B5C',
            fontSize: '0.7rem',
            minWidth: '2.5em',
            paddingRight: '1em',
            userSelect: 'none',
          }}
          wrapLines
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
