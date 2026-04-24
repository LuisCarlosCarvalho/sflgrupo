import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/shared/Navbar";
import { Users, CheckCircle, Shield, AlertTriangle } from "lucide-react";
import AdminUserTable from "@/components/admin/AdminUserTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    const session = await getServerSession(authOptions);
    
    // PROTEÇÃO DE ADMIN
    const ADMIN_EMAIL = "brasilviptv@gmail.com"; 

    if (!session || session.user?.email !== ADMIN_EMAIL) {
      redirect("/");
    }

    // Tenta buscar os usuários usando Supabase
    const { data: users, error } = await supabase
      .from('User')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    return (
      <div className="min-h-screen bg-black text-white selection:bg-brand-green selection:text-black">
        <Navbar />
        
        <main className="container mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="text-brand-yellow w-6 h-6" />
                <h1 className="text-3xl font-black uppercase tracking-tighter">
                  PAINEL <span className="text-brand-green">ADMIN</span>
                </h1>
              </div>
              <p className="text-gray-400 text-sm">Gerenciamento de acessos e assinaturas manuais.</p>
            </div>

            <div className="flex gap-4">
              <StatCard 
                label="Total Usuários" 
                value={users.length} 
                icon={<Users className="w-4 h-4" />} 
              />
              <StatCard 
                label="Ativos" 
                value={users.filter(u => u.isActive).length} 
                icon={<CheckCircle className="w-4 h-4 text-brand-green" />} 
              />
            </div>
          </div>

          <div className="glass-panel rounded-3xl overflow-hidden border-white/5">
            <AdminUserTable users={users} />
          </div>
        </main>
      </div>
    );
  } catch (error: any) {
    console.error("Admin Page Error:", error);
    
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full glass-panel p-10 rounded-3xl border-red-500/20 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black mb-4 uppercase">Erro no Carregamento do Admin</h1>
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-left overflow-x-auto mb-8 font-mono text-sm">
            {error.message || "Erro desconhecido"}
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Isso geralmente ocorre por falha na conexão com o banco de dados ou erro de autenticação.
          </p>
          <a href="/sfl-admin" className="inline-block bg-white text-black font-black px-8 py-3 rounded-xl hover:bg-gray-200 transition">
            TENTAR NOVAMENTE
          </a>
        </div>
      </div>
    );
  }
}

function StatCard({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex flex-col gap-1">
      <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-black tracking-widest">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-black">{value}</div>
    </div>
  );
}
