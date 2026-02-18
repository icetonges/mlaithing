import { BookOpen, Cpu, Terminal } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block">
      <div className="text-2xl font-bold text-purple-600 mb-8">mlaithing</div>
      <nav className="space-y-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sections</div>
        <NavItem icon={<BookOpen size={18}/>} label="ML Fundamentals" />
        <NavItem icon={<Cpu size={18}/>} label="Agent Architectures" />
        <NavItem icon={<Terminal size={18}/>} label="Code Portfolio" />
      </nav>
    </aside>
  );
}

function NavItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center space-x-3 text-gray-600 hover:text-purple-600 cursor-pointer transition-colors">
      {icon} <span>{label}</span>
    </div>
  );
}