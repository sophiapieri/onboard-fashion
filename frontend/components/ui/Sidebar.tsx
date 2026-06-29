'use client';

import { useRouter } from 'next/navigation';
import type { BoardPage } from '@/types';

interface SidebarProps {
  boards: BoardPage[];
  activeBoardId?: string;
  onNewBoardClick: () => void;
}

export default function Sidebar({ boards, activeBoardId, onNewBoardClick }: SidebarProps) {
  const router = useRouter();

  return (
    <aside className="hidden min-h-screen w-72 flex-col border-r border-sky/60 bg-white p-6 lg:flex">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-muted">My Boards</p>
      </div>

      <div className="flex-1 space-y-2">
        {boards.length === 0 ? (
          <p className="rounded-xl border border-dashed border-sky/70 px-4 py-3 text-sm text-muted">
            Your saved boards will appear here.
          </p>
        ) : (
          boards.map((board) => {
            const isActive = board.id === activeBoardId;
            return (
              <button
                key={board.id}
                type="button"
                onClick={() => router.push(`/board/${board.id}`)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                  isActive ? 'bg-sky/70 text-navy' : 'text-muted hover:bg-sand hover:text-navy'
                }`}
              >
                {board.name}
              </button>
            );
          })
        )}
      </div>

      <button
        type="button"
        onClick={onNewBoardClick}
        className="mt-4 rounded-xl border border-navy px-4 py-3 text-sm font-semibold text-navy transition hover:bg-sand"
      >
        ＋ New Board
      </button>
    </aside>
  );
}
