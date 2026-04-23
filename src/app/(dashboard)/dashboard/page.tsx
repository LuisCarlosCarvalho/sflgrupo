import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { 
  getTrendingMovies, 
  getTrendingSeries, 
  getKidsContent, 
  getHeroMovie,
  getPopularMovies,
  getPopularSeries
} from "@/lib/tmdb";
import DashboardHero from "@/components/dashboard/DashboardHero";
import MovieRow from "@/components/shared/MovieRow";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import MyListGrid from "@/components/dashboard/MyListGrid";
import { Tv, Trophy, Play } from "lucide-react";
import { MOVIES } from "@/lib/movies";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // @ts-ignore
  if (session.user?.isActive === false) {
    redirect("/aguardando-ativacao");
  }

  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category || "inicio";

  const [
    trendingMovies, 
    trendingSeries, 
    popularMovies,
    popularSeries,
    kidsContent, 
    heroMovie,
    watchlist
  ] = await Promise.all([
    getTrendingMovies(),
    getTrendingSeries(),
    getPopularMovies(),
    getPopularSeries(),
    getKidsContent(),
    getHeroMovie(),
    getWatchlist(),
  ]);

  const watchlistIds = new Set(watchlist.map(item => item.mediaId));
  const isSports = category === "sports";

  return (
    <main className="min-h-screen bg-black text-white pb-20 selection:bg-brand-green selection:text-black">
      <DashboardNavbar />
      
      {/* Hero Section */}
      {!isSports && <DashboardHero movie={heroMovie as any} />}

      <div className={`relative z-20 space-y-8 ${!isSports ? "-mt-20" : "pt-24"}`}>
        
        {/* Lógica de Renderização Baseada na Categoria */}
        {category === "inicio" && (
          <>
            <MovieRow title="Filmes em Destaque" movies={trendingMovies} glowColor="green" watchlistIds={watchlistIds} />
            <MovieRow title="Séries Populares" movies={trendingSeries} glowColor="blue" watchlistIds={watchlistIds} />
            
            {/* Live TV & Sports Highlight Row */}
            <section className="px-6 md:px-12 py-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group relative h-48 rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-br from-brand-blue/20 to-black hover:border-brand-blue/40 transition-all cursor-pointer">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957')] bg-cover opacity-30 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative h-full flex flex-col justify-end p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center">
                        <Tv className="w-4 h-4 text-brand-blue" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Ao Vivo agora</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">TV AO VIVO</h3>
                  </div>
                </div>
                <div className="group relative h-48 rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-br from-brand-green/20 to-black hover:border-brand-green/40 transition-all cursor-pointer">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070')] bg-cover opacity-30 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative h-full flex flex-col justify-end p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-brand-green/20 flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-brand-green" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-brand-green">Esportes SFL</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter">ARENA SPORTS</h3>
                  </div>
                </div>
              </div>
            </section>

            <MovieRow title="Conteúdo Kids" movies={kidsContent} glowColor="yellow" watchlistIds={watchlistIds} />
          </>
        )}

        {category === "series" && (
          <>
            <div className="px-6 md:px-12 mb-8">
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-brand-blue">Séries</h1>
            </div>
            <MovieRow title="Populares na SFL" movies={popularSeries} glowColor="blue" watchlistIds={watchlistIds} />
            <MovieRow title="Tendências da Semana" movies={trendingSeries} glowColor="green" watchlistIds={watchlistIds} />
          </>
        )}

        {category === "movies" && (
          <>
            <div className="px-6 md:px-12 mb-8">
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-brand-green">Filmes</h1>
            </div>
            <MovieRow title="Populares na SFL" movies={popularMovies} glowColor="green" watchlistIds={watchlistIds} />
            <MovieRow title="Tendências da Semana" movies={trendingMovies} glowColor="yellow" watchlistIds={watchlistIds} />
          </>
        )}

        {category === "sports" && (
          <div className="px-6 md:px-12 space-y-12">
            <div>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">
                SFL <span className="text-brand-green">SPORT'S</span>
              </h1>
              <p className="text-gray-400 max-w-xl font-bold">Onde a emoção acontece. Assista aos maiores eventos esportivos do mundo em alta definição.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MOVIES.filter(m => m.genre === "Esporte" || m.genre === "Basquete").map(match => (
                <div key={match.id} className="group relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:border-brand-green transition-all">
                   <img src={match.thumbnailUrl} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                   <div className="absolute bottom-0 p-6 w-full">
                      <span className="bg-red-600 text-[10px] font-black px-2 py-0.5 rounded-sm mb-2 inline-block">AO VIVO</span>
                      <h4 className="text-lg font-black uppercase tracking-tighter">{match.title}</h4>
                      <button className="mt-4 flex items-center gap-2 text-[10px] font-black text-brand-green hover:text-white transition-colors">
                        <Play className="w-3 h-3 fill-current" /> ASSISTIR AGORA
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {category === "trending" && (
          <>
            <div className="px-6 md:px-12 mb-8">
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-brand-yellow">Bombando</h1>
            </div>
            <MovieRow title="Filmes em Alta" movies={trendingMovies} glowColor="yellow" watchlistIds={watchlistIds} />
            <MovieRow title="Séries em Alta" movies={trendingSeries} glowColor="blue" watchlistIds={watchlistIds} />
          </>
        )}

        {category === "mylist" && (
           <>
            <div className="px-6 md:px-12 mb-8">
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white">Minha <span className="text-brand-green">Lista</span></h1>
            </div>
            <MyListGrid />
           </>
        )}
      </div>

      {/* Decorative Glows */}
      <div className="fixed top-1/2 left-0 w-96 h-96 bg-brand-green/5 blur-[150px] -z-10 rounded-full" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[150px] -z-10 rounded-full" />
    </main>
  );
}
