'use client';

import { useState, useRef, useEffect } from 'react';
import { Brain, X, Send, Minimize2, Maximize2, ChevronDown, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const starters = [
  'Explain transformers architecture',
  'When should I use XGBoost vs neural nets?',
  'How do I set up Claude API?',
  'What is RAG and when to use it?',
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI/ML knowledge assistant. Ask me anything about machine learning, LLMs, algorithms, or the code examples on this page.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: 'user', content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.content || 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Connection error. Please check your API configuration.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 shadow-lg glow-purple flex items-center justify-center hover:scale-110 transition-transform group"
      >
        <Brain className="w-6 h-6 text-white" />
        <span className="absolute -top-10 right-0 bg-[#0F0F1A] border border-purple-800/30 text-[#A0A0C0] text-xs px-3 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          AI Assistant
        </span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col bg-[#0F0F1A] border border-purple-800/30 rounded-2xl shadow-2xl glow-purple transition-all duration-300 ${
        minimized ? 'h-14 w-72' : 'h-[520px] w-[380px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-purple-900/30 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F0F0FF]">ML Assistant</p>
            {!minimized && (
              <p className="text-[10px] text-green-400">● Online · Powered by Claude</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(!minimized)}
            className="p-1.5 rounded-lg text-[#606080] hover:text-white hover:bg-white/10 transition-all"
          >
            {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg text-[#606080] hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user' ? 'chat-user text-white' : 'chat-ai text-[#A0A0C0]'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <ReactMarkdown className="prose-custom text-xs">
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="chat-ai px-3 py-2.5 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                  <span className="text-xs text-[#606080]">Thinking...</span>
                </div>
              </div>
            )}

            {/* Starter buttons */}
            {messages.length === 1 && !loading && (
              <div className="grid grid-cols-1 gap-1.5 pt-2">
                {starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left text-xs p-2 rounded-lg border border-purple-900/30 text-[#A0A0C0] hover:text-purple-300 hover:border-purple-700/50 hover:bg-purple-900/10 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-purple-900/30 shrink-0">
            <div className="flex items-end gap-2 bg-[#141428] rounded-xl border border-purple-900/20 p-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about ML, LLMs, algorithms..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-[#F0F0FF] placeholder-[#3B3B5C] resize-none outline-none leading-relaxed"
                style={{ maxHeight: '80px', overflowY: 'auto' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-[#3B3B5C] text-center mt-1.5">Shift+Enter for new line</p>
          </div>
        </>
      )}
    </div>
  );
}
