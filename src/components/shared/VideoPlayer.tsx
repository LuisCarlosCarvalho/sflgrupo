"use client";

import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { Play, Pause, ArrowLeft, Maximize, Volume2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

interface VideoPlayerProps {
  url: string;
  title: string;
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const router = useRouter();
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const togglePlay = () => setPlaying(!playing);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Player = ReactPlayer as any;

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden cursor-none group"
      onMouseMove={handleMouseMove}
      style={{ cursor: showControls ? "default" : "none" }}
    >
      {/* React Player Wrapper */}
      <div className="absolute inset-0 z-0">
        <Player
          url={url}
          width="100%"
          height="100%"
          playing={playing}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onProgress={(progress: any) => setPlayed(progress.played)}
          config={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            youtube: { playerVars: { showinfo: 0, controls: 0, disablekb: 1 } } as any
          }}
        />
      </div>

      {/* Overlay Layer */}
      <div className={`
        absolute inset-0 z-10 transition-opacity duration-500
        ${showControls ? "opacity-100" : "opacity-0"}
        bg-gradient-to-t from-black/80 via-transparent to-black/60
      `}>
        {/* Top Controls */}
        <div className="absolute top-0 w-full p-4 md:p-8 flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => router.back()}
            className="p-2 bg-brand-blue/20 hover:bg-brand-blue text-white rounded-full transition-all group shrink-0"
          >
            <ArrowLeft className="w-5 h-5 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
          </button>
          <h2 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter line-clamp-1">{title}</h2>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 w-full p-4 md:p-12 space-y-4 md:space-y-6">
          {/* Progress Bar */}
          <div className="relative w-full h-1 md:h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-brand-green transition-all duration-100" 
              style={{ width: `${played * 100}%` }} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-8">
              <button 
                onClick={togglePlay}
                className="p-2 md:p-3 bg-brand-yellow text-black rounded-full hover:scale-110 transition-transform shadow-lg shadow-brand-yellow/20 shrink-0"
              >
                {playing ? <Pause className="fill-current w-5 h-5 md:w-6 md:h-6" /> : <Play className="fill-current w-5 h-5 md:w-6 md:h-6" />}
              </button>

              <button className="text-white hover:text-brand-yellow transition-colors shrink-0">
                <RotateCcw className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="hidden md:flex items-center gap-3 group">
                <Volume2 className="text-white w-6 h-6" />
                <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-white" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <span className="hidden sm:block text-xs md:text-sm font-bold text-gray-300">Restam 1:42:05</span>
              <button className="text-white hover:text-brand-green transition-colors shrink-0">
                <Maximize className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
