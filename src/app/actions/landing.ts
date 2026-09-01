"use server";

import { prisma } from "@/lib/prisma";

export async function getLandingFeatures() {
  try {
    const features = await prisma.siteFeature.findMany({
      orderBy: { order: "asc" },
    });

    if (features.length === 0) {
      return [
        {
          id: "1",
          icon_name: "Tv",
          title: "TV Ao Vivo & Esportes",
          description: "Canais em alta definição com guia de programação interativo e sem travamentos.",
          color_theme: "green",
        },
        {
          id: "2",
          icon_name: "Smartphone",
          title: "Multiplataforma",
          description: "Disponível em Android, Smart TV, TV Box, iOS e computadores Windows.",
          color_theme: "yellow",
        },
        {
          id: "3",
          icon_name: "Globe",
          title: "Servidores Globais",
          description: "Infraestrutura de baixa latência distribuída para máxima estabilidade.",
          color_theme: "blue",
        },
        {
          id: "4",
          icon_name: "ShieldCheck",
          title: "Ativação Imediata",
          description: "Suporte dedicado com liberação rápida e teste sem compromisso.",
          color_theme: "green",
        },
      ];
    }

    return features.map((f) => ({
      id: f.id,
      icon_name: f.icon,
      title: f.title,
      description: f.description,
      color_theme: "green",
    }));
  } catch (error) {
    console.error("Error fetching landing features:", error);
    return [];
  }
}

export async function getLandingPricingPlans() {
  try {
    const plans = await prisma.pricingPlan.findMany({
      where: { active: true },
      orderBy: { priceBrl: "asc" },
    });

    if (plans.length === 0) {
      return [
        {
          id: "1",
          name: "MENSAL VIP",
          price: 40,
          currency: "BRL",
          features: ["Todos os canais liberados", "Filmes e Séries On-Demand", "Guia de Programação (EPG)", "1 Tela Simultânea"],
          color_theme: "green",
          is_popular: false,
        },
        {
          id: "2",
          name: "TRIMESTRAL VIP",
          price: 110,
          currency: "BRL",
          features: ["Todos os canais liberados", "Filmes e Séries On-Demand", "Guia de Programação (EPG)", "2 Telas Simultâneas", "Suporte Prioritário"],
          color_theme: "yellow",
          is_popular: true,
        },
        {
          id: "3",
          name: "ANUAL VIP",
          price: 360,
          currency: "BRL",
          features: ["Acesso Completo por 12 meses", "Melhor Custo-Benefício", "3 Telas Simultâneas", "Suporte VIP via WhatsApp"],
          color_theme: "blue",
          is_popular: false,
        },
      ];
    }

    return plans.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.priceBrl,
      currency: "BRL",
      features: p.features,
      color_theme: p.popular ? "yellow" : "green",
      is_popular: p.popular,
    }));
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    return [];
  }
}
