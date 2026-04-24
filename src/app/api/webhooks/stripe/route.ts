import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Garantimos a tipagem da assinatura para evitar erro de build
    const subscription = (await stripe.subscriptions.retrieve(
      session.subscription as string
    )) as any;

    if (!session?.metadata?.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const { error } = await supabase
      .from('User')
      .update({
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ).toISOString(),
        isActive: true, // Ativa o usuário automaticamente no pagamento
        planType: "PREMIUM", // Ajuste conforme seu plano
      })
      .eq('id', session.metadata.userId);

    if (error) {
      console.error("Stripe Webhook Update Error:", error);
      return new NextResponse(`Database Error: ${error.message}`, { status: 500 });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = (await stripe.subscriptions.retrieve(
      session.subscription as string
    )) as any;

    const { error } = await supabase
      .from('User')
      .update({
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ).toISOString(),
      })
      .eq('stripeSubscriptionId', subscription.id);

    if (error) {
      console.error("Stripe Webhook Success Error:", error);
    }
  }

  return new NextResponse(null, { status: 200 });
}
