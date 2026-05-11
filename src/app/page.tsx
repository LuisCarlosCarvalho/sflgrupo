"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/shared/Hero";
import PricingTable from "@/components/shared/PricingTable";
import { Tv, Smartphone, Globe, ShieldCheck, Loader2, LucideIcon } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const iconMap: Record<string, LucideIcon> = {
  Tv: Tv,
  Smartphone: Smartphone,
  Globe: Globe,
  ShieldCheck: ShieldCheck
};

interface Feature {
  id: string;
  icon_name: string;
  title: string;
  description: string;
  color_theme?: string;
}

export default function LandingPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchFeatures() {
      const { data } = await supabase.from("site_features").select("*");
      if (isMounted && data) setFeatures(data);
      if (isMounted) setLoading(false);
    }
    fetchFeatures();
    return () => { isMounted = false; };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-brand-green selection:text-black">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-black relative overflow-hidden">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-yellow w-10 h-10" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {features.map((feature) => {
                const Icon = iconMap[feature.icon_name] || Tv;
                const colorClass = 
                  feature.color_theme === 'green' ? 'text-brand-green' :
                  feature.color_theme === 'yellow' ? 'text-brand-yellow' :
                  'text-brand-blue';
                
                return (
                  <FeatureCard 
                    key={feature.id}
                    icon={<Icon className={`w-8 h-8 ${colorClass}`} />}
                    title={feature.title}
                    description={feature.description}
                  />
                );
              })}
            </div>
          )}
        </div>
        
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[500px] bg-brand-blue/5 blur-[120px] rounded-full -z-0" />
      </section>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <PricingTable />

      {/* Footer */}
      <footer className="py-12 md:py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
                <img src="https://i.imgur.com/2ex0N3R.png" alt="Logo" className="h-8 w-auto" />
                SFL <span className="text-brand-yellow">STREAM</span>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm max-w-xs text-center md:text-left">
                A melhor experiência em streaming esportivo e entretenimento do SFL Grupo.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-xs sm:text-sm font-bold text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Ajuda</a>
              <a href="#pricing" className="text-brand-green hover:text-brand-yellow transition-colors">Assinar Agora</a>
            </div>
          </div>
          
          <div className="mt-12 md:mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-[10px] text-gray-600 uppercase tracking-[0.2em] font-medium text-center md:text-left">
                Desenvolvido por <a href="https://fslsolution.com" target="_blank" className="text-brand-green hover:text-brand-yellow transition-colors font-black">fslsolution.com</a>
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest text-center md:text-left">
                © 2026 Todos os direitos reservados a SFL GRUPO
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <img src="https://i.imgur.com/2ex0N3R.png" alt="SFL Logo" className="h-6 w-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
              <div className="flex gap-2">
                <span className="w-1.5 h-1.5 bg-brand-green rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-brand-yellow rounded-full"></span>
                <span className="w-1.5 h-1.5 bg-brand-blue rounded-full"></span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-4 p-6 md:p-8 rounded-3xl hover:bg-white/5 transition-all duration-300 group border border-transparent hover:border-white/10">
      <div className="p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter">{title}</h3>
      <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

