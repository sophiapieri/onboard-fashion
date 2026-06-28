// Firestore helpers for creating, retrieving, updating, and deleting board pages.

import type { BoardPage } from '@/types';

export async function createBoardPage(userId: string, boardPage: BoardPage): Promise<string> {
  void userId;
  void boardPage;
  return '';
}

export async function getBoardPages(userId: string): Promise<BoardPage[]> {
  void userId;
  return [];
}

export async function getBoardPage(userId: string, pageId: string): Promise<BoardPage | null> {
  void userId;
  void pageId;
  return null;
}

export async function toggleSavedItem(userId: string, pageId: string, productId: string): Promise<void> {
  void userId;
  void pageId;
  void productId;
}

export async function deleteBoardPage(userId: string, pageId: string): Promise<void> {
  void userId;
  void pageId;
}

export async function importGuestBoard(userId: string, guestBoard: BoardPage): Promise<string> {
  void userId;
  void guestBoard;
  return '';
}
