'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthPromptModal({ isOpen, onClose }: AuthPromptModalProps) {
  const pathname = usePathname();

  if (!isOpen) {
    return null;
  }

  const returnTo = encodeURIComponent(pathname || '/');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-7 shadow-2xl">
        <div className="mb-5 flex justify-end">
          <button type="button" onClick={onClose} className="text-xl text-muted" aria-label="Close auth prompt">
            ×
          </button>
        </div>

        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none">
              <path d="M6 18c1-3 3-5 6-5s5 2 6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M10 7a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 3c4 0 7 3 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="font-display text-3xl text-navy">Save your style.</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Create a free account to save boards, heart items, and keep your curated closet across devices.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href={`/signup?returnTo=${returnTo}`}
            className="flex w-full items-center justify-center rounded-xl bg-navy px-4 py-3 font-semibold text-white"
            onClick={onClose}
          >
            Create a free account
          </Link>
          <Link
            href={`/login?returnTo=${returnTo}`}
            className="flex w-full items-center justify-center rounded-xl border border-navy px-4 py-3 font-semibold text-navy"
            onClick={onClose}
          >
            Log in
          </Link>
        </div>

        <div className="mt-5 text-center">
          <button type="button" className="text-sm text-muted hover:text-navy" onClick={onClose}>
            Just browsing? Continue as guest
          </button>
        </div>
      </div>
    </div>
  );
}
