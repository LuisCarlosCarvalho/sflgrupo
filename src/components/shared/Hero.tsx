"use client";

import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import { useState } from "react";
import LeadModal from "./LeadModal";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative h-[90vh] md:h-screen w-full flex items-center justify-start overflow-hidden">
      {/* Background Image with Netflix-style Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" 
          alt="SFL Stream Cinematic Background" 
          className="w-full h-full object-cover"
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-block bg-brand-blue/20 text-brand-blue text-xs md:text-sm font-black px-4 py-1.5 rounded-full mb-6 border border-brand-blue/30 uppercase tracking-[0.2em]"
          >
            SFL Grupo Original
          </motion.span>
          
          <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter uppercase">
            SFL Stream: <br />
            <span className="text-brand-yellow">O melhor do entretenimento</span> <br />
            no seu controle.
          </h1>
          
          <p className="text-gray-300 text-base md:text-xl mb-10 max-w-xl leading-relaxed">
            Filmes, canais ao vivo e séries premium em um só lugar. Ativação instantânea via WhatsApp para você não perder nenhum segundo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-brand-yellow hover:bg-brand-yellow/90 text-black font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-brand-yellow/20 group"
            >
              <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
              ASSINAR AGORA
            </motion.button>

            <motion.a 
              href="/dashboard/catalogo"
              whileHover={{ backgroundColor: "rgba(74, 144, 226, 0.1)", borderColor: "#4a90e2" }}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/10 text-white font-bold px-10 py-5 rounded-2xl border border-white/20 transition-all backdrop-blur-md"
            >
              <Info className="w-5 h-5" />
              VER CATÁLOGO
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* WhatsApp Lead Modal Integration */}
      <LeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        planName="Combo Premium"
      />

      {/* Decorative Glow */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-green/10 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
}
