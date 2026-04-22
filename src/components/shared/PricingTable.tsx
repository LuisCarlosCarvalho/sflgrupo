"use client";

import { useState } from "react";
import PricingCard from "./PricingCard";
import LeadModal from "./LeadModal";

const plans = [
  {
    name: "Basic",
    price: "R$ 29,90",
    description: "Para quem quer o essencial no celular ou tablet.",
    features: ["Resolução 720p", "1 Tela", "Acesso Imediato", "Suporte via Chat"],
    buttonColor: "blue" as const,
    highlight: false,
  },
  {
    name: "Standard",
    price: "R$ 49,90",
    description: "A melhor experiência para você e sua família em Full HD.",
    features: ["Resolução 1080p", "2 Telas Simultâneas", "Catálogo Completo", "Downloads Liberados"],
    buttonColor: "green" as const,
    highlight: true,
  },
  {
    name: "Premium",
    price: "R$ 79,90",
    description: "O máximo do entretenimento com 4K, HDR e áudio espacial.",
    features: ["Resolução 4K + HDR", "4 Telas Simultâneas", "Qualidade Máxima", "Eventos Exclusivos"],
    buttonColor: "yellow" as const,
    highlight: false,
  },
];

export default function PricingTable() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubscribe = (planName: string) => {
    setSelectedPlan(planName);
    setIsModalOpen(true);
  };

  return (
    <section id="pricing" className="py-24 bg-black relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase">
            ESCOLHA SEU <span className="text-brand-green">PLANO</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Sem pegadinhas. Ativação manual e segura via suporte oficial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              {...plan}
              onSubscribe={handleSubscribe}
            />
          ))}
        </div>
      </div>

      <LeadModal 
        planName={selectedPlan || ""} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
}
