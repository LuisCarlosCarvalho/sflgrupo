"use client";

import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import Link from "next/link";

interface Movie {
  id: string;
  title: string;
  description: string;
  backdropUrl: string;
}

export default function DashboardHero({ movie }: { movie: Movie }) {
  if (!movie) return null;

  return (
    <section className="relative h-[80vh] w-full flex items-center justify-start overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={movie.backdropUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-6 bg-brand-green rounded-full"></span>
            <span className="text-sm font-black uppercase tracking-[0.2em] text-white/80">DESTAQUE DA SEMANA</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tighter uppercase">
            {movie.title}
          </h1>
          
          <p className="text-gray-300 text-sm md:text-lg mb-8 line-clamp-3 md:line-clamp-none max-w-xl leading-relaxed">
            {movie.description}
          </p>

          <div className="flex gap-4">
            <Link 
              href={`/watch/${movie.id}`}
              className="flex items-center gap-2 bg-white text-black font-black px-8 py-3 rounded-xl hover:bg-brand-green transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              ASSISTIR
            </Link>

            <button className="flex items-center gap-2 bg-white/10 text-white font-bold px-8 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all backdrop-blur-md">
              <Info className="w-4 h-4" />
              MAIS INFORMAÇÕES
            </button>
          </div>
        </motion.div>
      </div>

      {/* Brand accent at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-1 flex">
        <div className="flex-1 bg-brand-green shadow-[0_-10px_20px_rgba(0,166,81,0.3)]"></div>
        <div className="flex-1 bg-brand-yellow shadow-[0_-10px_20px_rgba(255,204,0,0.3)]"></div>
        <div className="flex-1 bg-brand-blue shadow-[0_-10px_20px_rgba(74,144,226,0.3)]"></div>
      </div>
    </section>
  );
}
