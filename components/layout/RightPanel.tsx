'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TocItem {
  id: string;
  label: string;
  level: number;
}

interface RightPanelProps {
  items?: TocItem[];
  relatedLinks?: { label: string; href: string }[];
}

const defaultRelated = [
  { label: '↗ MyThing Platform', href: 'https://shangthing.vercel.app' },
  { label: '↗ Resume', href: 'https://petershang.vercel.app' },
  { label: '↗ GitHub', href: 'https://github.com/icetonges' },
  { label: '↗ Kaggle', href: 'https://www.kaggle.com/icetonges' },
];

export default function RightPanel({ items = [], relatedLinks = defaultRelated }: RightPanelProps) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <aside className="sidebar-right w-48 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-4 pl-2">
      {items.length > 0 && (
        <div className="mb-6">
          <p className="section-label text-[10px] mb-3 px-2">On This Page</p>
          <nav className="space-y-1">
            {items.map(({ id, label, level }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`block text-xs py-1 px-2 rounded transition-all truncate ${
                  level > 2 ? 'pl-4' : ''
                } ${
                  activeId === id
                    ? 'text-purple-400 bg-purple-900/20'
                    : 'text-[#606080] hover:text-[#A0A0C0]'
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}

      <div className="mb-6">
        <p className="section-label text-[10px] mb-3 px-2">Quick Links</p>
        <nav className="space-y-1">
          {relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              className="block text-xs py-1 px-2 text-[#606080] hover:text-purple-400 transition-colors truncate"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-2">
        <p className="section-label text-[10px] mb-3">Stack</p>
        <div className="flex flex-wrap gap-1">
          {['Next.js 15', 'React 19', 'TypeScript', 'Gemini AI', 'Claude API', 'Python'].map((tech) => (
            <span key={tech} className="badge bg-purple-900/30 text-purple-400 border border-purple-800/30 text-[9px] py-0.5 px-2">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 px-2">
        <a
          href="#top"
          className="text-xs text-[#606080] hover:text-purple-400 transition-colors"
        >
          ↑ Back to top
        </a>
      </div>
    </aside>
  );
}
