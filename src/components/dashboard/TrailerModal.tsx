"use client";

import { X, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey: string;
  title: string;
  movieId?: string;
}

export default function TrailerModal({ isOpen, onClose, videoKey, title, movieId }: TrailerModalProps) {
  const [mounted, setMounted] = useState(false);

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

  if (!mounted || !isOpen || !videoKey) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-[95vw] md:w-full md:max-w-5xl flex flex-col rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(255,215,0,0.15)] border border-white/10 bg-black animate-in zoom-in-95 duration-500">
        
        {/* Header - Always overlay on top */}
        <div className="absolute top-0 left-0 right-0 p-3 md:p-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/95 via-black/50 to-transparent">
          <div className="flex items-center gap-2 md:gap-3 w-[85%]">
            <h2 className="text-[10px] md:text-base font-black uppercase italic tracking-tighter text-white drop-shadow-xl truncate">
              <span className="text-brand-yellow">ASSISTIR:</span> {title}
            </h2>
          </div>
          
          <button 
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/60 hover:bg-brand-yellow hover:text-black flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-90 border border-white/20"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="w-full relative bg-black aspect-video flex items-center justify-center">
          <iframe 
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&modestbranding=1&rel=0`} 
            title={title}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-yellow to-transparent opacity-50" />
      </div>

    </div>
  );

  return createPortal(modalContent, document.body);
}
