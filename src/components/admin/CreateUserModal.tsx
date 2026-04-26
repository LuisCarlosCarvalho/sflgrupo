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
    currency: "BRL",
    connections: 1,
    app_name: "",
    device_type: "SMART TV",
    location: ""
  });

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Hash the password
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      // 2. Definir vencimento inicial (+30 dias)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // 3. Create the user in the User table
      const userId = crypto.randomUUID();

      const { error: userError } = await supabase.from("User").insert({
        id: userId,
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: hashedPassword,
        whatsapp: formData.whatsapp,
        planType: formData.planType,
        plan_price: parseFloat(formData.amount) || 0,
        lastPaymentAmount: parseFloat(formData.amount) || 0,
        lastPaymentCurrency: formData.currency,
        connections: Number(formData.connections),
        app_name: formData.app_name,
        device_type: formData.device_type,
        location: formData.location,
        isActive: true,
        role: "USER",
        expires_at: expiresAt.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      if (userError) throw userError;

      // 3. Registrar Transação Financeira Inicial (Se houver valor)
      if (parseFloat(formData.amount) > 0) {
        await supabase.from("transactions").insert({
          type: 'INCOME',
          category: 'PLAN_RENEWAL',
          amount: parseFloat(formData.amount),
          description: `Primeiro pagamento: ${formData.email}`,
          user_id: userId
        });
      }

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
        currency: "BRL",
        connections: 1,
        app_name: "",
        device_type: "SMART TV",
        location: ""
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

          {/* Localidade */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Localidade (País/Cidade)</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm"
                placeholder="Ex: Portugal"
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

          {/* Configurações de Acesso */}
          <div className="md:col-span-2 p-6 bg-white/5 rounded-[2rem] border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div className="md:col-span-3 mb-2 flex items-center gap-2">
              <Shield className="text-brand-yellow w-5 h-5" />
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Configurações de Acesso</h3>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Pontos (Telas)</label>
              <input 
                type="number" min="1" required 
                value={formData.connections}
                onChange={e => setFormData({...formData, connections: Number(e.target.value)})}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nome do Aplicativo</label>
              <input 
                type="text" 
                value={formData.app_name}
                onChange={e => setFormData({...formData, app_name: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm text-white"
                placeholder="Ex: XCIPTV"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Aparelho / Dispositivo</label>
              <div className="relative">
                <select 
                  value={formData.device_type}
                  onChange={e => setFormData({...formData, device_type: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-6 py-3 md:py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm text-white appearance-none"
                >
                  <option value="TV BOX" className="bg-[#15192A]">TV BOX</option>
                  <option value="SMART TV" className="bg-[#15192A]">SMART TV</option>
                  <option value="ANDROID TV" className="bg-[#15192A]">ANDROID TV</option>
                  <option value="ROKU" className="bg-[#15192A]">ROKU</option>
                  <option value="SAMSUNG" className="bg-[#15192A]">SAMSUNG</option>
                  <option value="LG" className="bg-[#15192A]">LG</option>
                  <option value="CELULAR" className="bg-[#15192A]">CELULAR</option>
                  <option value="OUTROS" className="bg-[#15192A]">OUTROS</option>
                </select>
              </div>
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
