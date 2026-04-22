import CategoryRow from "@/components/shared/CategoryRow";
import Navbar from "@/components/shared/Navbar";
import { Play, Info } from "lucide-react";

const DUMMY_MOVIES = [
  { id: "1", title: "Final Champions League", thumbnailUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800", duration: "2h 30m", genre: "Esporte", rating: "98%" },
  { id: "2", title: "NBA Finals: Lakers vs Celtics", thumbnailUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800", duration: "1h 45m", genre: "Basquete", rating: "95%" },
  { id: "3", title: "Wimbledon 2026", thumbnailUrl: "https://images.unsplash.com/photo-1595435063435-0c58e57999dc?q=80&w=800", duration: "3h 15m", genre: "Tênis", rating: "92%" },
  { id: "4", title: "F1 GP de Interlagos", thumbnailUrl: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=800", duration: "1h 50m", genre: "Automobilismo", rating: "99%" },
  { id: "5", title: "Copa do Mundo Feminina", thumbnailUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800", duration: "2h 00m", genre: "Futebol", rating: "94%" },
  { id: "6", title: "X-Games Summer", thumbnailUrl: "https://images.unsplash.com/photo-1566792820021-392900763a42?q=80&w=800", duration: "4h 00m", genre: "Radical", rating: "90%" },
];

export default function Dashboard() {
  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      <Navbar />
      
      {/* Featured Banner */}
      <section className="relative h-[85vh] w-full">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504450758481-7338eba7524a?q=80&w=2000" 
            alt="Feature" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
        </div>

        <div className="absolute bottom-[15%] left-6 md:left-12 max-w-xl space-y-6">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter">
            COPA LIBERTADORES <br />
            <span className="text-brand-green">FINAL AO VIVO</span>
          </h1>
          <p className="text-sm md:text-lg text-gray-200 line-clamp-3">
            O momento mais esperado do ano chegou. Acompanhe cada lance, cada gol e a emoção da grande final continental com narração exclusiva e câmeras em 360 graus.
          </p>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition transform active:scale-95">
              <Play className="fill-current w-6 h-6" />
              Assistir Agora
            </button>
            <button className="flex items-center gap-2 bg-gray-500/50 text-white px-8 py-3 rounded font-bold hover:bg-gray-500/70 transition">
              <Info className="w-6 h-6" />
              Mais Informações
            </button>
          </div>
        </div>
      </section>

      {/* Categories Rows */}
      <div className="pb-40 -mt-32 relative z-30 space-y-12">
        <CategoryRow title="Destaques da Semana" movies={DUMMY_MOVIES} />
        <CategoryRow title="Eventos Ao Vivo" movies={[...DUMMY_MOVIES].reverse()} />
        <CategoryRow title="Documentários Esportivos" movies={DUMMY_MOVIES.slice(2, 6)} />
        <CategoryRow title="Favoritos do SFL Stream" movies={DUMMY_MOVIES} />
      </div>
    </div>
  );
}
