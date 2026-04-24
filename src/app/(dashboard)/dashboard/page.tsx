import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { 
  getTrendingMovies, 
  getTrendingSeries, 
  getKidsContent, 
  getHeroMovie,
  getPopularMovies,
  getPopularSeries,
  getAnimes,
  getDocumentaries
} from "@/lib/tmdb";
import DashboardHero from "@/components/dashboard/DashboardHero";
import MovieRow from "@/components/shared/MovieRow";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import MyListGrid from "@/components/dashboard/MyListGrid";
import LiveScoreboard from "@/components/dashboard/LiveScoreboard";
import { getWatchlist } from "@/app/actions/watchlist";
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

  // Busca os dados da TMDB e da Watchlist em paralelo, mas com tratamento de erro
  const [
    trendingMovies, 
    trendingSeries, 
    popularMovies,
    popularSeries,
    kidsContent, 
    animes,
    documentaries,
    watchlistData
  ] = await Promise.all([
    getTrendingMovies(),
    getTrendingSeries(),
    getPopularMovies(),
    getPopularSeries(),
    getKidsContent(),
    getAnimes(),
    getDocumentaries(),
    getWatchlist().catch(() => []), // Se o banco falhar, retorna lista vazia e não trava a página
  ]);

  const watchlistIds = new Set((watchlistData || []).map(item => item.mediaId));
  const isSports = category === "sports";

  // Escolher o Hero dinamicamente baseado na categoria (top 5 para o carrossel)
  let currentHeroArray = trendingMovies.slice(0, 5);
  if (category === "series") currentHeroArray = trendingSeries.slice(0, 5);
  if (category === "movies") currentHeroArray = trendingMovies.slice(0, 5);
  if (category === "trending") currentHeroArray = trendingMovies.slice(0, 5);

  return (
    <main 
      key={category} 
      className="min-h-screen bg-black text-white pb-20 selection:bg-brand-green selection:text-black animate-in fade-in duration-500"
    >
      <DashboardNavbar />
      
      {/* Hero Section */}
      {!isSports && category !== "mylist" && <DashboardHero movies={currentHeroArray as any} />}

      <div className={`relative z-20 space-y-8 ${(!isSports && category !== "mylist") ? "-mt-20" : "pt-32"}`}>
        
        {/* Lógica de Renderização Baseada na Categoria */}
        {category === "inicio" && (
          <>
            <MovieRow title="SFL Filmes em Destaque" movies={trendingMovies} glowColor="green" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Séries Populares" movies={trendingSeries} glowColor="blue" watchlistIds={watchlistIds} />
            
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

            <MovieRow title="SFL Animes" movies={animes} glowColor="yellow" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Documentários" movies={documentaries} glowColor="blue" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Conteúdo Kids" movies={kidsContent} glowColor="green" watchlistIds={watchlistIds} />
          </>
        )}

        {category === "series" && (
          <>
            <div className="px-6 md:px-12 mb-8">
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-brand-blue">Séries</h1>
            </div>
            <MovieRow title="SFL Populares" movies={popularSeries} glowColor="blue" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Tendências da Semana" movies={trendingSeries} glowColor="green" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Animes" movies={animes} glowColor="yellow" watchlistIds={watchlistIds} />
          </>
        )}

        {category === "movies" && (
          <>
            <div className="px-6 md:px-12 mb-8">
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-brand-green">Filmes</h1>
            </div>
            <MovieRow title="SFL Populares" movies={popularMovies} glowColor="green" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Tendências da Semana" movies={trendingMovies} glowColor="yellow" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Documentários" movies={documentaries} glowColor="blue" watchlistIds={watchlistIds} />
          </>
        )}

        {category === "sports" && (
          <div className="px-6 md:px-12 space-y-12">
            <div>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-4">
                SFL <span className="text-brand-green">SPORT'S</span>
              </h1>
              <p className="text-gray-400 max-w-xl font-bold">Onde a emoção acontece. Assista aos maiores eventos esportivos do mundo em tempo real.</p>
            </div>

            <LiveScoreboard />
          </div>
        )}

        {category === "trending" && (
          <>
            <div className="px-6 md:px-12 mb-8">
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-brand-yellow">Bombando</h1>
            </div>
            <MovieRow title="SFL Top 10 Filmes Hoje" movies={trendingMovies.slice(0, 10)} glowColor="yellow" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Top 10 Séries Hoje" movies={trendingSeries.slice(0, 10)} glowColor="blue" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Top 10 Animes Hoje" movies={animes.slice(0, 10)} glowColor="green" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Top 10 Documentários Hoje" movies={documentaries.slice(0, 10)} glowColor="yellow" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Top 10 Kids Hoje" movies={kidsContent.slice(0, 10)} glowColor="blue" watchlistIds={watchlistIds} />
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
