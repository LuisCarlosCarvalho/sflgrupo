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
      <div className="relative w-full max-w-5xl flex flex-col rounded-xl md:rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(255,215,0,0.15)] border border-white/5 bg-black animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="relative md:absolute top-0 left-0 right-0 p-3 md:p-4 flex items-center justify-between z-10 bg-black md:bg-gradient-to-b md:from-black/90 md:to-transparent border-b border-white/10 md:border-none">
          <div className="flex items-center gap-3 w-[85%]">
            <h2 className="text-xs md:text-lg font-black uppercase italic tracking-tighter text-white drop-shadow-lg truncate">
              <span className="text-brand-yellow">TRAILER:</span> {title}
            </h2>
          </div>
          
          <button 
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/10 md:bg-black/50 hover:bg-brand-yellow hover:text-black flex items-center justify-center text-white transition-all transform hover:scale-110 active:scale-95 border border-white/20"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="w-full aspect-video bg-black relative">
          <iframe 
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&modestbranding=1&rel=0`} 
            title={title}
            className="absolute top-0 left-0 w-full h-full border-0"
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
