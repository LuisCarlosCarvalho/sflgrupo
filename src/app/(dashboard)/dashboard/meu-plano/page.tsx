import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { CreditCard, CheckCircle, ShieldCheck, Zap } from "lucide-react";

export default async function MyPlanPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  if (!user) redirect("/login");

  const planDetails = {
    FREE: { name: "Gratuito", price: "R$ 0,00", features: ["Acesso Limitado", "Resolução SD", "Com anúncios"] },
    BASIC: { name: "Básico", price: "R$ 19,90", features: ["Todo o Catálogo", "Resolução HD", "1 Tela"] },
    STANDARD: { name: "Padrão", price: "R$ 34,90", features: ["Resolução Full HD", "2 Telas Simultâneas", "Sem Anúncios"] },
    PREMIUM: { name: "Premium Ultra", price: "R$ 54,90", features: ["Resolução 4K + HDR", "4 Telas Simultâneas", "Download para Offline", "Suporte Prioritário"] },
  };

  const currentPlan = planDetails[user.planType as keyof typeof planDetails] || planDetails.FREE;

  return (
    <main className="min-h-screen bg-black text-white selection:bg-brand-green selection:text-black">
      <DashboardNavbar />
      
      <div className="container mx-auto px-6 md:px-12 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/20 flex items-center justify-center border border-brand-green/30">
              <CreditCard className="text-brand-green w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">MEU <span className="text-brand-green">PLANO</span></h1>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Detalhes da sua assinatura SFL Stream</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Status Card */}
            <div className="md:col-span-2 glass-panel p-10 rounded-[2.5rem] border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8">
                  <Zap className="w-20 h-20 text-brand-green/5 group-hover:text-brand-green/10 transition-colors" />
               </div>
               
               <div className="relative">
                  <span className={`inline-block px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border ${
                    user.isActive ? "bg-brand-green/10 text-brand-green border-brand-green/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                  }`}>
                    {user.isActive ? "Assinatura Ativa" : "Pagamento Pendente"}
                  </span>
                  
                  <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-2">
                    {currentPlan.name}
                  </h2>
                  <p className="text-3xl font-black text-brand-yellow mb-8">{currentPlan.price}<span className="text-sm text-gray-500 font-bold"> /mês</span></p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentPlan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                        <CheckCircle className="w-4 h-4 text-brand-green" />
                        {feature}
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col gap-4">
               <div className="glass-panel p-8 rounded-3xl border-white/5 text-center">
                  <ShieldCheck className="w-10 h-10 text-brand-blue mx-auto mb-4" />
                  <h4 className="font-black uppercase text-sm mb-2">Segurança SFL</h4>
                  <p className="text-[10px] text-gray-500 font-bold leading-relaxed">Sua assinatura é protegida por criptografia de ponta a ponta.</p>
               </div>
               <button className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-brand-green transition-all transform active:scale-95">
                  ALTERAR PLANO
               </button>
               <button className="w-full bg-red-500/10 text-red-500 font-black py-4 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                  CANCELAR
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed top-1/2 left-0 w-96 h-96 bg-brand-green/5 blur-[150px] -z-10 rounded-full" />
    </main>
  );
}
