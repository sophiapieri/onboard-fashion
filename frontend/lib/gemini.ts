// Gemini-based analysis helper for Pinterest board images.

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiAnalysis {
  aestheticLabels: string[];
  dominantColors: string[];
  clothingTypes: string[];
  searchQueries: string[];
}

function sanitizeGeminiJson(rawText: string): string {
  return rawText
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/i, '')
    .trim();
}

export async function analyzeImages(imageUrls: string[]): Promise<GeminiAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt =
    "You are a fashion stylist AI. Analyze these Pinterest images. Return ONLY a valid JSON object with these keys: aestheticLabels, dominantColors, clothingTypes, searchQueries.";

  const parts = [
    { text: prompt },
    ...imageUrls.slice(0, 8).map((url) => ({ text: url })),
  ];

  const result = await model.generateContent({
    contents: [{ role: 'user', parts }],
  });
  const rawText = result.response.text();
  console.log('Gemini raw response:', rawText);

  const cleanedText = sanitizeGeminiJson(rawText);

  try {
    const parsed = JSON.parse(cleanedText) as Partial<GeminiAnalysis>;
    return {
      aestheticLabels: Array.isArray(parsed.aestheticLabels) ? parsed.aestheticLabels : [],
      dominantColors: Array.isArray(parsed.dominantColors) ? parsed.dominantColors : [],
      clothingTypes: Array.isArray(parsed.clothingTypes) ? parsed.clothingTypes : [],
      searchQueries: Array.isArray(parsed.searchQueries) ? parsed.searchQueries : [],
    };
  } catch (error) {
    console.error('Gemini parsing failed. Raw text:', rawText);
    throw error;
  }
}
