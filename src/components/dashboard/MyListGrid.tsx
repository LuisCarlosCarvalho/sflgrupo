"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/shared/MovieCard";
import { Play } from "lucide-react";

export default function MyListGrid() {
  const [list, setList] = useState<any[]>([]);

  const loadList = () => {
    const saved = JSON.parse(localStorage.getItem("sfl-mylist") || "[]");
    setList(saved);
  };

  useEffect(() => {
    loadList();
    window.addEventListener("storage-update", loadList);
    return () => window.removeEventListener("storage-update", loadList);
  }, []);

  if (list.length === 0) {
    return (
      <div className="px-6 md:px-12 py-20 text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <Play className="w-8 h-8 text-gray-600" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Sua lista está vazia</h2>
        <p className="text-gray-500 max-w-sm font-bold">Adicione filmes e séries à sua lista para assisti-los mais tarde.</p>
        <button 
          onClick={() => window.location.href = "/dashboard"}
          className="bg-white text-black font-black px-8 py-3 rounded-xl hover:bg-brand-green transition-colors"
        >
          EXPLORAR CATÁLOGO
        </button>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 pb-20">
      <div className="flex flex-wrap gap-x-4 gap-y-10 md:gap-y-16">
        {list.map((movie) => (
          <div key={movie.id} className="w-[calc(50%-1rem)] md:w-[calc(33.33%-1rem)] lg:w-[calc(20%-1rem)]">
             <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}
