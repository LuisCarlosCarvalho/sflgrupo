import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/shared/Hero";
import PricingTable from "@/components/shared/PricingTable";
import { Tv, Smartphone, Globe, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-brand-green selection:text-black">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section id="features" className="py-24 bg-black relative">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <FeatureCard 
              icon={<Tv className="w-8 h-8 text-brand-green" />}
              title="Assista na TV"
              description="Smart TVs, Apple TV, Chromecast e muito mais direto do seu sofá."
            />
            <FeatureCard 
              icon={<Smartphone className="w-8 h-8 text-brand-yellow" />}
              title="No seu Celular"
              description="Baixe seus jogos e eventos favoritos para assistir offline onde estiver."
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-brand-blue" />}
              title="Qualquer Lugar"
              description="Acesse sua conta em computadores, tablets e consoles de videogame."
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-brand-green" />}
              title="Segurança Total"
              description="Controle de acesso manual garantindo a integridade da sua conta."
            />
          </div>
        </div>
        
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full -z-0" />
      </section>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <PricingTable />

      {/* Footer */}
      <footer className="py-20 bg-black border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
                <img src="https://i.imgur.com/2ex0N3R.png" alt="Logo" className="h-8 w-auto" />
                SFL <span className="text-brand-yellow">STREAM</span>
              </div>
              <p className="text-gray-500 text-sm max-w-xs text-center md:text-left">
                A melhor experiência em streaming esportivo e entretenimento do SFL Grupo.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm font-bold text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Ajuda</a>
              <a href="#pricing" className="text-brand-green hover:text-brand-yellow transition-colors">Assinar Agora</a>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 uppercase tracking-widest">
            <span>© 2026 SFL GRUPO. TODOS OS DIREITOS RESERVADOS.</span>
            <span className="flex gap-4">
              <span className="w-2 h-2 bg-brand-green rounded-full"></span>
              <span className="w-2 h-2 bg-brand-yellow rounded-full"></span>
              <span className="w-2 h-2 bg-brand-blue rounded-full"></span>
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-4 p-8 rounded-3xl hover:bg-white/5 transition-all duration-300 group border border-transparent hover:border-white/10">
      <div className="p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-black uppercase tracking-tighter">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
