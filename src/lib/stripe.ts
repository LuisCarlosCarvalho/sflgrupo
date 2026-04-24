import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY || "sk_test_placeholder", {
  apiVersion: "2026-03-25.dahlia", // ou a versão mais recente que você preferir
  typescript: true,
});
