import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAvailableApps } from "@/app/actions/apps";
import UserProfile from "@/components/dashboard/UserProfile";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  const apps = await getAvailableApps();

  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      role: true,
      plan: true,
      planExpiresAt: true,
    },
  });

  return (
    <div className="container mx-auto px-6 md:px-12 py-10">
      <UserProfile
        apps={apps}
        user={{
          name: user?.name || session.user.name || "Usuário",
          email: user?.email || session.user.email || "",
          role: user?.role || "USER",
          planType: user?.plan || "FREE",
          expires_at: user?.planExpiresAt?.toISOString(),
          notification_active: true,
        }}
      />
    </div>
  );
}
