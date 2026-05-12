import { useEffect, useState } from "react";
import PricingCard from "./PricingCard";
import LeadModal from "./LeadModal";
import { supabase } from "@/lib/supabase/client";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  color_theme: string;
  is_popular: boolean;
}

export default function PricingTable() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBR, setIsBR] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Detect Location
    async function detectLocation() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.country_code === "BR" && isMounted) {
          setIsBR(true);
        }
      } catch (error) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        if ((tz.includes("Sao_Paulo") || tz.includes("Bahia") || tz.includes("Belem") || tz.includes("Fortaleza") || tz.includes("Maceio") || tz.includes("Manaus") || tz.includes("Cuiaba") || tz.includes("Porto_Velho") || tz.includes("Boa_Vista") || tz.includes("Campo_Grande") || tz.includes("Rio_Branco")) && isMounted) {
          setIsBR(true);
        }
      }
    }

    async function fetchPlans() {
      const { data } = await supabase.from("pricing_plans").select("*").order("price");
      if (data && isMounted) setPlans(data as PricingPlan[]);
      if (isMounted) setLoading(false);
    }
    
    detectLocation();
    fetchPlans();
    
    return () => { isMounted = false; };
  }, []);

  // Helper para converter o preço do banco (Euro) para Real
  const getDisplayPrice = (plan: PricingPlan) => {
    if (!isBR) return { price: plan.price, currency: plan.currency === 'BRL' ? 'R$' : plan.currency === 'EUR' ? '€' : '$' };
    
    // Tabela de conversão manual (Euro -> BRL) com os valores exatos do SFL Grupo
    let convertedPrice = plan.price;
    if (plan.price === 9) convertedPrice = 40;     // SFL MITV VIP Mês
    else if (plan.price === 48) convertedPrice = 225; // Plano SFL Semestral
    else if (plan.price === 30) convertedPrice = 50;  // SaaS Gestão de clientes
    else convertedPrice = Math.round(plan.price * 4.5);
    
    return { price: convertedPrice, currency: "R$" };
  };

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
          {plans.map((plan) => {
            const display = getDisplayPrice(plan);
            return (
              <PricingCard
                key={plan.id}
                name={plan.name}
                price={`${display.currency} ${display.price},00`}
                description={plan.name === 'BASIC' ? 'Para quem quer o essencial.' : plan.name === 'STANDARD' ? 'A melhor experiência HD.' : 'O máximo do entretenimento.'}
                features={plan.features}
                buttonColor={plan.color_theme as "blue" | "green" | "yellow"}
                highlight={plan.is_popular}
                onSubscribe={handleSubscribe}
              />
            );
          })}
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
