import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { ShoppingBag, Clock, CheckCircle, ExternalLink, HelpCircle } from "lucide-react";

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Mock de pedidos já que ainda não temos a tabela no banco
  const mockOrders = [
    { id: "SFL-98234", date: "23/04/2026", item: "Plano Premium Ultra (Mensal)", status: "CONCLUÍDO", value: "R$ 54,90" },
    { id: "SFL-97120", date: "22/03/2026", item: "Plano Premium Ultra (Mensal)", status: "CONCLUÍDO", value: "R$ 54,90" },
  ];

  return (
    <main className="min-h-screen bg-black text-white selection:bg-brand-green selection:text-black">
      <DashboardNavbar />
      
      <div className="container mx-auto px-6 md:px-12 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30">
                <ShoppingBag className="text-brand-blue w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter">MEUS <span className="text-brand-blue">PEDIDOS</span></h1>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Histórico de transações e solicitações</p>
              </div>
            </div>

            <button className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-xl text-xs font-black hover:bg-white hover:text-black transition-all">
              <HelpCircle className="w-4 h-4" /> PRECISA DE AJUDA?
            </button>
          </div>

          <div className="glass-panel rounded-[2rem] border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/[0.02] text-[10px] uppercase font-black tracking-widest text-gray-500 border-b border-white/5">
                  <tr>
                    <th className="px-8 py-6">Pedido ID</th>
                    <th className="px-8 py-6">Data</th>
                    <th className="px-8 py-6">Item</th>
                    <th className="px-8 py-6 text-center">Status</th>
                    <th className="px-8 py-6 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="px-8 py-6 font-mono text-xs text-brand-blue">{order.id}</td>
                      <td className="px-8 py-6 text-xs text-gray-400 font-bold">{order.date}</td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-bold">{order.item}</div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-brand-green/20">
                          <CheckCircle className="w-3 h-3" /> {order.status}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right font-black text-white">{order.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-brand-blue/5 p-8 flex items-start gap-4 border-t border-white/5">
              <Clock className="text-brand-blue w-6 h-6 flex-shrink-0" />
              <div>
                <p className="text-xs font-black uppercase text-brand-blue mb-1">Processamento Manual</p>
                <p className="text-[10px] text-gray-400 font-bold max-w-2xl leading-relaxed uppercase tracking-wider">
                  Caso tenha realizado um pagamento via PIX ou Boleto e seu status ainda não tenha sido atualizado, por favor aguarde até 1 hora ou entre em contato com nosso suporte via WhatsApp enviando o comprovante.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[150px] -z-10 rounded-full" />
    </main>
  );
}
