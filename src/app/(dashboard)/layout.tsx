import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import NotificationBanner from "@/components/dashboard/NotificationBanner";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      status: true,
      role: true,
      planExpiresAt: true,
    },
  });

  const expiresAt = user?.planExpiresAt?.toISOString() || null;

  return (
    <div className="min-h-screen bg-black flex flex-col w-full overflow-x-hidden">
      <Suspense fallback={<div className="h-20 bg-black/50" />}>
        <DashboardNavbar />
      </Suspense>

      {/* Sistema de Alarme Visual */}
      {expiresAt && (
        <div className="mt-20">
          <NotificationBanner expiresAt={expiresAt} />
        </div>
      )}

      <main className={`flex-1 ${expiresAt ? "" : "mt-20"}`}>
        {children}
      </main>
    </div>
  );
}
