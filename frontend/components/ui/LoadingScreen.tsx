'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
}

const phrases = ['Reading your board...', 'Finding your aesthetic...', 'Sourcing your closet...', 'Almost ready...'];

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const interval = window.setInterval(() => {
      setPhraseIndex((current) => (current + 1) % phrases.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#001C57] px-4">
      <div className="flex flex-col items-center text-center">
        <div className="relative h-28 w-72 overflow-hidden">
          <svg viewBox="0 0 320 140" className="h-28 w-72 text-white" fill="none" aria-hidden="true">
            <path d="M22 98c48-12 72-16 110-16 36 0 68 6 106 20" stroke="currentColor" strokeWidth="2" className="loading-wave" />
            <path d="M24 88c40-8 68-10 104-10 24 0 52 4 94 12" stroke="currentColor" strokeOpacity="0.6" strokeWidth="2" className="loading-wave" />
            <path d="M28 70l74 0 20-24 22 0-18 24h36l26-20 20 0-20 20h34l32-18 20 0-24 18h32" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="loading-sailboat" />
          </svg>
        </div>
        <p className="mt-6 text-lg font-medium text-white">{phrases[phraseIndex]}</p>
      </div>
    </div>
  );
}
