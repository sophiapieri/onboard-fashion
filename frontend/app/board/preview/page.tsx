'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGuestSession } from '@/lib/hooks/useGuestSession';
import BoardView from '@/components/ui/BoardView';
import { useAuthPrompt } from '@/lib/hooks/useAuthPrompt';
import type { BoardPage } from '@/types';

export default function PreviewPage() {
  const router = useRouter();
  const { getGuestBoards } = useGuestSession();
  const { openAuthPrompt } = useAuthPrompt();
  const [board, setBoard] = useState<BoardPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const guestBoards = getGuestBoards();
    if (guestBoards.length === 0) {
      router.replace('/explore');
      return;
    }

    setBoard(guestBoards[guestBoards.length - 1]);
    setIsLoading(false);
  }, [getGuestBoards, router]);

  const handleToggleSaved = async () => {
    openAuthPrompt();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 rounded-[24px] border border-sky/70 bg-sky/70 px-4 py-3 text-sm font-medium text-navy">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>✦ Save this board to your account so you never lose it.</p>
          <button type="button" onClick={openAuthPrompt} className="rounded-full bg-white px-4 py-2 font-semibold text-navy">
            Save Board →
          </button>
        </div>
      </div>
      <BoardView board={board} isLoading={isLoading} error={null} onToggleSaved={handleToggleSaved} />
    </div>
  );
}
