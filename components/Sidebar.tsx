'use client';
import { BookOpen, Cpu, Terminal, LayoutGrid, Layers, Database } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-[#0f0e17] text-gray-300 fixed h-full overflow-y-auto border-r border-gray-800 hidden md:flex flex-col">
      <div className="p-8 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          mlaithing<span className="text-brand-gold">.</span>
        </h1>
        <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Engineering Hub</p>
      </div>

      <nav className="p-6 space-y-8 flex-1">
        <Section title="Core Concepts">
          <NavLink href="/" icon={<LayoutGrid size={18} />} label="Overview" active={pathname === '/'} />
          <NavLink href="/ml-basics" icon={<BookOpen size={18} />} label="ML Fundamentals" active={pathname === '/ml-basics'} />
        </Section>

        <Section title="Agentic Systems">
          <NavLink href="/agents" icon={<Cpu size={18} />} label="Agent Architecture" active={pathname === '/agents'} />
          <NavLink href="/context" icon={<Database size={18} />} label="Context & Memory" active={pathname === '/context'} />
          <NavLink href="/tools" icon={<Layers size={18} />} label="Tool Use (MCP)" active={pathname === '/tools'} />
        </Section>

        <Section title="Engineering">
          <NavLink href="/portfolio" icon={<Terminal size={18} />} label="Code Portfolio" active={pathname === '/portfolio'} />
        </Section>
      </nav>

      <div className="p-6 border-t border-gray-800">
        <div className="bg-gray-800/50 rounded p-4 text-xs text-gray-400">
          <p className="font-semibold text-white mb-1">Status: Beta</p>
          v2.0.0 (Production)
        </div>
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function NavLink({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
        active 
          ? 'bg-brand-purple text-white shadow-lg shadow-purple-900/20' 
          : 'hover:bg-gray-800 hover:text-white'
      }`}
    >
      <span className={active ? 'text-white' : 'text-gray-400 group-hover:text-white'}>{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}