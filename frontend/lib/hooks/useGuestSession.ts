'use client';

import { useCallback, useEffect, useState } from 'react';
import type { BoardPage } from '@/types';

const STORAGE_KEY = 'onboard_guest_boards';

function readGuestBoards(): BoardPage[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as BoardPage[];
    return parsed.map((board) => ({
      ...board,
      createdAt: board.createdAt instanceof Date ? board.createdAt : new Date(board.createdAt),
    }));
  } catch {
    return [];
  }
}

function writeGuestBoards(boards: BoardPage[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
}

export function useGuestSession() {
  const [boards, setBoards] = useState<BoardPage[]>([]);

  useEffect(() => {
    setBoards(readGuestBoards());
  }, []);

  const getGuestBoards = useCallback(() => readGuestBoards(), []);

  const saveGuestBoard = useCallback((board: BoardPage) => {
    const nextBoards = [...readGuestBoards(), board];
    writeGuestBoards(nextBoards);
    setBoards(nextBoards);
  }, []);

  const clearGuestBoards = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setBoards([]);
  }, []);

  const hasGuestBoards = useCallback(() => getGuestBoards().length > 0, [getGuestBoards]);

  return { boards, getGuestBoards, saveGuestBoard, clearGuestBoards, hasGuestBoards };
}
