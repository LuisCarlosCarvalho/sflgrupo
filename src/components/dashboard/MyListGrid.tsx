"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/shared/MovieCard";
import { Play, Share2, MessageCircle } from "lucide-react";
import { getWatchlist, clearWatchlist } from "@/app/actions/watchlist";
import { useSession } from "next-auth/react";

interface MovieListItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  genre: string;
  extra: string;
  rating: string;
  type: string;
}

export default function MyListGrid() {
  const { data: session } = useSession();
  const [list, setList] = useState<MovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadList = async () => {
      setIsLoading(true);
      const saved = await getWatchlist();
      const formatted: MovieListItem[] = saved.map(item => {
        let grade = "Série";
        let extra = "";
        
        if (item.type === "movie") grade = "Filme";
        if (item.type === "sports") {
          grade = "Sport's";
          try {
            const meta = JSON.parse(item.metadata || "{}");
            if (meta.date) {
              const dateStr = meta.date.split('-').reverse().join('/');
              extra = `\n• Data: ${dateStr} às ${meta.time || '--:--'}\n• Transmissão: ${meta.broadcast?.join(', ') || 'A definir'}`;
            }
          } catch (e) {
            console.error("Erro ao parsear metadata de sports", e);
          }
        }
        
        // Lógica para detectar Anime ou Kids com base no metadata (que salva o gênero)
        const genreLower = (item.metadata || "").toLowerCase();
        if (item.type !== "sports") {
          if (genreLower.includes("anime") || item.title.toLowerCase().includes("bleach") || item.title.toLowerCase().includes("naruto")) {
            grade = "Anime";
          } else if (genreLower.includes("kids") || genreLower.includes("infantil") || genreLower.includes("animação")) {
            grade = "Kids";
          }
        }

        return {
          id: item.mediaId,
          title: item.title,
          thumbnailUrl: item.posterPath,
          duration: "HD", 
          genre: grade,
          extra: extra, // Campo novo para o WhatsApp
          rating: "98",
          type: item.type
        };
      });
      if (isMounted) {
        setList(formatted);
        setIsLoading(false);
      }
    };

    loadList();
    return () => { isMounted = false; };
  }, []);

  const handleExportWhatsApp = async () => {
    const userWhatsapp = session?.user?.whatsapp;

    if (!userWhatsapp) {
      alert("Seu número de WhatsApp não está cadastrado. Por favor, entre em contato com o suporte.");
      return;
    }

    if (list.length === 0) return;

    const userName = session?.user?.name || "Cliente";
    const itemsList = list.map((m, index) => {
      let itemText = `${index + 1}. ${m.title} – Grade: ${m.genre}`;
      if (m.extra) {
        itemText += m.extra;
      }
      return itemText;
    }).join('\n\n');
    
    const text = `*--- MINHA LISTA SFL STREAM ---*\n*Play Lista SFL (${userName}):*\n\n${itemsList}\n\nAssista agora em sua aplicação: *SFL* miTV`;
    const encodedText = encodeURIComponent(text);
    
    // Limpa o número (remove tudo que não for dígito)
    let cleanNumber = userWhatsapp.replace(/\D/g, '');
    if (cleanNumber.startsWith('00')) cleanNumber = cleanNumber.substring(2);

    // Abre o WhatsApp
    window.open(`https://wa.me/${cleanNumber}?text=${encodedText}`, '_blank');

    // Limpa a lista no banco e na tela após um pequeno delay para não atrapalhar o redirecionamento
    setTimeout(async () => {
      try {
        await clearWatchlist();
        setList([]);
      } catch (err) {
        console.error("Erro ao limpar lista:", err);
      }
    }, 1000);
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
