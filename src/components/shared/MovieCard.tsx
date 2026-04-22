"use client";

import { Play, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    thumbnailUrl: string;
    duration: string;
    genre: string;
    rating: string;
  };
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative group min-w-[200px] md:min-w-[280px] h-[120px] md:h-[160px] transition-all duration-300 ease-in-out cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={movie.thumbnailUrl}
        alt={movie.title}
        className="h-full w-full object-cover rounded-md group-hover:opacity-0 delay-300"
      />

      <div className={`
        absolute top-0 z-20 transition-all duration-300 invisible opacity-0
        group-hover:visible group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-y-[2vw]
        w-full h-full glass-panel rounded-lg movie-shadow
      `}>
        <img
          src={movie.thumbnailUrl}
          alt={movie.title}
          className="h-[120px] md:h-[140px] w-full object-cover rounded-t-lg"
        />
        
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full p-1 hover:bg-gray-200 transition">
              <Play className="text-black fill-current w-4 h-4" />
            </div>
            <div className="border border-white/40 rounded-full p-1 hover:border-white transition">
              <Plus className="text-white w-4 h-4" />
            </div>
            <div className="ml-auto border border-white/40 rounded-full p-1 hover:border-white transition">
              <ChevronDown className="text-white w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-brand-green">{movie.rating} Indicado</span>
            <span className="text-white">{movie.duration}</span>
            <span className="border border-white/40 px-1 rounded text-[8px]">HD</span>
          </div>

          <div className="text-xs text-gray-300">
            {movie.genre}
          </div>
        </div>
      </div>
    </div>
  );
}
