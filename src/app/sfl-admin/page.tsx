import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== "ADMIN") {
      redirect("/");
    }

    // REDIRECIONAR PARA O NOVO PAINEL
    redirect("/admin");
  } catch (error) {
    redirect("/admin");
  }
}
