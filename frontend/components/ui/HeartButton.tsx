'use client';

import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '@/components/AuthProvider';
import { useAuthPrompt } from '@/lib/hooks/useAuthPrompt';
import { toggleSavedItem } from '@/lib/firestore';

interface HeartButtonProps {
  productId: string;
  boardId: string;
  isSaved: boolean;
  onToggle?: () => void;
  className?: string;
}

export default function HeartButton({ productId, boardId, isSaved, onToggle, className }: HeartButtonProps) {
  const auth = useContext(AuthContext);
  const { openAuthPrompt } = useAuthPrompt();
  const [localSaved, setLocalSaved] = useState(isSaved);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async () => {
    if (auth?.isGuest || !auth?.user) {
      setIsAnimating(true);
      window.setTimeout(() => setIsAnimating(false), 400);
      openAuthPrompt();
      return;
    }

    const nextValue = !localSaved;
    setLocalSaved(nextValue);
    onToggle?.();
    if (auth.user) {
      await toggleSavedItem(auth.user.uid, boardId, productId);
    }
  };

  const isActive = localSaved || isSaved;

  return (
    <button
      type="button"
      onClick={() => void handleClick()}
      aria-label={isActive ? 'Unsave product' : 'Save product'}
      className={`rounded-full border border-navy p-2 text-navy transition-all ${isAnimating ? 'scale-110' : ''} ${className ?? ''}`}
    >
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${isActive ? 'fill-navy text-navy' : 'fill-none text-navy'}`} stroke="currentColor" strokeWidth="1.9">
        <path d="M12 20s-6-3.4-8.2-7.1C2.3 10.4 3.2 7.1 6 6c1.4-.5 3-.1 4.2 1.1 1.2-1.2 2.8-1.6 4.2-1.1 2.8.9 3.7 4.4 2.2 6.9C18 16.6 12 20 12 20Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
