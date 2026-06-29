'use client';

import { useEffect, useMemo, useState } from 'react';
import FilterBar from '@/components/ui/FilterBar';
import ProductCard from '@/components/ui/ProductCard';
import ProductModal from '@/components/ui/ProductModal';
import type { BoardPage, ClothingCategory, Product } from '@/types';

interface BoardViewProps {
  board: BoardPage | null;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  onToggleSaved?: (productId: string) => Promise<void> | void;
}

const categoryLabels: Record<ClothingCategory, string> = {
  tops: 'Tops',
  bottoms: 'Bottoms',
  dresses: 'Dresses',
  outerwear: 'Outerwear',
  shoes: 'Shoes',
  accessories: 'Accessories',
};

export default function BoardView({ board, isLoading, error, onRetry, onToggleSaved }: BoardViewProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setFilteredProducts(board?.products ?? []);
  }, [board]);

  const groupedProducts = useMemo(() => {
    const groups = new Map<ClothingCategory, Product[]>();
    filteredProducts.forEach((product) => {
      const existing = groups.get(product.category) ?? [];
      existing.push(product);
      groups.set(product.category, existing);
    });

    return Array.from(groups.entries()).sort(([left], [right]) => left.localeCompare(right));
  }, [filteredProducts]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse rounded-2xl bg-sand p-6">
          <div className="mb-3 h-8 w-2/3 rounded-full bg-sky/70" />
          <div className="h-4 w-1/2 rounded-full bg-sky/50" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl border border-sky/30 bg-white p-4">
              <div className="mb-4 aspect-square rounded-xl bg-sand" />
              <div className="mb-3 h-4 w-3/4 rounded-full bg-sand" />
              <div className="h-4 w-1/2 rounded-full bg-sand" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="rounded-[28px] border border-sky/60 bg-white p-8 text-center shadow-sm">
        <p className="font-display text-2xl text-navy">We couldn't load this board.</p>
        <p className="mt-3 text-sm text-muted">{error ?? 'Please try again.'}</p>
        {onRetry ? (
          <button type="button" onClick={onRetry} className="mt-6 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white">
            Try again
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-sky/60 bg-white p-6 shadow-[0_18px_55px_-24px_rgba(0,28,87,0.32)] sm:p-8">
        <h1 className="font-display text-3xl text-navy sm:text-4xl">{board.name}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {board.aestheticLabels?.map((label) => (
            <span key={label} className="rounded-full bg-sky/70 px-3 py-1 text-sm font-medium text-navy">
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="sticky top-0 z-20 rounded-[24px] border border-sky/60 bg-white/95 p-3 shadow-sm backdrop-blur">
        <FilterBar products={board.products} onFilteredProductsChange={setFilteredProducts} />
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {groupedProducts.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-sky/70 bg-white p-8 text-center text-sm text-muted">
          No products match the selected filters yet.
        </div>
      ) : (
        groupedProducts.map(([category, products]) => (
          <section key={category}>
            <h2 className="mb-4 font-display text-xl text-navy">{categoryLabels[category]}</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  boardId={board.id}
                  onClick={() => setSelectedProduct(product)}
                  onToggleSaved={() => onToggleSaved?.(product.id)}
                />
              ))}
            </div>
          </section>
        ))
      )}

      {selectedProduct ? (
        <ProductModal
          product={selectedProduct}
          boardId={board.id}
          onClose={() => setSelectedProduct(null)}
          onToggleSaved={() => onToggleSaved?.(selectedProduct.id)}
        />
      ) : null}
    </div>
  );
}