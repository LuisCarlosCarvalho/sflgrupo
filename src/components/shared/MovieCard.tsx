"use client";

import { Play, Plus, ChevronDown, Check, Film } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { addToWatchlist, removeFromWatchlist } from "@/app/actions/watchlist";
import { getMovieVideos } from "@/lib/tmdb";
import TrailerModal from "@/components/dashboard/TrailerModal";

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: string;
    genre: string;
    rating: string;
    type?: string;
  };
  initialInList?: boolean;
}

export default function MovieCard({ movie, initialInList = false }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isInList, setIsInList] = useState(initialInList);
  const [isLoading, setIsLoading] = useState(false);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");

  useEffect(() => {
    setIsInList(initialInList);
  }, [initialInList]);

  const handleToggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isInList) {
        await removeFromWatchlist(movie.id);
        setIsInList(false);
      } else {
        await addToWatchlist({
          id: movie.id,
          title: movie.title,
          posterPath: movie.thumbnailUrl,
          type: movie.type || "movie",
        });
        setIsInList(true);
      }
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
        className="relative group min-w-[200px] md:min-w-[300px] h-[120px] md:h-[170px] transition-all duration-500 ease-out cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Base Image */}
        <img
          src={movie.thumbnailUrl}
          alt={movie.title}
          className="h-full w-full object-cover rounded-md group-hover:opacity-0 transition-opacity duration-300"
        />

        {/* Expanded Hover Card */}
        <div className={`
          absolute top-0 left-0 z-50 transition-all duration-500 ease-out invisible opacity-0
          group-hover:visible group-hover:opacity-100 group-hover:scale-125 group-hover:-translate-y-[4vw]
          w-full bg-black rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10
        `}>
          <div className="relative h-[120px] md:h-[150px] w-full">
            <img
              src={movie.thumbnailUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            
            <div className="absolute bottom-2 left-4">
              <h3 className="text-[10px] font-black uppercase italic tracking-tighter text-white drop-shadow-lg">
                {movie.title}
              </h3>
            </div>
          </div>
          
          <div className="p-4 space-y-4 bg-[#181818]">
            <div className="flex items-center gap-2">
              <Link 
                href={`/watch/${movie.id}`}
                className="bg-white rounded-full p-3 hover:bg-gray-200 transition transform hover:scale-110 active:scale-95 shadow-lg flex items-center justify-center"
                title="Assistir Agora"
              >
                <Play className="text-black fill-current w-5 h-5" />
              </Link>
              
              <button 
                onClick={handleOpenTrailer}
                className="border-2 border-white/40 rounded-full p-3 hover:border-brand-yellow hover:bg-brand-yellow/10 transition transform hover:scale-110 active:scale-95 text-brand-yellow flex items-center justify-center"
                title="Ver Trailer"
              >
                <Film className="w-5 h-5" />
              </button>

              <button 
                onClick={handleToggleWatchlist}
                disabled={isLoading}
                className={`border-2 rounded-full p-3 transition transform hover:scale-110 active:scale-95 flex items-center justify-center ${
                  isInList 
                    ? "bg-brand-green border-brand-green text-black shadow-[0_0_15px_#00a651]" 
                    : "border-white/40 text-white hover:border-white"
                } ${isLoading ? "opacity-50 cursor-wait" : ""}`}
                title={isInList ? "Remover da Lista" : "Adicionar à Minha Lista"}
              >
                {isInList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>
              
              <div className="ml-auto border-2 border-white/40 rounded-full p-3 hover:border-white transition flex items-center justify-center cursor-help">
                <ChevronDown className="text-white w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-brand-green font-black text-xs">{movie.rating}% Relevante</span>
                <span className="text-white/60 text-xs font-bold">{movie.duration}</span>
                <span className="border border-white/30 px-2 py-0.5 rounded text-[8px] font-black tracking-widest text-brand-blue border-brand-blue/40 uppercase">4K ULTRA</span>
              </div>
              
              <div className="flex items-center gap-2 text-[11px] text-white/80 font-bold uppercase tracking-tight">
                <span>{movie.genre}</span>
                <span className="w-1.5 h-1.5 bg-brand-green rounded-full shadow-[0_0_5px_#00a651]"></span>
                <span className="text-brand-yellow">Exclusivo SFL</span>
              </div>
            </div>
          </div>

          {/* Brand Glow Line */}
          <div className="h-1 flex">
            <div className="flex-1 bg-brand-green" />
            <div className="flex-1 bg-brand-yellow" />
            <div className="flex-1 bg-brand-blue" />
          </div>
        </div>
      </div>

      <TrailerModal 
        isOpen={isTrailerModalOpen}
        onClose={() => setIsTrailerModalOpen(false)}
        videoKey={trailerKey}
        title={movie.title}
      />
    </>
  );
}
