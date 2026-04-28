import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getAvailableApps } from "@/app/actions/apps";
import UserProfile from "@/components/dashboard/UserProfile";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);
  const apps = await getAvailableApps();

  if (!session) return null;

  const { data: user } = await supabase
    .from("User")
    .select("name, email, role, planType, expires_at, notification_active")
    .eq("id", session.user.id)
    .single();

  return (
    <div className="container mx-auto px-6 md:px-12 py-10">
      <UserProfile 
        apps={apps}
        user={{
          name: user?.name || session.user.name || "Usuário",
          email: user?.email || session.user.email || "",
          role: user?.role || "USER",
          planType: user?.planType || "FREE",
          expires_at: user?.expires_at,
          notification_active: user?.notification_active
        }} 
      />
    </div>
  );
}
