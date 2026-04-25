"use client";

import { Info, Play } from "lucide-react";
import { useState } from "react";
import { getMovieVideos } from "@/lib/tmdb";
import TrailerModal from "@/components/dashboard/TrailerModal";
import InfoModal from "@/components/dashboard/InfoModal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

interface Movie {
  id: string;
  title: string;
  description: string;
  backdropUrl: string;
  thumbnailUrl?: string;
  genre?: string;
  rating?: string;
  duration?: string;
  type?: string;
}

interface DashboardHeroProps {
  movies: Movie[];
}

export default function DashboardHero({ movies }: DashboardHeroProps) {
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeMovieId, setActiveMovieId] = useState("");
  const [activeMovieTitle, setActiveMovieTitle] = useState("");

  if (!movies || movies.length === 0) return null;

  const handleOpenTrailer = async (movie: Movie) => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const videos = await getMovieVideos(movie.id, "movie"); 
      const trailer = videos[0];
      
      if (trailer) {
        setTrailerKey(trailer.key);
        setActiveMovieId(movie.id);
        setActiveMovieTitle(movie.title);
        setIsTrailerModalOpen(true);
      } else {
        alert("Trailer principal não disponível para este título.");
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-[80vh] md:h-[95vh] w-full">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-white/40 !w-3 !h-1 !rounded-full !transition-all",
          bulletActiveClass: "swiper-pagination-bullet-active !bg-brand-yellow !w-8",
        }}
        className="w-full h-full"
      >
        {movies.map((movie) => (
          <SwiperSlide key={movie.id} className="w-full h-full">
            <div className="relative w-full h-full flex items-center justify-start overflow-hidden">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-top transform scale-105"
                style={{ backgroundImage: `url(${movie.backdropUrl})` }}
              />
              
              {/* Immersive Dark Gradients */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Hero Content */}
              <div className="relative z-10 max-w-3xl px-6 md:px-12 -mt-10 animate-in fade-in duration-1000 slide-in-from-bottom-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-6 bg-brand-yellow rounded-full"></span>
                  <span className="text-sm font-black uppercase tracking-[0.2em] text-white/80">EM DESTAQUE</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 uppercase tracking-tighter drop-shadow-lg leading-none">
                  {movie.title}
                </h1>
                
                <p className="text-gray-300 text-sm md:text-base max-w-2xl font-medium mb-8 line-clamp-3 leading-relaxed drop-shadow-md">
                  {movie.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4">
                  <button 
                    onClick={() => handleOpenTrailer(movie)}
                    disabled={isLoading}
                    className={`flex items-center gap-2 bg-white text-black font-black px-8 py-3 rounded-xl hover:bg-brand-yellow transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] ${isLoading ? "opacity-50 cursor-wait" : ""}`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    TRAILER
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

      <TrailerModal 
        isOpen={isTrailerModalOpen}
        onClose={() => setIsTrailerModalOpen(false)}
        videoKey={trailerKey}
        title={activeMovieTitle}
        movieId={activeMovieId}
      />
    </div>
  );
}
