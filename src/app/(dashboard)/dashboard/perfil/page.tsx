import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAvailableApps } from "@/app/actions/apps";
import { getHomePlatforms } from "@/app/actions/platforms";
import UserProfile from "@/components/dashboard/UserProfile";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Central do Assinante | SFL Stream",
  description: "Gerencie seu plano e informações de conta.",
};

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  const [availableApps, homePlatforms] = await Promise.all([
    getAvailableApps(),
    getHomePlatforms(),
  ]);

  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      role: true,
      plan: true,
      planExpiresAt: true,
      favoriteCountry: true,
      favoriteTeam: true,
    },
  });

  // Merge dos apps cadastrados em AvailableApp + plataformas cadastradas no Carrossel Home
  const platformApps = homePlatforms.map((p) => {
    const downloadUrl = p.shortCode ? `/d/${p.shortCode}` : p.fileUrl || "";
    return {
      id: `platform-${p.id}`,
      name: p.name,
      platform: "Home SFL",
      download_url: downloadUrl,
      icon_url: p.logoUrl,
      description: p.description,
      status: p.status, // "AVAILABLE" | "COMING_SOON" | "HOW_TO_INSTALL"
      gradient: p.gradient,
    };
  });

  const existingAppNames = new Set(
    availableApps.map((a) => a.name.toLowerCase().trim())
  );

  // Evita duplicação caso tenham exatamente o mesmo nome
  const combinedApps = [
    ...platformApps,
    ...availableApps
      .filter((a) => !existingAppNames.has(a.name.toLowerCase().trim()))
      .map((a) => ({
        id: a.id,
        name: a.name,
        platform: a.platform,
        download_url: a.download_url,
        icon_url: a.icon_url,
        description: a.description,
        status: "AVAILABLE",
      })),
  ];

  return (
    <div className="container mx-auto px-6 md:px-12 py-10">
      <UserProfile
        apps={combinedApps as any}
        user={{
          name: user?.name || session.user.name || "Usuário",
          email: user?.email || session.user.email || "",
          role: user?.role || "USER",
          planType: user?.plan || "FREE",
          expires_at: user?.planExpiresAt?.toISOString(),
          notification_active: true,
          favoriteCountry: user?.favoriteCountry || "",
          favoriteTeam: user?.favoriteTeam || "",
        }}
      />
    </div>
  );
}
