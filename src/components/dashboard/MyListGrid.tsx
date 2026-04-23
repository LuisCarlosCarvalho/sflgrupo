"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/shared/MovieCard";
import { Play, Share2, MessageCircle } from "lucide-react";
import { getWatchlist } from "@/app/actions/watchlist";

export default function MyListGrid() {
  const [list, setList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadList = async () => {
    setIsLoading(true);
    const saved = await getWatchlist();
    // Transforma o formato do banco para o formato do MovieCard
    const formatted = saved.map(item => ({
      id: item.mediaId,
      title: item.title,
      thumbnailUrl: item.posterPath,
      duration: "HD", // Placeholder ou buscar real
      genre: item.type === "movie" ? "Filme" : "Série",
      rating: "98",
      type: item.type
    }));
    setList(formatted);
    setIsLoading(false);
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleExportWhatsApp = () => {
    const names = list.map(m => `• ${m.title}`).join('\n');
    const text = `🍿 *Minha Lista SFL Stream*:\n\n${names}\n\nAssista agora em: sflstream.com`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  if (isLoading) {
    return <div className="px-6 md:px-12 py-20 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">Carregando sua lista...</div>;
  }

  if (list.length === 0) {
    return (
      <div className="px-6 md:px-12 py-20 text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <Play className="w-8 h-8 text-gray-600" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Sua lista está vazia</h2>
        <p className="text-gray-500 max-w-sm font-bold">Adicione filmes e séries à sua lista para assisti-los mais tarde.</p>
        <button 
          onClick={() => window.location.href = "/dashboard"}
          className="bg-white text-black font-black px-8 py-3 rounded-xl hover:bg-brand-green transition-colors"
        >
          EXPLORAR CATÁLOGO
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 pb-20 space-y-10">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <p className="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] mb-1">Backup Sincronizado</p>
          <h3 className="text-sm font-bold text-gray-400">{list.length} Títulos salvos</h3>
        </div>
        <button 
          onClick={handleExportWhatsApp}
          className="flex items-center gap-2 bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-black font-black px-6 py-3 rounded-2xl transition-all border border-brand-green/20 group"
        >
          <MessageCircle className="w-4 h-4" />
          ENVIAR PARA WHATSAPP
        </button>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-10 md:gap-y-16">
        {list.map((movie) => (
          <div key={movie.id} className="w-[calc(50%-1rem)] md:w-[calc(33.33%-1rem)] lg:w-[calc(20%-1rem)]">
             <MovieCard movie={movie} initialInList={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
