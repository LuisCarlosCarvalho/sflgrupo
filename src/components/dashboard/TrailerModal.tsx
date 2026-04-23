"use client";

import ReactPlayer from "react-player";
import { X, Play, Volume2, Maximize } from "lucide-react";
import { useEffect, useState } from "react";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey: string;
  title: string;
}

export default function TrailerModal({ isOpen, onClose, videoKey, title }: TrailerModalProps) {
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,166,81,0.2)] border border-white/10 glass-panel animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-brand-green rounded-full shadow-[0_0_10px_#00a651]" />
            <h2 className="text-sm md:text-lg font-black uppercase italic tracking-tighter text-white drop-shadow-md">
              Trailer: <span className="text-brand-yellow">{title}</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all transform active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="w-full h-full bg-black">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoKey}`}
            width="100%"
            height="100%"
            playing={true}
            controls={true}
            config={{
              youtube: {
                playerVars: { showinfo: 0, rel: 0, modestbranding: 1 }
              }
            }}
          />
        </div>

        {/* Footer Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-green via-brand-yellow to-brand-blue opacity-50" />
      </div>
    </div>
  );
}
