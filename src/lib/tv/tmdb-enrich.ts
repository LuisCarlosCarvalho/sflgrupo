// src/lib/tv/tmdb-enrich.ts
import { searchMulti } from '../tmdb';

interface EnrichedProgram {
  poster?: string;
  backdrop?: string;
  rating?: string;
}

const enrichmentCache: Record<string, EnrichedProgram> = {};

export async function enrichProgram(title: string): Promise<EnrichedProgram> {
  // Limpar título de prefixos comuns (ex: "Jornal Hoje", "Novela: ...")
  const cleanTitle = title.split(':')[0].trim();

  if (enrichmentCache[cleanTitle]) {
    return enrichmentCache[cleanTitle];
  }

  try {
    const results = await searchMulti(cleanTitle);
    const topResult = results[0];

    if (topResult) {
      const enrichment = {
        poster: topResult.thumbnailUrl,
        backdrop: topResult.backdropUrl,
        rating: topResult.rating
      };
      enrichmentCache[cleanTitle] = enrichment;
      return enrichment;
    }
  } catch (error) {
    console.error('Erro ao enriquecer programa:', error);
  }

  return {};
}
