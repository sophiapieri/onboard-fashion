'use client';

import HeartButton from '@/components/ui/HeartButton';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onToggleSaved?: () => void;
  boardId: string;
}

export default function ProductCard({ product, onClick, onToggleSaved, boardId }: ProductCardProps) {
  return (
    <button type="button" onClick={onClick} className="group rounded-2xl border border-sky/40 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl">
      <div className="mb-4 overflow-hidden rounded-xl bg-sand">
        {product.image ? (
          <img src={product.image} alt={product.title} className="aspect-square w-full object-cover" />
        ) : (
          <div className="flex aspect-square items-center justify-center bg-navy">
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-white" fill="none">
              <path d="M4 7.5h16" stroke="currentColor" strokeWidth="1.8" />
              <path d="M6 4h12v16H6z" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8.5 11.5 11 14l3-3 3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="line-clamp-2 font-display text-[15px] text-navy">{product.title}</p>
        <p className="text-sm font-semibold text-navy">${product.price.toFixed(2)}</p>
        <div className="flex items-center gap-2 text-sm text-muted">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <span key={index} className={index < Math.round(product.rating) ? 'text-navy' : 'text-sky/70'}>★</span>
            ))}
          </div>
          <span>{product.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <HeartButton productId={product.id} boardId={boardId} isSaved={product.isSaved} onToggle={onToggleSaved} />
      </div>
    </button>
  );
}
