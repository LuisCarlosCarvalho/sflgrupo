"use client";

import { motion } from "framer-motion";
import { Play, Plus, ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useState } from "react";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  thumbnailUrl: string;
  genre: string;
  rating: string;
}

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  glowColor?: "blue" | "green" | "yellow";
}

export default function MovieCarousel({ title, movies, glowColor = "blue" }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 0);
    }
  };

  const glowStyles = {
    blue: "hover:shadow-[0_0_25px_rgba(74,144,226,0.5)] border-brand-blue/0 hover:border-brand-blue/50",
    green: "hover:shadow-[0_0_25px_rgba(0,166,81,0.5)] border-brand-green/0 hover:border-brand-green/50",
    yellow: "hover:shadow-[0_0_25px_rgba(248,231,28,0.5)] border-brand-yellow/0 hover:border-brand-yellow/50",
  };

  return (
    <div className="py-8 space-y-4 group/carousel">
      <div className="flex items-center justify-between px-6 md:px-12">
        <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <span className={`w-1.5 h-8 rounded-full bg-brand-${glowColor}`} />
          {title}
        </h2>
        <Link href="#" className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
          Ver Tudo
        </Link>
      </div>

      <div className="relative px-4 md:px-10">
        {/* Navigation Arrows */}
        {showLeftArrow && (
          <button 
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 bg-black/60 p-4 rounded-full backdrop-blur-md border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden md:block"
          >
            <ChevronLeft className="text-white w-6 h-6" />
          </button>
        )}
        
        <button 
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 bg-black/60 p-4 rounded-full backdrop-blur-md border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-opacity hidden md:block"
        >
          <ChevronRight className="text-white w-6 h-6" />
        </button>

        {/* Scrollable Area */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-2 py-4"
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              whileHover={{ scale: 1.1, zIndex: 50 }}
              className={`
                relative flex-none w-[180px] md:w-[300px] h-[110px] md:h-[170px] 
                rounded-xl overflow-hidden cursor-pointer snap-start
                border-2 transition-all duration-300 ${glowStyles[glowColor]}
              `}
            >
              <img 
                src={movie.thumbnailUrl} 
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              
              {/* Card Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                <p className="text-white font-black text-xs md:text-sm uppercase tracking-tighter line-clamp-1">
                  {movie.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Play className="w-3 h-3 md:w-4 md:h-4 text-brand-yellow fill-current" />
                  <span className="text-[10px] md:text-xs text-brand-green font-bold">{movie.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
