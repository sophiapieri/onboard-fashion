// API route that turns a Pinterest board URL into a board analysis and product results.

import { fetchPinterestPins } from '@/lib/pinterest';
import { analyzeImages, type GeminiAnalysis } from '@/lib/gemini';
import { searchProducts } from '@/lib/serpapi';
import type { BoardPage, Product } from '@/types';

function deduplicateProducts(products: Product[]): Product[] {
  const seen = new Set<string>();
  return products.filter((product) => {
    if (seen.has(product.title)) {
      return false;
    }
    seen.add(product.title);
    return true;
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { pinterestUrl?: string; pageName?: string; userId?: string };
  const pinterestUrl = body.pinterestUrl?.trim() || 'https://www.pinterest.com';
  const pageName = body.pageName?.trim() || 'New Board';

  console.log('Analyzing board', { pinterestUrl, pageName, userId: body.userId ?? null });
  console.log('SERPAPI_KEY present:', Boolean(process.env.SERPAPI_KEY));
  if (!process.env.SERPAPI_KEY) {
    console.warn('SERPAPI_KEY is undefined at runtime');
  }

  try {
    let pins: Array<{ imageUrl: string; description: string }> = [];
    let imageUrls: string[] = [];

    try {
      pins = await fetchPinterestPins(pinterestUrl);
      imageUrls = pins.slice(0, 8).map((pin) => pin.imageUrl);
      console.log('Pinterest raw image URLs:', imageUrls);
    } catch (error) {
      console.warn('Pinterest RSS fetch failed, continuing with fallback queries:', error);
    }

    let analysis: GeminiAnalysis = {
      aestheticLabels: [pageName, 'editorial', 'refined'],
      dominantColors: [],
      clothingTypes: ['tops', 'bottoms'],
      searchQueries: [pageName, `${pageName} outfit`, `${pageName} aesthetic`],
    };

    if (imageUrls.length > 0) {
      try {
        analysis = await analyzeImages(imageUrls);
        console.log('Gemini JSON response:', analysis);
      } catch (error) {
        console.warn('Gemini analysis failed, using fallback style queries:', error);
      }
    } else {
      console.warn('No Pinterest images were available, using fallback queries based on the board name.');
    }

    const searchQueries = analysis.searchQueries?.length ? analysis.searchQueries : [pageName, `${pageName} outfit`, `${pageName} aesthetic`];
    const searchResults = await Promise.all(searchQueries.slice(0, 6).map((query) => searchProducts(query)));
    const products = deduplicateProducts(searchResults.flat()).slice(0, 20);

    console.log('Final Product[] before return:', products);

    const board: BoardPage = {
      id: `board-${Date.now()}`,
      name: pageName,
      pinterestUrl,
      aestheticLabels: analysis.aestheticLabels?.length ? analysis.aestheticLabels : [pageName, 'editorial', 'refined'],
      createdAt: new Date(),
      products,
    };

    return Response.json(board);
  } catch (error) {
    console.error('Board analysis failed:', error);
    return Response.json({
      id: `board-${Date.now()}`,
      name: pageName,
      pinterestUrl,
      aestheticLabels: [pageName, 'editorial', 'refined'],
      createdAt: new Date(),
      products: [],
      error: 'BOARD_ANALYSIS_FAILED',
    });
  }
}
