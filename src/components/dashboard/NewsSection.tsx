"use client";

import { useEffect, useState } from "react";
import { Calendar, User, ArrowRight, Newspaper, Loader2, Filter } from "lucide-react";

interface NewsArticle {
  id?: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  date: string;
  source: string;
  url: string;
}

export default function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("Todos");

  useEffect(() => {
    let isMounted = true;
    async function loadNews() {
      try {
        const response = await fetch("/api/news");
        const data = await response.json();
        if (isMounted) setArticles(data);
      } catch (error) {
        console.error("Erro ao carregar notícias:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadNews();
    return () => { isMounted = false; };
  }, []);

  const filteredArticles = filter === "Todos" 
    ? articles 
    : articles.filter(a => a.category === filter);

  const categories = ["Todos", "Futebol", "NFL", "NBA", "MLB", "NHL", "F1", "Português", "Brasil"];

  if (isLoading) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
        <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Carregando as últimas notícias...</p>
      </div>
    );
  }

  return (
    <section className="space-y-10 px-4 md:px-12 pb-20">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-yellow/10 flex items-center justify-center">
            <Newspaper className="text-brand-yellow w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white italic">
              SFL <span className="text-brand-yellow">BLOG</span>
            </h2>
            <p className="text-[10px] md:text-sm text-gray-500 font-medium uppercase tracking-widest mt-1">As principais manchetes do mundo dos esportes.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
           {categories.map((cat) => (
             <button
               key={cat}
               onClick={() => setFilter(cat)}
               className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
                 filter === cat 
                   ? "bg-brand-yellow text-black border-brand-yellow shadow-[0_0_15px_rgba(234,179,8,0.4)]" 
                   : "bg-white/5 text-gray-400 border-white/10 hover:border-brand-yellow/50"
               }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* Grid de Notícias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article, idx) => (
          <article 
            key={article.id || idx}
            className="group bg-[#0A0A0A] border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col hover:border-white/20 transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Image Container */}
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black uppercase tracking-widest text-brand-yellow">
                  {article.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-brand-yellow" />
                    {new Date(article.date).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User size={14} className="text-brand-yellow" />
                    {article.source}
                  </div>
                </div>
                
                <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter leading-none group-hover:text-brand-yellow transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-sm text-gray-400 font-medium leading-relaxed line-clamp-3">
                  {article.summary}
                </p>
              </div>

              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white group-hover:text-brand-yellow transition-colors"
              >
                Ler Notícia Completa
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </article>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="py-20 text-center space-y-4">
           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
              <Filter className="text-gray-700" />
           </div>
           <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Nenhuma notícia encontrada nesta categoria.</p>
        </div>
      )}
    </section>
  );
}
