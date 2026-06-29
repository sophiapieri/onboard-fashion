'use client';

import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { AuthContext } from '@/components/AuthProvider';
import { getBoardPage } from '@/lib/firestore';
import BoardView from '@/components/ui/BoardView';
import type { BoardPage } from '@/types';

export default function BoardPage() {
  const params = useParams<{ pageId: string }>();
  const auth = useContext(AuthContext);
  const [board, setBoard] = useState<BoardPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageId = params?.pageId ?? '';

  const loadBoard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!auth?.user && !auth?.isGuest) {
        throw new Error('Please sign in to view this board.');
      }

      const userId = auth?.user?.uid ?? 'guest';
      const loadedBoard = await getBoardPage(userId, pageId);
      if (!loadedBoard) {
        const response = await fetch('/api/analyze-board', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pinterestUrl: 'https://www.pinterest.com', pageName: pageId }),
        });
        const fallbackBoard = (await response.json()) as BoardPage;
        setBoard(fallbackBoard);
      } else {
        setBoard(loadedBoard);
      }
    } catch {
      setError('We could not load this board right now.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBoard();
  }, [pageId, auth?.user?.uid]);

  const handleToggleSaved = async (productId: string) => {
    if (!auth?.user || !board) {
      return;
    }

    setBoard((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        products: current.products.map((product) =>
          product.id === productId ? { ...product, isSaved: !product.isSaved } : product,
        ),
      };
    });
  };

  return <BoardView board={board} isLoading={isLoading} error={error} onRetry={loadBoard} onToggleSaved={handleToggleSaved} />;
}
