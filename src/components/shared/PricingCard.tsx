"use client";

import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonColor: "green" | "yellow" | "blue";
  highlight?: boolean;
  onSubscribe: (name: string) => void;
}

export default function PricingCard({
  name,
  price,
  description,
  features,
  buttonColor,
  highlight,
  onSubscribe,
}: PricingCardProps) {
  const getButtonStyles = () => {
    switch (buttonColor) {
      case "green":
        return "bg-brand-green hover:bg-brand-green/80 text-white shadow-brand-green/20";
      case "yellow":
        return "bg-brand-yellow hover:bg-brand-yellow/80 text-black shadow-brand-yellow/20";
      case "blue":
        return "bg-brand-blue hover:bg-brand-blue/80 text-white shadow-brand-blue/20";
      default:
        return "bg-white text-black";
    }
  };

  return (
    <div
      className={`relative flex flex-col p-8 rounded-3xl transition-all duration-500 hover:scale-105 border ${
        highlight
          ? "bg-gradient-to-b from-white/10 to-black border-white/20 shadow-2xl"
          : "bg-black/40 border-white/10 backdrop-blur-md"
      }`}
    >
      {highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-green text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
          Mais Popular
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">{name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black">{price}</span>
          <span className="text-gray-500 text-sm">/mês</span>
        </div>
        <p className="text-sm text-gray-400 mt-2 min-h-[40px]">{description}</p>
      </div>

      <div className="space-y-4 mb-10 flex-grow">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <div className="p-1 rounded-full bg-white/5 text-brand-green">
              <Check className="w-3 h-3" />
            </div>
            <span className="text-sm text-gray-300">{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onSubscribe(name)}
        className={`w-full py-4 rounded-xl font-black text-center transition-all transform active:scale-95 shadow-lg ${getButtonStyles()}`}
      >
        ASSINAR {name.toUpperCase()}
      </button>
    </div>
  );
}
