// src/components/dashboard/RecentUploads.tsx
import { getRecentCatalogUpdates } from "@/app/actions/catalog";
import { searchMulti } from "@/lib/tmdb";
import MovieRow from "@/components/shared/MovieRow";

export default async function RecentUploads({ watchlistIds }: { watchlistIds: Set<string> }) {
  try {
    const titles = await getRecentCatalogUpdates();
    
    if (titles.length === 0) return null;

    // Buscar metadados para cada título em paralelo
    const moviePromises = titles.map(async (title: string) => {
      try {
        const results = await searchMulti(title);
        return results[0]; // Pegar o primeiro resultado mais relevante
      } catch (err) {
        console.error(`Erro ao buscar metadados para ${title}:`, err);
        return null;
      }
    });

    const results = await Promise.all(moviePromises);
    const movies = results.filter((m): m is any => m !== undefined && m !== null);

    if (movies.length === 0) return null;

    return (
      <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <MovieRow 
          title="Adicionados Recentemente" 
          movies={movies} 
          glowColor="yellow" 
          watchlistIds={watchlistIds} 
        />
      </section>
    );
  } catch (error) {
    console.error("Erro no componente RecentUploads:", error);
    return null;
  }
}
