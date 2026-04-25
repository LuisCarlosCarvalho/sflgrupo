import { useEffect, useState } from "react";
import PricingCard from "./PricingCard";
import LeadModal from "./LeadModal";
import { supabase } from "@/lib/supabase/client";

export default function PricingTable() {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      const { data } = await supabase.from("pricing_plans").select("*").order("price");
      if (data) setPlans(data);
      setLoading(false);
    }
    fetchPlans();
  }, []);

  const handleSubscribe = (planName: string) => {
    setSelectedPlan(planName);
    setIsModalOpen(true);
  };

  if (loading) return null;

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
              key={plan.id}
              name={plan.name}
              price={`${plan.currency === 'BRL' ? 'R$' : plan.currency === 'EUR' ? '€' : '$'} ${plan.price}`}
              description={plan.name === 'BASIC' ? 'Para quem quer o essencial.' : plan.name === 'STANDARD' ? 'A melhor experiência HD.' : 'O máximo do entretenimento.'}
              features={plan.features}
              buttonColor={plan.color_theme as any}
              highlight={plan.is_popular}
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
