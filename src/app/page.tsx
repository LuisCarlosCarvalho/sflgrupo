import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/shared/Hero";
import PricingTable from "@/components/shared/PricingTable";
import { Tv, Smartphone, Globe, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section id="features" className="py-24 bg-black">
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
              description="Controle parental e perfis individuais para toda a sua família."
            />
          </div>
        </div>
      </section>

      {/* Divider with Brand Colors */}
      <div className="h-1 flex">
        <div className="flex-1 bg-brand-green" />
        <div className="flex-1 bg-brand-yellow" />
        <div className="flex-1 bg-brand-blue" />
      </div>

      <PricingTable />

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-xl font-black">
              SFL <span className="text-brand-yellow">STREAM</span>
            </div>
            
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
              <a href="#" className="hover:text-white transition-colors">Centro de Ajuda</a>
            </div>
            
            <div className="text-sm text-gray-600">
              © 2026 SFL Grupo. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-4 p-6 rounded-2xl hover:bg-white/5 transition-colors group">
      <div className="p-3 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
