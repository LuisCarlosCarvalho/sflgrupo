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
          
          <div className="p-4 space-y-3 bg-[#141414]">
            <div className="flex items-center gap-2">
              <Link 
                href={`/watch/${movie.id}`}
                className="bg-white rounded-full p-2 hover:bg-gray-200 transition transform active:scale-90"
              >
                <Play className="text-black fill-current w-3 h-3" />
              </Link>
              
              <button 
                onClick={handleOpenTrailer}
                className="border border-white/40 rounded-full p-2 hover:border-white hover:bg-white/10 transition transform active:scale-90 text-brand-yellow"
                title="Ver Trailer"
              >
                <Film className="w-3 h-3" />
              </button>

              <button 
                onClick={handleToggleWatchlist}
                disabled={isLoading}
                className={`border rounded-full p-2 transition transform active:scale-90 ${
                  isInList ? "bg-brand-green border-brand-green text-black shadow-[0_0_10px_#00a651]" : "border-white/40 text-white hover:border-white"
                } ${isLoading ? "opacity-50 cursor-wait" : ""}`}
              >
                {isInList ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
              </button>
              
              <div className="ml-auto border border-white/40 rounded-full p-2 hover:border-white transition">
                <ChevronDown className="text-white w-3 h-3" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-bold">
                <span className="text-brand-green">{movie.rating} de Relevância</span>
                <span className="text-gray-400">{movie.duration}</span>
                <span className="border border-white/40 px-1 rounded-[2px] text-[7px] text-brand-blue border-brand-blue/30">4K ULTRA</span>
              </div>
              
              <div className="flex items-center gap-2 text-[10px] text-white font-medium">
                <span>{movie.genre}</span>
                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
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
