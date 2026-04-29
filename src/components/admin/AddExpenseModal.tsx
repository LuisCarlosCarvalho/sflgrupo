"use client";

import { useState } from "react";
import { X, DollarSign, Tag, Calendar, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddExpenseModal({ isOpen, onClose, onSuccess }: AddExpenseModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    currency: "BRL",
    category: "OTHER",
    description: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("transactions")
      .insert({
        type: 'EXPENSE',
        category: formData.category,
        amount: Number(formData.amount),
        currency: formData.currency,
        description: formData.description,
      });

    if (error) {
      console.error("Erro ao salvar despesa:", error);
    } else {
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#15192A] border border-white/10 rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 md:p-12">
          <header className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic">
                Nova <span className="text-red-500">Despesa</span>
              </h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Cadastre um novo gasto no sistema</p>
            </div>
            <button onClick={onClose} className="p-3 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-1">
                <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Moeda</label>
                <select 
                  value={formData.currency}
                  onChange={e => setFormData({...formData, currency: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-4 py-3 md:py-3.5 focus:outline-none focus:border-red-500 transition-all text-sm appearance-none"
                >
                  <option value="BRL" className="bg-[#15192A]">BRL (R$)</option>
                  <option value="EUR" className="bg-[#15192A]">EUR (€)</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Valor</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="number" step="0.01" required
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-12 py-3 md:py-3.5 focus:outline-none focus:border-red-500 transition-all text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Categoria</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-12 py-3 md:py-3.5 focus:outline-none focus:border-red-500 transition-all text-sm appearance-none"
                >
                  <option value="CREDITS" className="bg-[#15192A]">Compra de Créditos</option>
                  <option value="SERVER" className="bg-[#15192A]">Servidor / Infra</option>
                  <option value="OTHER" className="bg-[#15192A]">Outros Gastos</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Descrição</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-600" />
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-12 py-3 md:py-3.5 h-32 focus:outline-none focus:border-red-500 transition-all text-sm resize-none"
                  placeholder="Ex: Compra de 100 créditos para painel principal"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white font-black py-4 rounded-2xl shadow-[0_10px_20px_rgba(239,68,68,0.2)] hover:shadow-[0_10px_30px_rgba(239,68,68,0.4)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "REGISTRAR DESPESA"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
