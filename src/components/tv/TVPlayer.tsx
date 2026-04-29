// src/components/tv/TVPlayer.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Maximize, Volume2, VolumeX, Play, Pause, Tv } from 'lucide-react';

interface TVPlayerProps {
  url: string;
  title?: string;
  nowPlaying?: {
    title: string;
    description: string;
    backdrop?: string;
  };
}

export default function TVPlayer({ url, title, nowPlaying }: TVPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    let hls: Hls | null = null;

    if (videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => setIsPlaying(false));
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(() => setIsPlaying(false));
        });
      }
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [url]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
    }
  };

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        autoPlay
      />

      {/* Overlay - Now Playing */}
      <div className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-end justify-between gap-6">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">Ao Vivo</span>
              {title && <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">• {title}</span>}
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">
              {nowPlaying?.title || "Programação indisponível"}
            </h2>
            <p className="text-xs text-gray-400 font-medium line-clamp-2 max-w-2xl">
              {nowPlaying?.description || "Acompanhe a transmissão em tempo real."}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleMute} className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button onClick={toggleFullscreen} className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white">
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Center Play/Pause Overlay */}
      <button 
        onClick={togglePlay}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${!isPlaying || showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="w-20 h-20 rounded-full bg-brand-green/20 backdrop-blur-md flex items-center justify-center border border-brand-green/30 text-brand-green hover:scale-110 transition-transform">
          {isPlaying ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
        </div>
      </button>

      {/* Loading State fallback */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
          <Tv className="w-12 h-12 text-gray-600 animate-bounce" />
          <p className="text-[10px] font-black text-white uppercase tracking-widest">Carregando Transmissão...</p>
        </div>
      )}
    </div>
  );
}
