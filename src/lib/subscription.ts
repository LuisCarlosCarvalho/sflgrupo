import prisma from "./prisma";

export async function getSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isActive: true,
      planType: true,
    },
  });

  if (!user) return null;

  return {
    isActive: user.isActive,
    planType: user.planType,
  };
}
