"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import { getMovieVideos } from "@/lib/tmdb";

const ReactPlayer = dynamic(() => import("./ReactPlayerWrapper"), { 
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center gap-4 text-gray-500">
      <div className="w-12 h-12 border-4 border-brand-yellow/30 border-t-brand-yellow rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest">Carregando Player...</p>
    </div>
  )
});

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey?: string;
  title: string;
  movieId?: string;
  type?: "movie" | "tv";
}

export default function TrailerModal({ isOpen, onClose, videoKey: initialVideoKey, title, movieId, type = "movie" }: TrailerModalProps) {
  const [mounted, setMounted] = useState(false);
  const [videoKey, setVideoKey] = useState(initialVideoKey || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Se não temos a key, buscamos agora
      if (!initialVideoKey && movieId) {
        const fetchVideo = async () => {
          setIsLoading(true);
          try {
            const videos = await getMovieVideos(movieId, type);
            if (videos && videos.length > 0) {
              setVideoKey(videos[0].key);
            } else {
              setVideoKey("");
            }
          } catch (err) {
            console.error("Erro ao buscar trailer no modal:", err);
            setVideoKey("");
          } finally {
            setIsLoading(false);
          }
        };
        fetchVideo();
      } else {
        setVideoKey(initialVideoKey || "");
        setIsLoading(false);
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialVideoKey, movieId, type]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 md:p-8">
      {/* Overlay Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-[#15192A] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 animate-in zoom-in-95 duration-300">
        
        {/* Header Decor */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-yellow to-transparent opacity-50" />
        
        {/* Top Controls */}
        <div className="absolute top-6 left-8 right-8 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-yellow bg-brand-yellow/10 px-3 py-1 rounded-full border border-brand-yellow/20">
              Assistir: {title}
            </span>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 bg-brand-yellow text-black rounded-xl hover:scale-110 active:scale-95 transition-all pointer-events-auto shadow-[0_0_20px_rgba(255,215,0,0.3)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="w-full relative bg-black aspect-video flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-gray-500">
              <div className="w-12 h-12 border-4 border-brand-yellow/30 border-t-brand-yellow rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest">Buscando Trailer...</p>
            </div>
          ) : videoKey ? (
            <ReactPlayer 
              key={videoKey}
              url={`https://www.youtube.com/watch?v=${videoKey}`}
              width="100%"
              height="100%"
              playing={true}
              controls={true}
              muted={true}
              playsinline={true}
              config={{
                youtube: {
                  playerVars: { 
                    autoplay: 1,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 1,
                    mute: 1
                  }
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-4 text-gray-500">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <X className="w-8 h-8 opacity-20" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Trailer indisponível para este título</p>
            </div>
          )}
        </div>

        {/* Footer Decoration */}
        <div className="p-6 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">SFL STREAM CINEMATIC EXPERIENCE</span>
          </div>
          <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/20">© 2026 SFL GRUPO</div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
