"use client";

import { X, Play, Plus, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toggleWatchlist } from "@/app/actions/watchlist";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: any;
  onPlayTrailer?: () => void;
}

export default function InfoModal({ isOpen, onClose, movie, onPlayTrailer }: InfoModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isInList, setIsInList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !movie) return null;

  const handleToggleWatchlist = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await toggleWatchlist({
        id: movie.id,
        title: movie.title,
        posterPath: movie.thumbnailUrl || movie.backdropUrl,
        type: movie.type || "movie",
      });
      setIsInList(result.added);
    } catch (error) {
      console.error("Watchlist Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 md:p-8">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_0_80px_rgba(255,215,0,0.1)] border border-white/10 bg-[#141414] animate-in zoom-in-95 duration-500 custom-scrollbar">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 hover:bg-brand-yellow hover:text-black flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-95 border border-white/20 backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Section */}
        <div className="relative w-full h-[40vh] md:h-[50vh]">
          <img 
            src={movie.backdropUrl} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4 drop-shadow-lg">
              {movie.title}
            </h2>
            <div className="flex gap-4">
              {onPlayTrailer && (
                <button 
                  onClick={() => {
                    onClose();
                    onPlayTrailer();
                  }}
                  className="flex items-center gap-2 bg-white text-black font-black px-8 py-3 rounded-xl hover:bg-brand-yellow transition-all transform hover:scale-105 active:scale-95"
                >
                  <Play className="w-5 h-5 fill-current" />
                  ASSISTIR TRAILER
                </button>
              )}
              <button 
                onClick={handleToggleWatchlist}
                disabled={isLoading}
                className="w-12 h-12 rounded-xl border border-white/40 flex items-center justify-center text-white hover:border-white hover:bg-white/10 transition-all backdrop-blur-md"
                title={isInList ? "Remover da Lista" : "Adicionar à Minha Lista"}
              >
                {isInList ? <Check className="w-6 h-6 text-brand-yellow" /> : <Plus className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-4 text-sm font-bold">
              <span className="text-green-500">{movie.rating}% Relevante</span>
              <span className="text-gray-400">{movie.duration}</span>
              <span className="px-2 py-0.5 border border-gray-600 text-gray-300 rounded text-xs">HD</span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              {movie.description || "Nenhuma descrição disponível para este título."}
            </p>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <span className="text-gray-500">Gênero:</span>{" "}
              <span className="text-gray-300">{movie.genre || "Desconhecido"}</span>
            </div>
            <div>
              <span className="text-gray-500">Tipo:</span>{" "}
              <span className="text-gray-300 uppercase">{movie.type === 'tv' ? 'Série' : 'Filme'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
