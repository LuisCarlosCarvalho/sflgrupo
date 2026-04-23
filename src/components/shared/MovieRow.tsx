"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import MovieCard from "./MovieCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface MovieRowProps {
  title: string;
  movies: any[];
  glowColor?: "yellow" | "green" | "blue";
  watchlistIds?: Set<string>;
}

export default function MovieRow({ title, movies, glowColor = "green", watchlistIds = new Set() }: MovieRowProps) {
  const glowClasses = {
    yellow: "group-hover:shadow-brand-yellow/40",
    green: "group-hover:shadow-brand-green/40",
    blue: "group-hover:shadow-brand-blue/40",
  };

  return (
    <div className="py-6 space-y-4">
      <h2 className="text-xl md:text-2xl font-black text-white px-6 md:px-12 uppercase tracking-tighter italic">
        {title}
      </h2>

      <div className="px-6 md:px-12">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="movie-swiper !overflow-visible"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id} className="!h-auto">
              <div className={`transition-all duration-300 group rounded-xl overflow-hidden hover:scale-105 hover:shadow-[0_0_20px] ${glowClasses[glowColor]}`}>
                <MovieCard 
                  movie={movie} 
                  initialInList={watchlistIds.has(movie.id.toString())} 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
