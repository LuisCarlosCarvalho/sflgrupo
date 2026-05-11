"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Loader2, TrendingUp, TrendingDown, Wallet, Plus, Calendar, ArrowUpRight, ArrowDownRight, Globe } from "lucide-react";
import AddExpenseModal from "./AddExpenseModal";

interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  currency: string;
  description: string;
  created_at: string;
  User?: { email: string; name: string | null };
}

export default function FinanceTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState<'BRL' | 'EUR'>('BRL');
  
  const [totals, setTotals] = useState({
    BRL: { income: 0, expense: 0, balance: 0 },
    EUR: { income: 0, expense: 0, balance: 0 }
  });

  const fetchTransactions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transactions")
      .select("id, type, category, amount, currency, description, created_at, User(email, name)")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Erro ao buscar transações:", error);
    } else {
      const txs = data as unknown as Transaction[];
      setTransactions(txs);
      
      const newTotals = {
        BRL: { income: 0, expense: 0, balance: 0 },
        EUR: { income: 0, expense: 0, balance: 0 }
      };

      txs.forEach(t => {
        const curr = (t.currency || 'BRL') as 'BRL' | 'EUR';
        const amount = Number(t.amount);
        
        if (t.type === 'INCOME') {
          newTotals[curr].income += amount;
        } else {
          newTotals[curr].expense += amount;
        }
      });

      newTotals.BRL.balance = newTotals.BRL.income - newTotals.BRL.expense;
      newTotals.EUR.balance = newTotals.EUR.income - newTotals.EUR.expense;

      setTotals(newTotals);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: currency 
    }).format(value);
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

  const filteredTransactions = transactions.filter(t => (t.currency || 'BRL') === activeCurrency);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Currency Switcher */}
      <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl w-fit border border-white/10">
        <button
          onClick={() => setActiveCurrency('BRL')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeCurrency === 'BRL' ? 'bg-brand-yellow text-black' : 'text-gray-500 hover:text-white'
          }`}
        >
          <Globe className="w-3 h-3" />
          Real (BRL)
        </button>
        <button
          onClick={() => setActiveCurrency('EUR')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeCurrency === 'EUR' ? 'bg-brand-blue text-white shadow-[0_0_20px_rgba(0,122,255,0.2)]' : 'text-gray-500 hover:text-white'
          }`}
        >
          <Globe className="w-3 h-3" />
          Euro (EUR)
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[2.5rem] bg-[#15192A]/50 border border-white/5 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <TrendingUp size={80} />
          </div>
          <div className="flex items-center justify-between mb-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 flex items-center justify-center">
              <TrendingUp className="text-brand-green w-6 h-6" />
            </div>
            <ArrowUpRight className="text-brand-green/30 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Entradas ({activeCurrency})</p>
          <h3 className="text-3xl font-black text-white mt-1 italic tracking-tighter">
            {formatCurrency(totals[activeCurrency].income, activeCurrency)}
          </h3>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-[#15192A]/50 border border-white/5 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <TrendingDown size={80} />
          </div>
          <div className="flex items-center justify-between mb-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <TrendingDown className="text-red-500 w-6 h-6" />
            </div>
            <ArrowDownRight className="text-red-500/30 w-5 h-5 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Saídas ({activeCurrency})</p>
          <h3 className="text-3xl font-black text-white mt-1 italic tracking-tighter">
            {formatCurrency(totals[activeCurrency].expense, activeCurrency)}
          </h3>
        </div>

        <div className={`p-8 rounded-[2.5rem] border backdrop-blur-md relative overflow-hidden group transition-all ${
          activeCurrency === 'BRL' ? 'bg-brand-yellow/10 border-brand-yellow/20' : 'bg-brand-blue/10 border-brand-blue/20'
        }`}>
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Wallet size={80} />
          </div>
          <div className="flex items-center justify-between mb-4 relative">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              activeCurrency === 'BRL' ? 'bg-brand-yellow/20 text-brand-yellow' : 'bg-brand-blue/20 text-brand-blue'
            }`}>
              <Wallet className="w-6 h-6" />
            </div>
            <div className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
              activeCurrency === 'BRL' ? 'bg-brand-yellow/20 text-brand-yellow' : 'bg-brand-blue/20 text-brand-blue'
            }`}>Saldo</div>
          </div>
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${activeCurrency === 'BRL' ? 'text-gray-700' : 'text-gray-400'}`}>Saldo Líquido</p>
          <h3 className="text-3xl font-black text-white mt-1 italic tracking-tighter">
            {formatCurrency(totals[activeCurrency].balance, activeCurrency)}
          </h3>
        </div>
      </div>

      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Fluxo em <span className={activeCurrency === 'BRL' ? 'text-brand-yellow' : 'text-brand-blue'}>{activeCurrency === 'BRL' ? 'Real' : 'Euro'}</span></h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Transações filtradas por moeda</p>
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
            ) : filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <p className="text-gray-500 font-black uppercase text-xs">Nenhuma movimentação em {activeCurrency}</p>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
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
                    {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount, t.currency || 'BRL')}
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
