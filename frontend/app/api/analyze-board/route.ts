// API route that turns a Pinterest board URL into a board analysis and product results.

import type { BoardPage, ClothingCategory, Product, StoreOffer } from '@/types';

function buildMockProducts(query: string): Product[] {
  const titleSeed = query.toLowerCase().includes('coastal')
    ? 'Coastal Layers'
    : query.toLowerCase().includes('dark')
      ? 'Dark Academia Set'
      : query.toLowerCase().includes('clean')
        ? 'Clean Girl Essentials'
        : 'Editorial Essentials';

  const categories: ClothingCategory[] = ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'];

  return categories.slice(0, 4).map((category, index) => {
    const price = 28 + index * 18;
    const storeOffers: StoreOffer[] = [
      {
        storeName: 'North Harbor',
        price,
        url: 'https://example.com/shop',
        sizes: ['XS', 'S', 'M'],
        freeShipping: true,
      },
    ];

    return {
      id: `${category}-${index}`,
      title: `${titleSeed} ${category}`,
      image: `https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80`,
      price,
      rating: 4.5 + (index % 2) * 0.3,
      category,
      stores: storeOffers,
      isSaved: false,
    };
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { pinterestUrl?: string; pageName?: string; userId?: string };
  const pinterestUrl = body.pinterestUrl ?? 'https://www.pinterest.com';
  const pageName = body.pageName?.trim() || 'New Board';
  const aestheticLabels = [pageName, 'editorial', 'refined'];

  const board: BoardPage = {
    id: `board-${Date.now()}`,
    name: pageName,
    pinterestUrl,
    aestheticLabels,
    createdAt: new Date(),
    products: buildMockProducts(pageName),
  };

  return Response.json(board);
}
