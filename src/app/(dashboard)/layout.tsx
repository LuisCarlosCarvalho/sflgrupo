// src/app/(dashboard)/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import NotificationBanner from "@/components/dashboard/NotificationBanner";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // 1. Buscar status do usuário e plano
  const { data: userData } = await supabase
    .from("User")
    .select("isActive, role")
    .eq("id", session.user.id)
    .single();

  const { data: planData } = await supabase
    .from("plans")
    .select("expires_at, plan_name")
    .eq("user_id", session.user.id)
    .single();

  // 2. Verificações de Acesso
  const isExpired = planData?.expires_at ? new Date(planData.expires_at) < new Date() : false;
  const isBlocked = userData?.isActive === false;

  // Se o usuário não for ADMIN e estiver expirado ou bloqueado
  if (userData?.role !== "ADMIN") {
    if (isBlocked || isExpired) {
      redirect("/conta-suspensa");
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <DashboardNavbar />
      
      {/* Sistema de Alarme Visual */}
      {planData?.expires_at && (
        <div className="mt-20"> {/* Compensa a navbar fixa */}
          <NotificationBanner expiresAt={planData.expires_at} />
        </div>
      )}

      <main className={`flex-1 ${planData?.expires_at ? '' : 'mt-20'}`}>
        {children}
      </main>

    </div>
  );
}
