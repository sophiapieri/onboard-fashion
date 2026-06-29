'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/components/AuthProvider';

export default function ProfilePage() {
  const auth = useContext(AuthContext);

  return (
    <main className="min-h-screen bg-[#F5F5F0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="rounded-[28px] border border-sky/60 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Profile</p>
              <h1 className="mt-2 font-display text-3xl text-navy">{auth?.user?.displayName || 'Your profile'}</h1>
            </div>
            <Link href="/dashboard" className="rounded-full border border-navy px-4 py-2 text-sm font-semibold text-navy">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
