// src/app/admin/finance/page.tsx
import FinanceTable from "@/components/admin/FinanceTable";

export const metadata = {
  title: "Admin – Finanças SFL",
  description: "Gerenciamento de planos e renovações",
};

export default function AdminFinancePage() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-yellow">
          Controle <span className="text-white">Financeiro</span>
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Gerencie as assinaturas e renovações dos clientes.</p>
      </header>

      <section>
        <FinanceTable />
      </section>
    </div>
  );
}
