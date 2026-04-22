import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2023-10-16" as any, // Latest stable version for the SDK
  typescript: true,
});
