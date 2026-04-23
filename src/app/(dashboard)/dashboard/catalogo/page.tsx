import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getPopularMovies, getPopularSeries, getKidsContent } from "@/lib/tmdb";
import { MOVIES } from "@/lib/movies";
import MovieRow from "@/components/shared/MovieRow";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { Tv, Trophy, Flame } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Verificação de usuário ativo via Prisma Singleton
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" }
  });

  if (!user?.isActive) redirect("/aguardando-ativacao");

  // Fetching dynamic content
  const [popularMovies, popularSeries, kidsContent, watchlist] = await Promise.all([
    getPopularMovies(),
    getPopularSeries(),
    getKidsContent(),
    getWatchlist().catch(() => []),
  ]);

  const watchlistIds = new Set((watchlist || []).map(item => item.mediaId));

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <DashboardNavbar />
      
      <header className="pt-32 px-6 md:px-12 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-brand-green rounded-full shadow-[0_0_20px_#00a651]" />
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              CATÁLOGO <span className="text-brand-yellow">COMPLETO</span>
            </h1>
            <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em] mt-2">SFL STREAM PREMIUM</p>
          </div>
        </div>
      </header>

      <div className="space-y-6">
        {/* Requirement: Filmes */}
        <MovieRow title="Filmes" movies={popularMovies} glowColor="green" watchlistIds={watchlistIds} />

        {/* Requirement: Séries */}
        <MovieRow title="Séries" movies={popularSeries} glowColor="blue" watchlistIds={watchlistIds} />

        {/* TV AO VIVO Grid */}
        <section className="px-6 md:px-12 py-10">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
            <Tv className="text-brand-blue" /> TV AO VIVO
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[3, 4].map((id) => {
              const movie = MOVIES.find(m => m.id === id.toString());
              return (
                <Link 
                  key={id} 
                  href={`/watch/${id}`}
                  className="aspect-video bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group hover:border-brand-blue hover:bg-brand-blue/5 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-gray-400 group-hover:text-white font-black italic transition-colors text-center px-4">
                    {movie?.title || `SFL CHANNEL ${id}`}
                  </span>
                </Link>
              );
            })}
            {[1, 2, 5, 6].map((i) => (
               <div key={i} className="aspect-video bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group opacity-50 grayscale cursor-not-allowed relative overflow-hidden">
                  <span className="text-gray-600 font-black italic text-sm">BREVE</span>
               </div>
            ))}
          </div>
        </section>

        {/* Sports Highlight */}
        <section className="px-6 md:px-12 py-8">
          <Link href="/watch/1" className="block">
            <div className="relative h-72 md:h-80 w-full rounded-[2.5rem] overflow-hidden border border-brand-green/30 group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2000" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
                alt="Esportes"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
              <div className="relative h-full flex flex-col justify-center p-12 space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy className="text-brand-yellow w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest text-brand-yellow">Arena SFL Sports</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">
                  VIVA A EMOÇÃO <br />
                  <span className="text-brand-green">AO VIVO AGORA</span>
                </h2>
                <button className="bg-brand-green text-black font-black px-10 py-4 rounded-xl w-fit group-hover:bg-brand-yellow transition-all transform active:scale-95 shadow-xl shadow-brand-green/20">
                  ASSISTIR AGORA
                </button>
              </div>
            </div>
          </Link>
        </section>

        {/* Requirement: Kids */}
        <MovieRow title="Kids" movies={kidsContent} glowColor="yellow" />
      </div>
    </main>
  );
}
