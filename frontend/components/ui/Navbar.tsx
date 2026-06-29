'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { AuthContext } from '@/components/AuthProvider';
import { useAuthPrompt } from '@/lib/hooks/useAuthPrompt';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
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

  const navLinks = isGuest
    ? [
        { href: '/', label: 'Home' },
        { href: '/explore', label: 'Explore' },
        { href: '/login', label: 'Log In' },
      ]
    : [
        { href: '/', label: 'Home' },
        { href: '/explore', label: 'Explore' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/saved-items', label: 'Saved Items' },
        { href: '/profile', label: 'Profile' },
      ];

  return (
    <nav className="sticky top-0 z-40 border-b border-sky/70 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href={isGuest ? '/' : '/dashboard'} className="flex items-center gap-3">
          <img src="/logoBlue.jpg" alt="OnBoard logo" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-display text-xl font-semibold tracking-[0.2em] text-navy">ONBOARD</span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-sky/70 text-navy' : 'text-navy hover:bg-sand'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {isGuest ? (
            <Link href="/signup" className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white">
              Get Started
            </Link>
          ) : (
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
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-navy" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            {isGuest ? (
              <Link href="/signup" className="text-sm font-semibold text-navy" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            ) : (
              <button type="button" onClick={handleSignOut} className="text-left text-sm font-medium text-navy">
                Sign Out
              </button>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
