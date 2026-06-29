// API route that returns shopping products for a style query.

import { searchProducts } from '@/lib/serpapi';

export async function POST(request: Request) {
  const body = (await request.json()) as { searchQuery?: string };
  const searchQuery = body.searchQuery?.trim() || 'editorial wardrobe';

  const products = await searchProducts(searchQuery);
  return Response.json(products);
}
