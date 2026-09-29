import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { 
  getTrendingMovies, 
  getTrendingSeries, 
  getKidsContent, 
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
import RecentUploads from "@/components/dashboard/RecentUploads";
import NewsSection from "@/components/dashboard/NewsSection";

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
    watchlistData,
    user
  ] = await Promise.all([
    getTrendingMovies(),
    getTrendingSeries(),
    getPopularMovies(),
    getPopularSeries(),
    getKidsContent(),
    getAnimes(),
    getDocumentaries(),
    getWatchlist().catch(() => []), // Se o banco falhar, retorna lista vazia e não trava a página
    import("@/lib/prisma").then(m => m.prisma.user.findUnique({
      where: { id: session.user.id },
      select: { favoriteTeam: true }
    }))
  ]);

  const watchlistIds = new Set((watchlistData || []).map((item: { mediaId: string }) => item.mediaId));
  const isSports = category === "sports";

  // Escolher o Hero dinamicamente baseado na categoria (top 5 para o carrossel)
  let currentHeroArray = trendingMovies.slice(0, 5);
  if (category === "series") currentHeroArray = trendingSeries.slice(0, 5);
  if (category === "movies") currentHeroArray = trendingMovies.slice(0, 5);
  if (category === "trending") currentHeroArray = trendingMovies.slice(0, 5);

  return (
    <main 
      key={category} 
      className="min-h-screen bg-black text-white pb-20 selection:bg-brand-green selection:text-black animate-in fade-in duration-500 overflow-x-hidden w-full"
    >
      <DashboardNavbar />
      
      {/* Hero Section */}
      {!isSports && category !== "mylist" && <DashboardHero movies={currentHeroArray} />}

      <div className={`relative z-20 space-y-8 ${(!isSports && category !== "mylist") ? "-mt-12 md:-mt-20" : "pt-24 md:pt-32"}`}>
        
        {/* Lógica de Renderização Baseada na Categoria */}
        {category === "inicio" && (
          <>
            <RecentUploads watchlistIds={watchlistIds} />
            <MovieRow title="SFL Filmes em Destaque" movies={trendingMovies} glowColor="green" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Séries Populares" movies={trendingSeries} glowColor="blue" watchlistIds={watchlistIds} />
            
            <MovieRow title="SFL Animes" movies={animes} glowColor="yellow" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Documentários" movies={documentaries} glowColor="blue" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Conteúdo Kids" movies={kidsContent} glowColor="green" watchlistIds={watchlistIds} />
          </>
        )}


        {category === "series" && (
          <>
            <div className="px-4 md:px-12 mb-8 mt-6 md:mt-0">
              <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-brand-blue">Séries</h1>
            </div>
            <MovieRow title="SFL Populares" movies={popularSeries} glowColor="blue" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Tendências da Semana" movies={trendingSeries} glowColor="green" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Animes" movies={animes} glowColor="yellow" watchlistIds={watchlistIds} />
          </>
        )}

        {category === "movies" && (
          <>
            <div className="px-4 md:px-12 mb-8 mt-6 md:mt-0">
              <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-brand-green">Filmes</h1>
            </div>
            <MovieRow title="SFL Populares" movies={popularMovies} glowColor="green" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Tendências da Semana" movies={trendingMovies} glowColor="yellow" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Documentários" movies={documentaries} glowColor="blue" watchlistIds={watchlistIds} />
          </>
        )}

        {category === "sports" && (() => {
          // Temporariamente buscar o user de novo aqui (poderia ser feito no início do componente)
          // Mas como estamos no JSX, o Next.js lida bem.
          return (
            <div className="px-2 sm:px-4 md:px-12 space-y-8 md:space-y-12 mt-6 md:mt-0">
              <div className="px-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
                <div>
                  <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-2 md:mb-4">
                    SFL <span className="text-brand-green">SPORT&apos;S</span>
                  </h1>
                  <p className="text-gray-400 text-sm md:text-base max-w-xl font-bold">
                    Onde a emoção acontece. Assista aos maiores eventos esportivos do mundo em tempo real.
                  </p>
                </div>

                {/* Team Alert Box (Right Side) */}
                {user?.favoriteTeam && (() => {
                  const teamLogos: Record<string, string> = {
                    "Palmeiras": "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg",
                    "Flamengo": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg",
                    "São Paulo": "https://upload.wikimedia.org/wikipedia/commons/4/4b/S%C3%A3o_Paulo_Futebol_Clube.png",
                    "Corinthians": "https://upload.wikimedia.org/wikipedia/en/5/5a/Sport_Club_Corinthians_Paulista_crest.svg",
                    "Real Madrid": "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
                    "Barcelona": "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
                  };
                  const logo = teamLogos[user.favoriteTeam] || "https://upload.wikimedia.org/wikipedia/commons/a/ad/Football_in_flat_style.svg";

                  return (
                    <div className="glass-panel p-4 rounded-2xl border-white/5 bg-gradient-to-r from-brand-green/10 to-transparent min-w-[300px] w-full md:w-auto relative overflow-hidden group hover:border-brand-green/30 transition-all">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/20 blur-[40px] rounded-full group-hover:bg-brand-green/30 transition-all" />
                      <p className="text-[10px] font-black text-brand-green uppercase tracking-widest flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Alerta Time do Coração
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-black/50 border border-white/10 flex items-center justify-center shadow-xl p-2">
                          <img src={logo} alt={user.favoriteTeam} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tighter">
                            O {user.favoriteTeam} joga hoje!
                          </p>
                          <p className="text-xs text-brand-yellow font-bold mt-0.5">
                            Libertadores • 21:30
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
                            Transmissão: ESPN
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <LiveScoreboard />
            </div>
          );
        })()}

        {category === "trending" && (
          <>
            <div className="px-4 md:px-12 mb-8 mt-6 md:mt-0">
              <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-brand-yellow">Bombando</h1>
            </div>
            <RecentUploads watchlistIds={watchlistIds} />
            <MovieRow title="SFL Top 10 Filmes Hoje" movies={trendingMovies.slice(0, 10)} glowColor="yellow" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Top 10 Séries Hoje" movies={trendingSeries.slice(0, 10)} glowColor="blue" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Top 10 Animes Hoje" movies={animes.slice(0, 10)} glowColor="green" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Top 10 Documentários Hoje" movies={documentaries.slice(0, 10)} glowColor="yellow" watchlistIds={watchlistIds} />
            <MovieRow title="SFL Top 10 Kids Hoje" movies={kidsContent.slice(0, 10)} glowColor="blue" watchlistIds={watchlistIds} />
          </>
        )}

        {category === "news" && (
           <div className="pt-6">
             <NewsSection />
           </div>
        )}

        {category === "mylist" && (
           <>
            <div className="px-4 md:px-12 mb-8 mt-6 md:mt-0">
              <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white">Minha <span className="text-brand-green">Lista</span></h1>
            </div>
            <MyListGrid />
           </>
        )}
      </div>

      {/* Decorative Glows */}
      <div className="fixed top-1/2 left-0 w-[30vw] h-[30vw] bg-brand-green/5 blur-[150px] -z-10 rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[40vw] h-[40vw] bg-brand-blue/5 blur-[150px] -z-10 rounded-full pointer-events-none" />
    </main>

  );
}
