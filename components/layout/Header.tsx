'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Search, Menu, X, Upload, Moon, Sun } from 'lucide-react';
import SearchModal from '@/components/features/SearchModal';

const navLinks = [
  { href: '/', label: 'Hub' },
  { href: '/fundamentals', label: 'Fundamentals' },
  { href: '/llms', label: 'LLMs & GenAI' },
  { href: '/applied', label: 'Applied AI' },
  { href: '/toolkit', label: 'Toolkit' },
  { href: '/evaluation', label: 'Evaluation' },
  { href: '/advanced', label: 'Advanced' },
  { href: '/upload', label: 'Upload', icon: <Upload className="w-3.5 h-3.5" /> },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0A0A0F]/95 backdrop-blur-xl border-b border-purple-900/30'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center glow-purple group-hover:scale-105 transition-transform">
              <Brain className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display font-bold text-sm tracking-wide hidden sm:block">
              <span className="text-purple-400">AI</span>
              <span className="text-[#F0F0FF]">/ML</span>
              <span className="text-[#A0A0C0] ml-1.5">Knowledge Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-purple-900/40 text-purple-300 border border-purple-700/30'
                    : 'text-[#A0A0C0] hover:text-[#F0F0FF] hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#A0A0C0] hover:text-white hover:border-purple-500/50 transition-all text-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Search</span>
              <kbd className="hidden sm:block text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/10">⌘K</kbd>
            </button>

            <Link
              href="https://shangthing.vercel.app"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 to-purple-600 text-white text-xs font-medium hover:from-purple-600 hover:to-purple-500 transition-all"
            >
              ✦ MyThing
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 text-[#A0A0C0] hover:text-white"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0F0F1A]/98 backdrop-blur-xl border-b border-purple-900/30 px-4 pb-4">
            <nav className="grid grid-cols-2 gap-2 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    pathname === link.href
                      ? 'bg-purple-900/40 text-purple-300'
                      : 'text-[#A0A0C0] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
