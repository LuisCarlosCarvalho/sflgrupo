"use client";

import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import { searchMulti } from "@/lib/tmdb";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        const data = await searchMulti(query);
        setResults(data.slice(0, 6)); // Top 6 results
        setIsLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative" ref={searchRef}>
      <div className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 border ${
        isOpen ? "bg-black/80 border-brand-green w-64 md:w-80 shadow-[0_0_15px_rgba(0,166,81,0.2)]" : "bg-white/5 border-white/10 w-48 md:w-64"
      }`}>
        <SearchIcon className={`w-4 h-4 ${isOpen ? "text-brand-green" : "text-gray-400"}`} />
        <input 
          type="text"
          placeholder="Títulos, pessoas, gêneros..."
          className="bg-transparent border-none outline-none text-xs text-white placeholder:text-gray-500 w-full font-bold"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 2 && setIsOpen(true)}
        />
        {query && (
          <button onClick={() => setQuery("")}>
            <X className="w-4 h-4 text-gray-500 hover:text-white" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (results.length > 0 || isLoading) && (
        <div className="absolute top-full right-0 mt-4 w-72 md:w-96 glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Resultados da Busca</span>
            {isLoading && <Loader2 className="w-3 h-3 text-brand-green animate-spin" />}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
            {results.map((item) => (
              <Link 
                key={item.id}
                href={`/watch/${item.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-3 hover:bg-white/10 transition-all border-b border-white/5 last:border-none group"
              >
                <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                  <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-white truncate uppercase tracking-tighter italic">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-brand-green font-bold">{item.rating}% Relevante</span>
                    <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{item.duration}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="p-3 bg-brand-green/10 border-t border-brand-green/20">
             <p className="text-[9px] text-center font-black text-brand-green uppercase tracking-tighter italic">
               Dica: Use termos específicos para resultados melhores
             </p>
          </div>
        </div>
      )}
    </div>
  );
}
