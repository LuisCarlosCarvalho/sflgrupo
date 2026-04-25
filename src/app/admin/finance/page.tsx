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
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-brand-yellow">
          Controle <span className="text-white">Financeiro</span>
        </h1>
        <p className="text-[10px] md:text-sm text-gray-500 mt-2 font-medium uppercase tracking-widest">Gerenciamento de assinaturas e renovações.</p>
      </header>

      <section>
        <FinanceTable />
      </section>
    </div>
  );
}
