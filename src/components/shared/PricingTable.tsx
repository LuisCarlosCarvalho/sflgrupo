import { useEffect, useState } from "react";
import PricingCard from "./PricingCard";
import LeadModal from "./LeadModal";
import { getLandingPricingPlans } from "@/app/actions/landing";

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

    async function detectLocation() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.country_code === "BR" && isMounted) {
          setIsBR(true);
        }
      } catch (error) {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
        if (
          (tz.includes("Sao_Paulo") ||
            tz.includes("Bahia") ||
            tz.includes("Belem") ||
            tz.includes("Fortaleza") ||
            tz.includes("Maceio") ||
            tz.includes("Manaus") ||
            tz.includes("Cuiaba") ||
            tz.includes("Porto_Velho") ||
            tz.includes("Boa_Vista") ||
            tz.includes("Campo_Grande") ||
            tz.includes("Rio_Branco")) &&
          isMounted
        ) {
          setIsBR(true);
        }
      }
    }

    async function fetchPlans() {
      const data = await getLandingPricingPlans();
      if (data && isMounted) setPlans(data as PricingPlan[]);
      if (isMounted) setLoading(false);
    }

    detectLocation();
    fetchPlans();

    return () => {
      isMounted = false;
    };
  }, []);

  const getDisplayPrice = (plan: PricingPlan) => {
    if (!isBR) return { price: plan.price, currency: plan.currency === "BRL" ? "R$" : plan.currency === "EUR" ? "€" : "$" };

    let convertedPrice: number | string = plan.price;
    const name = plan.name.toUpperCase();

    if (name.includes("VIP") || name.includes("MÊS")) convertedPrice = 40;
    else if (name.includes("SEMESTRAL")) convertedPrice = 225;
    else if (name.includes("SAAS") || name.includes("GESTÃO")) convertedPrice = 50;
    else {
      const num = typeof plan.price === "string" ? parseFloat((plan.price as string).replace(",", ".")) : Number(plan.price);
      convertedPrice = isNaN(num) ? plan.price : Math.round(num * 4.5);
    }

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
                description={
                  plan.name === "BASIC"
                    ? "Para quem quer o essencial."
                    : plan.name === "STANDARD"
                    ? "A melhor experiência HD."
                    : "O máximo do entretenimento."
                }
                features={plan.features}
                buttonColor={plan.color_theme as "blue" | "green" | "yellow"}
                highlight={plan.is_popular}
                onSubscribe={handleSubscribe}
              />
            );
          })}
        </div>
      </div>

      <LeadModal planName={selectedPlan || ""} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
