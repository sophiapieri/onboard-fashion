'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { AuthContext } from '@/components/AuthProvider';
import { useAuthPrompt } from '@/lib/hooks/useAuthPrompt';

export default function Navbar() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const { openAuthPrompt } = useAuthPrompt();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const isGuest = authContext?.isGuest ?? true;
  const user = authContext?.user;

  const initials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const handleMyBoardsClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (isGuest) {
      openAuthPrompt();
      return;
    }

    router.push('/dashboard');
  };

  const handleSignOut = async () => {
    await authContext?.signOut();
    setAvatarOpen(false);
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-sky/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href={isGuest ? '/' : '/dashboard'} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy">
            <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none">
              <path d="M6 18c1-3 3-5 6-5s5 2 6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M10 7a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 3c4 0 7 3 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-display text-xl font-semibold tracking-[0.2em] text-navy">ONBOARD</span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          {isGuest ? (
            <>
              <Link href="/explore" className="text-sm font-medium text-navy hover:text-navy/80">
                Explore
              </Link>
              <Link href="/login" className="rounded-full border border-navy px-4 py-2 text-sm font-semibold text-navy">
                Log In
              </Link>
              <Link href="/signup" className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link href="/explore" className="text-sm font-medium text-navy hover:text-navy/80">
                Explore
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-navy hover:text-navy/80">
                My Boards
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAvatarOpen((current) => !current)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white"
                >
                  {initials}
                </button>

                {avatarOpen ? (
                  <div className="absolute right-0 mt-2 w-36 rounded-xl border border-sky/60 bg-white p-2 shadow-lg">
                    <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm text-navy hover:bg-sand">
                      Dashboard
                    </Link>
                    <button type="button" onClick={handleSignOut} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-navy hover:bg-sand">
                      Sign Out
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>

        <button type="button" className="rounded-full p-2 md:hidden" onClick={() => setMobileOpen((current) => !current)} aria-label="Toggle menu">
          <div className="space-y-1.5">
            <span className="block h-0.5 w-6 bg-navy" />
            <span className="block h-0.5 w-6 bg-navy" />
            <span className="block h-0.5 w-6 bg-navy" />
          </div>
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-sky/60 bg-white px-4 py-4 md:hidden">
          {isGuest ? (
            <div className="flex flex-col gap-3">
              <Link href="/explore" className="text-sm font-medium text-navy" onClick={() => setMobileOpen(false)}>
                Explore
              </Link>
              <Link href="/login" className="text-sm font-semibold text-navy" onClick={() => setMobileOpen(false)}>
                Log In
              </Link>
              <Link href="/signup" className="text-sm font-semibold text-navy" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/explore" className="text-sm font-medium text-navy" onClick={() => setMobileOpen(false)}>
                Explore
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-navy" onClick={() => setMobileOpen(false)}>
                My Boards
              </Link>
              <button type="button" onClick={handleSignOut} className="text-left text-sm font-medium text-navy">
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : null}
    </nav>
  );
}
