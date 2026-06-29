// Root layout that wires global fonts and the shared auth shell.

import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ReactNode } from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/ui/Navbar';
import { AuthPromptProvider } from '@/lib/hooks/useAuthPrompt';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'OnBoard',
  description: 'Turn Pinterest inspiration into a curated fashion shopping experience.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AuthProvider>
          <AuthPromptProvider>
            <Navbar />
            {children}
          </AuthPromptProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
