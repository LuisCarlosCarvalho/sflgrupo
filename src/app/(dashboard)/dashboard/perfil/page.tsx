// src/app/(dashboard)/dashboard/perfil/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";
import UserProfile from "@/components/dashboard/UserProfile";

export default async function PerfilPage() {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  const { data: user } = await supabase
    .from("User")
    .select("name, email, role, planType")
    .eq("id", session.user.id)
    .single();

  const { data: plan } = await supabase
    .from("plans")
    .select("expires_at, plan_name")
    .eq("user_id", session.user.id)
    .single();

  return (
    <div className="container mx-auto px-6 md:px-12 py-10">
      <UserProfile 
        user={{
          name: user?.name || session.user.name || "Usuário",
          email: user?.email || session.user.email || "",
          role: user?.role || "USER",
          planType: user?.planType
        }} 
        plan={plan || undefined}
      />
    </div>
  );
}
