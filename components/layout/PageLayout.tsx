'use client';

import { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import RightPanel from '@/components/layout/RightPanel';
import AIAssistant from '@/components/features/AIAssistant';

interface PageLayoutProps {
  children: ReactNode;
  tocItems?: { id: string; label: string; level: number }[];
  showSidebars?: boolean;
}

export default function PageLayout({
  children,
  tocItems,
  showSidebars = true,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="max-w-[1600px] mx-auto px-4 pt-14">
        {showSidebars ? (
          <div className="flex gap-6 min-h-[calc(100vh-3.5rem)]">
            <Sidebar />
            <main className="flex-1 min-w-0 py-8">
              {children}
            </main>
            <RightPanel items={tocItems} />
          </div>
        ) : (
          <main className="py-8">{children}</main>
        )}
      </div>
      <AIAssistant />
    </div>
  );
}
