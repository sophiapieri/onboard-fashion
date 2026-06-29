'use client';

import { useRouter } from 'next/navigation';
import type { BoardPage } from '@/types';

interface SidebarProps {
  boards: BoardPage[];
  activeBoardId?: string;
  onNewBoardClick: () => void;
  onDeleteBoard?: (boardId: string) => void;
}

export default function Sidebar({ boards, activeBoardId, onNewBoardClick, onDeleteBoard }: SidebarProps) {
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
              <div key={board.id} className={`flex items-center gap-2 rounded-xl px-4 py-3 transition ${
                isActive ? 'bg-sky/70 text-navy' : 'text-muted hover:bg-sand hover:text-navy'
              }`}>
                <button
                  type="button"
                  onClick={() => router.push(`/board/${board.id}`)}
                  className="flex-1 text-left text-sm"
                >
                  {board.name}
                </button>
                {onDeleteBoard ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteBoard(board.id);
                    }}
                    className="rounded-full p-1 text-xs font-semibold text-navy/70 transition hover:bg-white hover:text-navy"
                    aria-label={`Delete ${board.name}`}
                  >
                    ×
                  </button>
                ) : null}
              </div>
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
