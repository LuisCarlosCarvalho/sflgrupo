import { prisma } from "./prisma";

const DAY_IN_MS = 86_400_000;

export async function getSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!user) return null;

  const isValid =
    user.stripePriceId &&
    user.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return {
    ...user,
    isActive: !!isValid,
  };
}
