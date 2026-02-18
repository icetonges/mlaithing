import { Info, AlertTriangle, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { ReactNode } from 'react';

type CalloutType = 'info' | 'warning' | 'tip' | 'success' | 'error';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const config = {
  info: {
    icon: Info,
    bg: 'bg-blue-900/20',
    border: 'border-blue-700/30',
    text: 'text-blue-400',
    label: 'Info',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-900/20',
    border: 'border-yellow-700/30',
    text: 'text-yellow-400',
    label: 'Note',
  },
  tip: {
    icon: Lightbulb,
    bg: 'bg-purple-900/20',
    border: 'border-purple-700/30',
    text: 'text-purple-400',
    label: 'Tip',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-900/20',
    border: 'border-green-700/30',
    text: 'text-green-400',
    label: 'Good',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-900/20',
    border: 'border-red-700/30',
    text: 'text-red-400',
    label: 'Avoid',
  },
};

export default function Callout({ type = 'info', title, children }: CalloutProps) {
  const { icon: Icon, bg, border, text, label } = config[type];

  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${bg} ${border} my-4`}>
      <Icon className={`w-4 h-4 ${text} shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        {title && (
          <p className={`text-xs font-semibold ${text} uppercase tracking-wider mb-1`}>
            {title || label}
          </p>
        )}
        <div className="text-sm text-[#A0A0C0] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
