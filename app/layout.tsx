import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'MLAithing | AI Knowledge Hub',
  description: 'Advanced repository for Agentic AI and ML Architectures',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 flex min-h-screen font-sans">
        {/* Fixed Left Sidebar */}
        <Sidebar />
        
        {/* Main Scrollable Area */}
        <div className="flex-1 ml-0 md:ml-72 transition-all duration-300">
          <main className="max-w-7xl mx-auto p-8 md:p-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}