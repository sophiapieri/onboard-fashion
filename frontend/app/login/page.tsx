'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

function LoginPageContent() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F5F5F0]">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}

export default function LoginPage() {
  return <LoginPageContent />;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGuestBanner, setShowGuestBanner] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedBoards = window.localStorage.getItem('onboard_guest_boards');
      setShowGuestBanner(Boolean(storedBoards));
    } catch {
      setShowGuestBanner(false);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!auth) {
      setError('Authentication is unavailable right now.');
      setIsSubmitting(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push(returnTo);
    } catch {
      setError('We could not sign you in. Please check your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F5F0] px-4 py-10 sm:px-6">
      <div className="w-full max-w-md rounded-3xl border border-sky/70 bg-white p-8 shadow-[0_16px_45px_-24px_rgba(0,28,87,0.45)]">
        {showGuestBanner ? (
          <div className="mb-6 rounded-2xl border border-sky bg-sky/30 px-4 py-3 text-sm text-navy">
            <div className="flex items-start justify-between gap-3">
              <p>
                You have an unsaved board from your session. It will be saved to your account after login.
              </p>
              <button
                type="button"
                className="text-lg leading-none text-muted"
                onClick={() => setShowGuestBanner(false)}
                aria-label="Dismiss guest board banner"
              >
                ×
              </button>
            </div>
          </div>
        ) : null}

        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-navy">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" fill="none">
              <path d="M6 18c1-3 3-5 6-5s5 2 6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M10 7a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 3c4 0 7 3 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-display text-3xl font-semibold tracking-[0.2em] text-navy">ONBOARD</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-navy" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-sky/70 bg-sand px-4 py-3 text-sm outline-none ring-0 focus:border-navy"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-navy" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-sky/70 bg-sand px-4 py-3 text-sm outline-none ring-0 focus:border-navy"
              placeholder="••••••••"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-navy px-4 py-3 font-semibold text-white transition hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm text-muted hover:text-navy">
            Forgot password?
          </Link>
        </div>

        <div className="mt-8 border-t border-sky/60 pt-5 text-center text-sm text-muted">
          <Link href="/signup" className="font-medium text-navy hover:text-navy/80">
            Don&apos;t have an account? Sign up →
          </Link>
        </div>
      </div>
    </main>
  );
}
