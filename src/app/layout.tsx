import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Alumni Management System',
  description: 'Connect, engage, and grow with your alumni network. Discover events, find mentors, explore career opportunities, and contribute to your alma mater.',
  keywords: ['alumni', 'networking', 'events', 'mentorship', 'careers', 'donations'],
  authors: [{ name: 'Alumni Management Team' }],
  openGraph: {
    title: 'Alumni Management System',
    description: 'Connect, engage, and grow with your alumni network',
    type: 'website',
    siteName: 'Alumni Management System',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alumni Management System',
    description: 'Connect, engage, and grow with your alumni network',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {children}
          </div>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}