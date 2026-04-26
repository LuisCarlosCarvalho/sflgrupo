"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2, TrendingUp, TrendingDown, Wallet, Plus, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import AddExpenseModal from "./AddExpenseModal";

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  description: string;
  created_at: string;
  User?: { email: string; name: string | null };
}

export default function FinanceTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [totals, setTotals] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });

  async function fetchTransactions() {
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("id, type, category, amount, description, created_at, User(email, name)")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar transações:", error);
    } else {
      const txs = data as any[];
      setTransactions(txs);
      
      const income = txs.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + Number(t.amount), 0);
      const expense = txs.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + Number(t.amount), 0);
      setTotals({
        income,
        expense,
        balance: income - expense
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'PLAN_RENEWAL': 'RENOVAÇÃO',
      'CREDITS': 'CRÉDITOS',
      'SERVER': 'SERVIDOR',
      'OTHER': 'OUTROS'
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[2.5rem] bg-[#15192A]/50 border border-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center">
              <TrendingUp className="text-brand-green w-6 h-6" />
            </div>
            <ArrowUpRight className="text-brand-green/30 w-5 h-5" />
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Total Entradas</p>
          <h3 className="text-3xl font-black text-white mt-1 italic tracking-tighter">
            {formatCurrency(totals.income)}
          </h3>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-[#15192A]/50 border border-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <TrendingDown className="text-red-500 w-6 h-6" />
            </div>
            <ArrowDownRight className="text-red-500/30 w-5 h-5" />
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Total Saídas</p>
          <h3 className="text-3xl font-black text-white mt-1 italic tracking-tighter">
            {formatCurrency(totals.expense)}
          </h3>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-brand-yellow/10 border border-brand-yellow/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-yellow/20 flex items-center justify-center">
              <Wallet className="text-brand-yellow w-6 h-6" />
            </div>
            <div className="px-2 py-1 rounded bg-brand-yellow/20 text-[8px] font-black text-brand-yellow uppercase">Líquido</div>
          </div>
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em]">Lucro Líquido</p>
          <h3 className="text-3xl font-black text-white mt-1 italic tracking-tighter">
            {formatCurrency(totals.balance)}
          </h3>
        </div>
      </div>

      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Fluxo de <span className="text-brand-yellow">Caixa</span></h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Histórico completo de movimentações</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-yellow text-black font-black px-6 py-3 rounded-xl text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-[0_10px_20px_rgba(255,221,0,0.2)]"
        >
          <Plus className="w-4 h-4" />
          ADICIONAR DESPESA
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-[#15192A]/30 backdrop-blur-md">
        <table className="min-w-full divide-y divide-white/5 text-sm">
          <thead className="bg-black/40">
            <tr>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">Data</th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">Descrição</th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gray-500">Categoria</th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-gray-500">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <Loader2 className="animate-spin text-brand-yellow mx-auto" size={40} />
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <p className="text-gray-500 font-black uppercase text-xs">Nenhuma movimentação registrada</p>
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                        <Calendar className="w-3 h-3 text-gray-500" />
                      </div>
                      <span className="text-[11px] text-gray-400 font-bold">{new Date(t.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-xs uppercase tracking-wide">{t.description}</span>
                      {t.User && <span className="text-[10px] text-gray-500 font-medium">Cliente: {t.User.email}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase ${
                      t.type === 'INCOME' ? 'bg-brand-green/10 text-brand-green' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {getCategoryLabel(t.category)}
                    </span>
                  </td>
                  <td className={`px-8 py-5 text-right font-black text-sm italic ${
                    t.type === 'INCOME' ? 'text-brand-green' : 'text-red-500'
                  }`}>
                    {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTransactions} 
      />
    </div>
  );
}
