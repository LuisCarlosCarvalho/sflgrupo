"use client";

import { Play, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

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
    <Link 
      href={`/watch/${movie.id}`}
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
        w-full bg-black rounded-xl overflow-hidden movie-shadow border border-white/10
        group-hover:shadow-[0_0_20px_rgba(0,166,81,0.3)] /* Green glow on hover */
      `}>
        <div className="relative h-[120px] md:h-[150px] w-full">
          <img
            src={movie.thumbnailUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="p-4 space-y-3 bg-[#141414]">
          <div className="flex items-center gap-2">
            <button className="bg-white rounded-full p-2 hover:bg-gray-200 transition transform active:scale-90">
              <Play className="text-black fill-current w-3 h-3" />
            </button>
            <button className="border border-white/40 rounded-full p-2 hover:border-white transition transform active:scale-90">
              <Plus className="text-white w-3 h-3" />
            </button>
            <div className="ml-auto border border-white/40 rounded-full p-2 hover:border-white transition">
              <ChevronDown className="text-white w-3 h-3" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="text-brand-green">{movie.rating} de Relevância</span>
              <span className="text-gray-400">{movie.duration}</span>
              <span className="border border-white/40 px-1 rounded-[2px] text-[7px]">4K</span>
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
    </Link>
  );
}
