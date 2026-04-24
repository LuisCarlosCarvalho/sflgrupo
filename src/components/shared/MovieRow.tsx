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

export default function MovieRow({ title, movies, watchlistIds = new Set() }: MovieRowProps) {
  return (
    <div className="py-4 space-y-4">
      <h2 className="text-xl font-bold text-white px-6 md:px-12">
        {title}
      </h2>

      <div className="px-6 md:px-12 !overflow-visible">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          slidesPerView={2.5}
          breakpoints={{
            640: { slidesPerView: 3.5 },
            768: { slidesPerView: 4.5 },
            1024: { slidesPerView: 5.5 },
            1280: { slidesPerView: 7.5 },
          }}
          className="movie-swiper !overflow-visible"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id} className="!h-auto pb-4 pt-2">
              <div className="transition-all duration-300 group">
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
