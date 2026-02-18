import './globals.css';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50">
        <Sidebar /> {/* Left Sidebar as requested in blueprint */}
        <div className="flex-1">
          {children}
        </div>
      </body>
    </html>
  );
}