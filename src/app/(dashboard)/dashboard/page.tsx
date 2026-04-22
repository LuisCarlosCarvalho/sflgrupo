import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navbar from "@/components/shared/Navbar";
import MovieCarousel from "@/components/shared/MovieCarousel";
import { Play, Info, Sparkles } from "lucide-react";
import { getMovies, endpoints } from "@/lib/tmdb";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // @ts-ignore
  if (session.user?.isActive === false) {
    redirect("/aguardando-ativacao");
  }

  // Fetching all categories in parallel (Server Side)
  const [popularMovies, popularSeries, kidsMovies, trendingAll] = await Promise.all([
    getMovies(endpoints.popular),
    getMovies(endpoints.series),
    getMovies(endpoints.kids),
    getMovies(endpoints.trending),
  ]);

  // Placeholders for TV and Sports
  const liveChannels = [
    { id: 101, title: "SFL Sports HD", thumbnailUrl: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=800", rating: "100% AO VIVO", genre: "LIVE" },
    { id: 102, title: "Premiere 1", thumbnailUrl: "https://images.unsplash.com/photo-1595435063435-0c58e57999dc?q=80&w=800", rating: "99% AO VIVO", genre: "LIVE" },
    { id: 103, title: "Combate", thumbnailUrl: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=800", rating: "98% AO VIVO", genre: "LIVE" },
    { id: 104, title: "Disney Channel", thumbnailUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800", rating: "97% AO VIVO", genre: "LIVE" },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand-green selection:text-black">
      <Navbar />
      
      {/* Dynamic Hero Banner (First Trending Item) */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={trendingAll[0]?.thumbnailUrl || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2000"} 
            className="w-full h-full object-cover scale-105" 
            alt="Hero Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 p-8 md:p-24 space-y-6 max-w-3xl">
          <div className="flex items-center gap-2 text-brand-yellow font-black text-xs md:text-sm uppercase tracking-widest animate-pulse">
            <Sparkles className="w-4 h-4" />
            Destaque da Semana
          </div>
          <h1 className="text-4xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
            {trendingAll[0]?.title || "Conteúdo SFL"}
          </h1>
          <p className="text-gray-300 text-sm md:text-xl max-w-xl line-clamp-3">
            Aproveite o melhor do entretenimento com a velocidade e qualidade que só o SFL Stream oferece. Ative sua conta e comece a assistir agora.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-white text-black px-10 py-4 rounded-xl font-black flex items-center gap-3 hover:bg-brand-yellow transition-all transform hover:scale-105">
              <Play className="fill-current w-6 h-6" /> ASSISTIR AGORA
            </button>
            <button className="bg-white/10 backdrop-blur-xl text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 border border-white/10 hover:bg-white/20 transition-all">
              <Info className="w-6 h-6" /> MAIS INFORMAÇÕES
            </button>
          </div>
        </div>
      </div>

      {/* Categories Rows */}
      <div className="pb-40 -mt-32 relative z-30">
        <MovieCarousel 
          title="Filmes Populares" 
          movies={popularMovies} 
          glowColor="green"
        />
        
        <MovieCarousel 
          title="Séries de Sucesso" 
          movies={popularSeries} 
          glowColor="blue"
        />

        <div className="py-8 bg-brand-yellow/5 border-y border-brand-yellow/10">
          <MovieCarousel 
            title="TV AO VIVO & ESPORTES" 
            movies={liveChannels} 
            glowColor="yellow"
          />
        </div>

        <MovieCarousel 
          title="Universo Kids" 
          movies={kidsMovies} 
          glowColor="green"
        />
        
        <MovieCarousel 
          title="Recentemente Adicionados" 
          movies={trendingAll.slice(5)} 
          glowColor="blue"
        />
      </div>
    </div>
  );
}
