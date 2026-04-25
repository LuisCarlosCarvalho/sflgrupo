// src/components/admin/CreateUserModal.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { X, User, Mail, Phone, Shield, Lock, CreditCard, Loader2, Globe } from "lucide-react";
import bcrypt from "bcryptjs";

export default function CreateUserModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    whatsapp: "",
    password: "",
    planType: "PREMIUM",
    amount: "",
    currency: "BRL"
  });

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Hash the password
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      // 2. Create the user in the User table
      // Note: We generate a simple CUID-like ID or let the DB handle it if it was uuid, 
      // but the User table uses text IDs. We'll generate a random string for now or use crypto.randomUUID()
      const userId = crypto.randomUUID();

      const { error: userError } = await supabase.from("User").insert({
        id: userId,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: hashedPassword,
        whatsapp: formData.whatsapp,
        planType: formData.planType,
        lastPaymentAmount: parseFloat(formData.amount) || 0,
        lastPaymentCurrency: formData.currency,
        isActive: true,
        role: "USER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      if (userError) throw userError;

      // 3. Create initial plan record in "plans" table
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const { error: planError } = await supabase.from("plans").insert({
        user_id: userId,
        plan_name: formData.planType,
        activated_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString()
      });

      if (planError) throw planError;

      onSuccess();
      onClose();
      setFormData({
        name: "",
        username: "",
        email: "",
        whatsapp: "",
        password: "",
        planType: "PREMIUM",
        amount: "",
        currency: "BRL"
      });
    } catch (err: any) {
      alert("Erro ao cadastrar usuário: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#15192A] border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-brand-yellow">Cadastrar Usuário</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Adicione um novo assinante manualmente</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" required value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm"
                placeholder="Ex: João Silva"
              />
            </div>
          </div>

          {/* Usuário */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nome de Usuário</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" required value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm"
                placeholder="Ex: joaosilva"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="email" required value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm"
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">WhatsApp (DDI + DDD + Numero)</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" required value={formData.whatsapp}
                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm"
                placeholder="Ex: 5511999999999"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Senha de Acesso</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" required value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Plano */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Plano Adquirido</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <select 
                value={formData.planType}
                onChange={e => setFormData({...formData, planType: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm appearance-none"
              >
                <option value="FREE" className="bg-[#15192A]">FREE</option>
                <option value="PREMIUM" className="bg-[#15192A]">PREMIUM</option>
                <option value="VIP" className="bg-[#15192A]">VIP</option>
              </select>
            </div>
          </div>

          {/* Valor e Moeda */}
          <div className="space-y-1 md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Valor</label>
              <input 
                type="number" step="0.01" required value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm"
                placeholder="0,00"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Moeda</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <select 
                  value={formData.currency}
                  onChange={e => setFormData({...formData, currency: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm appearance-none"
                >
                  <option value="BRL" className="bg-[#15192A]">Real (R$)</option>
                  <option value="EUR" className="bg-[#15192A]">Euro (€)</option>
                  <option value="USD" className="bg-[#15192A]">Dólar ($)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-brand-yellow hover:bg-white text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : "FINALIZAR CADASTRO"}
          </button>
        </form>
      </div>
    </div>
  );
}
