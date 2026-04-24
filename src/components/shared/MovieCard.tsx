"use client";

import { Play, Plus, Check, ListPlus, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { toggleWatchlist } from "@/app/actions/watchlist";
import { getMovieVideos } from "@/lib/tmdb";
import TrailerModal from "@/components/dashboard/TrailerModal";
import InfoModal from "@/components/dashboard/InfoModal";

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: string;
    genre: string;
    rating: string;
    type?: string;
    description?: string;
    backdropUrl?: string;
  };
  initialInList?: boolean;
}

export default function MovieCard({ movie, initialInList = false }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInList, setIsInList] = useState(initialInList);
  const [isLoading, setIsLoading] = useState(false);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsInList(initialInList);
  }, [initialInList]);

  const handleToggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await toggleWatchlist({
        id: movie.id,
        title: movie.title,
        posterPath: movie.thumbnailUrl,
        type: movie.type || "movie",
      });
      setIsInList(result.added);
    } catch (error) {
      console.error("Watchlist Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTrailer = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const videos = await getMovieVideos(movie.id, movie.type as any || "movie");
    const trailer = videos[0];
    
    if (trailer) {
      setTrailerKey(trailer.key);
      setIsTrailerModalOpen(true);
    } else {
      alert("Trailer não disponível para este título.");
    }
  };

  return (
    <>
      <div 
        className="relative group min-w-[140px] md:min-w-[180px] w-[140px] md:w-[180px] flex flex-col gap-3 transition-all duration-300 ease-out cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Poster Image Container */}
        <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg border border-white/5 group-hover:border-white/20 transition-colors">
          <img
            src={movie.thumbnailUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Hover Overlay */}
          <div className={`
            absolute inset-0 z-10 transition-all duration-300
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}>
            <div className="absolute inset-0 bg-black/50" />

            {/* Left Button: Large Play Triangle */}
            <button 
              onClick={handleOpenTrailer}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2"
              title="Ver Trailer"
            >
              <Play className="w-14 h-14 text-white/80 fill-current hover:text-white transition-all transform hover:scale-110 active:scale-95 drop-shadow-xl" />
            </button>

            {/* Right Button: List Plus */}
            <button 
              onClick={handleToggleWatchlist}
              disabled={isLoading}
              className={`absolute top-2 right-2 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shadow-lg backdrop-blur-sm ${
                isInList 
                  ? "border-brand-yellow text-brand-yellow bg-brand-yellow/20" 
                  : "border-white/40 text-white/80 hover:border-white hover:text-white hover:bg-white/20"
              } ${isLoading ? "opacity-50 cursor-wait" : ""}`}
              title={isInList ? "Remover da Lista" : "Adicionar à Minha Lista"}
            >
              {isInList ? <Check className="w-5 h-5" /> : <ListPlus className="w-5 h-5" />}
            </button>
          </div>
          
          {/* TMDB Style Rating Circle (overlapping bottom edge) */}
          <div className="absolute -bottom-1 left-2 w-10 h-10 bg-black rounded-full border-[3px] border-green-500 flex items-center justify-center shadow-lg z-20">
            <span className="text-white text-xs font-bold">{movie.rating}<span className="text-[8px]">%</span></span>
          </div>
        </div>

        {/* Text Details Below Poster */}
        <div className="flex flex-col pt-2 px-1">
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-tight hover:text-brand-green transition-colors">
            {movie.title}
          </h3>
          <span className="text-gray-400 text-xs mt-1">
            {movie.duration} • {movie.genre}
          </span>
        </div>
      </div>

      <TrailerModal 
        isOpen={isTrailerModalOpen}
        onClose={() => setIsTrailerModalOpen(false)}
        videoKey={trailerKey}
        title={movie.title}
        movieId={movie.id}
      />
    </>
  );
}
