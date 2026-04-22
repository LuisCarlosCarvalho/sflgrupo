import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MOVIES } from "@/lib/movies";
import VideoPlayer from "@/components/shared/VideoPlayer";

interface WatchPageProps {
  params: {
    movieId: string;
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/");
  
  // @ts-ignore
  if (!session.user?.isActive) redirect("/aguardando-ativacao");

  const movie = MOVIES.find((m) => m.id === params.movieId);

  if (!movie) {
    redirect("/dashboard");
  }

  return (
    <main className="bg-black min-h-screen">
      <VideoPlayer url={movie.videoUrl} title={movie.title} />
    </main>
  );
}
