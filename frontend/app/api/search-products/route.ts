// API route that returns shopping products for a style query.

import type { Product, StoreOffer } from '@/types';

function buildProductsFromQuery(query: string): Product[] {
  const normalizedQuery = query.toLowerCase();
  const category = normalizedQuery.includes('shoe') ? 'shoes' : normalizedQuery.includes('dress') ? 'dresses' : normalizedQuery.includes('outer') ? 'outerwear' : normalizedQuery.includes('bottom') ? 'bottoms' : 'tops';

  return [0, 1, 2, 3].map((index) => {
    const price = 24 + index * 16;
    const storeOffers: StoreOffer[] = [
      {
        storeName: 'Harbor & Co.',
        price,
        url: 'https://example.com/shop',
        sizes: ['XS', 'S', 'M'],
        freeShipping: true,
      },
    ];

    return {
      id: `${category}-${index}`,
      title: `${query} ${index + 1}`,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
      price,
      rating: 4.2 + (index % 2) * 0.4,
      category,
      stores: storeOffers,
      isSaved: false,
    };
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { searchQuery?: string };
  const searchQuery = body.searchQuery?.trim() || 'editorial wardrobe';

  return Response.json(buildProductsFromQuery(searchQuery));
}
