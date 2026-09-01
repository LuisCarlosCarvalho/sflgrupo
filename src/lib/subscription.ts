import { prisma } from "./prisma";

export async function getSubscription(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        status: true,
        plan: true,
      },
    });

    if (!user) return null;

    return {
      isActive: user.status === "ACTIVE",
      planType: user.plan,
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}
