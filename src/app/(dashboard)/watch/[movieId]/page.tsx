import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MOVIES } from "@/lib/movies";
import { getMovieDetails } from "@/lib/tmdb";
import VideoPlayer from "@/components/shared/VideoPlayer";

interface WatchPageProps {
  params: Promise<{
    movieId: string;
  }>;
}

export default async function WatchPage({ params }: WatchPageProps) {
  const session = await getServerSession(authOptions);
  const resolvedParams = await params;
  const movieId = resolvedParams.movieId;

  if (!session) redirect("/login");
  
  // @ts-ignore
  if (!session.user?.isActive) redirect("/aguardando-ativacao");

  // 1. Tenta buscar na lista estática (Esportes / TV Ao Vivo)
  let movie = MOVIES.find((m) => m.id === movieId);
  let videoUrl = movie?.videoUrl || "";
  let title = movie?.title || "Carregando...";

  // 2. Se não for estático, tenta buscar na TMDB
  if (!movie) {
    const tmdbMovie = await getMovieDetails(movieId);
    if (tmdbMovie) {
      title = tmdbMovie.title;
      // Para demonstração, usamos um vídeo placeholder se for TMDB
      videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; 
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <main className="bg-black min-h-screen">
      <VideoPlayer url={videoUrl} title={title} />
    </main>
  );
}
