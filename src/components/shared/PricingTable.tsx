"use client";

import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Basic",
    price: "R$ 29,90",
    description: "Ideal para assistir no celular.",
    features: ["Resolução 720p", "1 Dispositivo simultâneo", "Sem anúncios", "Catálogo limitado"],
    color: "gray",
    highlight: false,
  },
  {
    name: "Standard",
    price: "R$ 49,90",
    description: "A melhor experiência em Full HD.",
    features: ["Resolução 1080p", "2 Dispositivos simultâneos", "Sem anúncios", "Catálogo completo", "Downloads liberados"],
    color: "brand-green",
    highlight: true,
  },
  {
    name: "Premium",
    price: "R$ 79,90",
    description: "O máximo do 4K e HDR.",
    features: ["Resolução 4K + HDR", "4 Dispositivos simultâneos", "Sem anúncios", "Catálogo completo", "Áudio Spatial", "Downloads ilimitados"],
    color: "brand-yellow",
    highlight: false,
  },
];

export default function PricingTable() {
  return (
    <section id="pricing" className="py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
            ESCOLHA SEU <span className="text-brand-green">PLANO</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Sem contratos, sem taxas de cancelamento. Mude ou cancele seu plano a qualquer momento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-8 rounded-3xl transition-all duration-500 hover:scale-105 ${
                plan.highlight
                  ? "bg-gradient-to-b from-brand-green/20 to-black border-2 border-brand-green shadow-2xl shadow-brand-green/10"
                  : "glass-panel border-white/10"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-green text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Mais Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-gray-400">/mês</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${plan.highlight ? "bg-brand-green/20 text-brand-green" : "bg-white/10 text-white"}`}>
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={`/register?plan=${plan.name.toLowerCase()}`}
                className={`w-full py-4 rounded-xl font-black text-center transition-all ${
                  plan.highlight
                    ? "bg-brand-green hover:bg-brand-yellow text-black shadow-lg shadow-brand-green/20"
                    : "bg-white/10 hover:bg-white text-white hover:text-black"
                }`}
              >
                ASSINAR {plan.name.toUpperCase()}
              </Link>
            </div>
          ))}
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-12">
          Disponibilidade de HD, Ultra HD e 4K sujeita ao seu serviço de internet e aparelho.
        </p>
      </div>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-green/5 blur-[120px] rounded-full -z-0" />
    </section>
  );
}
