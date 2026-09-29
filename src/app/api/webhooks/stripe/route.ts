import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userEmail = session.customer_details?.email?.toLowerCase().trim();
    const stripeCustomerId = session.customer as string;

    if (userEmail) {
      await prisma.$transaction(async (tx) => {
        // Idempotência: verificar se transação do checkout já existe
        const existingTx = await tx.transaction.findFirst({
          where: { description: { contains: session.id } }
        });

        if (existingTx) return; // Já foi processado

        await tx.user.upsert({
          where: { email: userEmail },
          update: {
            status: "ACTIVE",
            stripeCustomerId,
            plan: "VIP",
            planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
          create: {
            email: userEmail,
            name: session.customer_details?.name || "Cliente SFL",
            status: "ACTIVE",
            plan: "VIP",
            stripeCustomerId,
            planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });

        await tx.transaction.create({
          data: {
            description: `Assinatura Stripe [${session.id}] (${session.amount_total ? session.amount_total / 100 : 0} ${session.currency?.toUpperCase()})`,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            type: "INCOME",
            category: "ASSINATURA",
          },
        });
      });
    }
  }

  return NextResponse.json({ received: true });
}
