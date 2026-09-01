"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, TrendingDown, Wallet, Plus, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getFinanceOverview } from "@/app/actions/admin";
import AddExpenseModal from "./AddExpenseModal";

interface Transaction {
  id: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  createdAt: Date | string;
}

export default function FinanceTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totals, setTotals] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getFinanceOverview();
      setTransactions(data.transactions as any);
      setTotals({
        income: data.income,
        expense: data.expense,
        balance: data.balance,
      });
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (isMounted) await fetchTransactions();
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (val: number) => {
    return `R$ ${val.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Receita Total */}
        <div className="p-8 rounded-[2rem] bg-[#15192A]/60 border border-brand-green/20 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-brand-green">Entradas</span>
            <div className="p-2 rounded-xl bg-brand-green/10 text-brand-green">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{formatCurrency(totals.income)}</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Total de faturamento</p>
        </div>

        {/* Despesas Total */}
        <div className="p-8 rounded-[2rem] bg-[#15192A]/60 border border-red-500/20 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-red-500">Saídas</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{formatCurrency(totals.expense)}</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Custos operacionais</p>
        </div>

        {/* Lucro Líquido */}
        <div className="p-8 rounded-[2rem] bg-[#15192A]/60 border border-brand-yellow/20 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-black uppercase tracking-widest text-brand-yellow">Lucro Líquido</span>
            <div className="p-2 rounded-xl bg-brand-yellow/10 text-brand-yellow">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-3xl font-black ${totals.balance >= 0 ? "text-white" : "text-red-500"}`}>
            {formatCurrency(totals.balance)}
          </p>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Balanço geral</p>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Extrato de Movimentações</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Histórico detalhado de fluxo de caixa</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-brand-yellow hover:bg-white text-black px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-brand-yellow/10"
        >
          <Plus className="w-4 h-4" />
          Registrar Despesa
        </button>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-[#15192A]/40 backdrop-blur-xl">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-gray-500">
              <th className="px-8 py-5">Tipo</th>
              <th className="px-8 py-5">Categoria</th>
              <th className="px-8 py-5">Descrição</th>
              <th className="px-8 py-5">Data</th>
              <th className="px-8 py-5 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-20 text-center">
                  <Loader2 className="animate-spin text-brand-yellow mx-auto w-8 h-8" />
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                  Nenhuma transação registrada.
                </td>
              </tr>
            ) : (
              transactions.map((t) => {
                const isIncome = t.type === "INCOME";
                return (
                  <tr key={t.id} className="hover:bg-white/[0.01] transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isIncome ? "bg-brand-green/10 text-brand-green" : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        </div>
                        <span className={`font-black text-xs uppercase ${isIncome ? "text-brand-green" : "text-red-500"}`}>
                          {isIncome ? "Entrada" : "Saída"}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase text-gray-400">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-medium text-white text-xs">{t.description || "Sem descrição"}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-gray-500 text-xs font-medium">
                        {new Date(t.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-sm">
                      <span className={isIncome ? "text-brand-green" : "text-red-500"}>
                        {isIncome ? "+" : "-"} {formatCurrency(Number(t.amount))}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchTransactions} />
    </div>
  );
}
