'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { importGuestBoard } from '@/lib/firestore';
import type { BoardPage } from '@/types';

function isStrongPassword(password: string) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function SignupPageContent() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F5F5F0]">Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}

export default function SignupPage() {
  return <SignupPageContent />;
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') ?? '/dashboard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!isStrongPassword(password)) {
      setError('Please choose a stronger password. Use at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }

    if (!auth) {
      setError('Authentication is unavailable right now.');
      return;
    }

    setIsSubmitting(true);

    try {
      const credentials = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(credentials.user, { displayName: name.trim() });

      const storedBoards = window.localStorage.getItem('onboard_guest_boards');
      if (storedBoards) {
        const parsedBoards = JSON.parse(storedBoards) as BoardPage[];
        for (const board of parsedBoards) {
          await importGuestBoard(credentials.user.uid, board);
        }
        window.localStorage.removeItem('onboard_guest_boards');
      }

      router.push(returnTo);
    } catch (error) {
      const authError = error as { code?: string };
      if (authError.code === 'auth/weak-password') {
        setError('Please choose a stronger password. Use at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character.');
      } else {
        setError('We could not create your account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F5F0] px-4 py-10 sm:px-6">
      <div className="w-full max-w-md rounded-3xl border border-sky/70 bg-white p-8 shadow-[0_16px_45px_-24px_rgba(0,28,87,0.45)]">
        <div className="mb-8 flex flex-col items-center">
          <img src="/logoBlue.jpg" alt="OnBoard logo" className="mb-3 h-12 w-12 rounded-full object-cover" />
          <p className="font-display text-3xl font-semibold tracking-[0.2em] text-navy">ONBOARD</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-navy" htmlFor="displayName">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-sky/70 bg-sand px-4 py-3 text-sm outline-none ring-0 focus:border-navy"
              placeholder="Emma"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-navy" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-sky/70 bg-sand px-4 py-3 text-sm outline-none ring-0 focus:border-navy"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-navy" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-sky/70 bg-sand px-4 py-3 text-sm outline-none ring-0 focus:border-navy"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-navy" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
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
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 border-t border-sky/60 pt-5 text-center text-sm text-muted">
          <Link href="/login" className="font-medium text-navy hover:text-navy/80">
            Already have an account? Log in →
          </Link>
        </div>
      </div>
    </main>
  );
}
