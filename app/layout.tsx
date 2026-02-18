import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'AI/ML Knowledge Hub | Peter Shang',
  description: 'Comprehensive AI/ML knowledge repository — fundamentals to production-ready implementations, LLM comparisons, prompt engineering, and agentic AI systems.',
  keywords: ['AI', 'Machine Learning', 'LLM', 'Deep Learning', 'Python', 'Data Science'],
  openGraph: {
    title: 'AI/ML Knowledge Hub',
    description: 'From fundamentals to production-ready AI',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise grid-bg min-h-screen antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#141428',
              color: '#F0F0FF',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              fontFamily: 'Syne, sans-serif',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
