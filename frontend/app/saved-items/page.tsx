'use client';

import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/components/AuthProvider';
import { getSavedItems } from '@/lib/firestore';
import type { Product } from '@/types';

export default function SavedItemsPage() {
  const auth = useContext(AuthContext);
  const [savedItems, setSavedItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth?.user || auth?.isGuest) {
      setSavedItems([]);
      setIsLoading(false);
      return;
    }

    const loadSavedItems = async () => {
      if (!auth?.user) {
        return;
      }

      setIsLoading(true);
      const items = await getSavedItems(auth.user.uid);
      setSavedItems(items);
      setIsLoading(false);
    };

    void loadSavedItems();
  }, [auth?.user?.uid, auth?.isGuest]);

  return (
    <main className="min-h-screen bg-[#F5F5F0] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="rounded-[28px] border border-sky/60 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-muted">Saved Items</p>
              <h1 className="mt-2 font-display text-3xl text-navy">Your saved clothing</h1>
            </div>
            <Link href="/dashboard" className="rounded-full border border-navy px-4 py-2 text-sm font-semibold text-navy">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {!auth?.user || auth?.isGuest ? (
          <div className="rounded-[28px] border border-sky/60 bg-white p-8 text-center shadow-sm">
            <p className="font-display text-2xl text-navy">Sign in to keep your saved pieces.</p>
            <p className="mt-3 text-sm text-muted">Your favorites will appear here once you’re signed in.</p>
          </div>
        ) : isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-[24px] border border-sky/40 bg-white p-4">
                <div className="mb-4 aspect-square rounded-xl bg-sand" />
                <div className="mb-3 h-4 w-3/4 rounded-full bg-sand" />
                <div className="h-4 w-1/2 rounded-full bg-sand" />
              </div>
            ))}
          </div>
        ) : savedItems.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-sky/70 bg-white p-8 text-center shadow-sm">
            <p className="font-display text-2xl text-navy">Nothing saved yet.</p>
            <p className="mt-3 text-sm text-muted">Tap the heart on any product to save it here.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {savedItems.map((product) => (
              <article key={product.id} className="rounded-[24px] border border-sky/40 bg-white p-4 shadow-sm">
                <div className="aspect-square overflow-hidden rounded-[20px] bg-sand">
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="mt-4 space-y-2">
                  <h2 className="font-display text-xl text-navy">{product.title}</h2>
                  <p className="text-sm font-semibold text-navy">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-muted">{product.category}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
