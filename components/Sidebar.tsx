import { BookOpen, Cpu, Terminal, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex-shrink-0 hidden md:block">
      <div className="text-2xl font-bold text-purple-600 mb-10 tracking-tight">mlaithing</div>
      <nav className="space-y-6">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Knowledge Hub</p>
          <div className="space-y-3">
            <NavItem icon={<BookOpen size={18}/>} label="ML Basics" />
            <NavItem icon={<Cpu size={18}/>} label="Agentic AI" />
            <NavItem icon={<Terminal size={18}/>} label="Code Portfolio" />
          </div>
        </div>
      </nav>
    </aside>
  );
}

function NavItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 cursor-pointer transition-all duration-200 group">
      <span className="text-gray-400 group-hover:text-purple-600">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}