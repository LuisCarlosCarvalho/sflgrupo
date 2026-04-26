// src/components/admin/EditUserModal.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { X, User, Mail, Phone, Shield, Lock, CreditCard, Loader2 } from "lucide-react";
import bcrypt from "bcryptjs";
import { User as UserType } from "./UserTable";

interface EditUserModalProps {
  user: UserType;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditUserModal({ user, isOpen, onClose, onSuccess }: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    whatsapp: user.whatsapp || "",
    password: "", // Only update if provided
    planType: user.planType || "PREMIUM",
    role: user.role || "USER",
    isActive: user.isActive,
    expires_at: user.expires_at || new Date().toISOString(),
    notification_active: user.notification_active || false,
    plan_price: user.plan_price || 0
  });

  useEffect(() => {
    setFormData({
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      whatsapp: user.whatsapp || "",
      password: "",
      planType: user.planType || "PREMIUM",
      role: user.role || "USER",
      isActive: user.isActive,
      expires_at: user.expires_at || new Date().toISOString(),
      notification_active: user.notification_active || false,
      plan_price: user.plan_price || 0
    });
  }, [user]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: any = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        whatsapp: formData.whatsapp,
        planType: formData.planType,
        role: formData.role,
        isActive: formData.isActive,
        expires_at: formData.expires_at,
        notification_active: formData.notification_active,
        plan_price: Number(formData.plan_price),
        updatedAt: new Date().toISOString()
      };

      // Only hash and update password if it's not empty
      if (formData.password.trim() !== "") {
        updateData.password = await bcrypt.hash(formData.password, 10);
      }

      const { error } = await supabase
        .from("User")
        .update(updateData)
        .eq("id", user.id);

      if (error) throw error;

      onSuccess();
      onClose();
    } catch (err: any) {
      alert("Erro ao atualizar usuário: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const addDays = (days: number) => {
    const current = new Date(formData.expires_at);
    current.setDate(current.getDate() + days);
    setFormData({ ...formData, expires_at: current.toISOString() });
  };

  const triggerAlert = () => {
    setFormData({ ...formData, notification_active: true });
    alert("Alerta configurado! Salve as alterações para disparar no painel do cliente.");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto py-10 md:py-20">
      <div className="relative bg-[#15192A] border border-white/10 w-full max-w-2xl rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 my-auto">
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-brand-yellow">Editar Usuário</h2>
            <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">Atualize os dados do assinante</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Nome */}
          <div className="space-y-1">
            <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nome Completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" required value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-12 py-3 md:py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm"
                placeholder="Ex: João Silva"
              />
            </div>
          </div>

          {/* Usuário */}
          <div className="space-y-1">
            <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nome de Usuário</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" required value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-12 py-3 md:py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm"
                placeholder="Ex: joaosilva"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="email" required value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-12 py-3 md:py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm"
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div className="space-y-1">
            <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">WhatsApp</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" required value={formData.whatsapp}
                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-12 py-3 md:py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm"
                placeholder="Ex: 5511999999999"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1">
            <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nova Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="password" value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-12 py-3 md:py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm"
                placeholder="Manter atual"
              />
            </div>
          </div>

          {/* Cargo */}
          <div className="space-y-1">
            <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Cargo / Role</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-12 py-3 md:py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm appearance-none"
              >
                <option value="USER" className="bg-[#15192A]">USER</option>
                <option value="ADMIN" className="bg-[#15192A]">ADMIN</option>
              </select>
            </div>
          </div>

          {/* Plano e Valor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Plano Atual</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <select 
                  value={formData.planType}
                  onChange={e => setFormData({...formData, planType: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-12 py-3 md:py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm appearance-none"
                >
                  <option value="FREE" className="bg-[#15192A]">FREE</option>
                  <option value="PREMIUM" className="bg-[#15192A]">PREMIUM</option>
                  <option value="VIP" className="bg-[#15192A]">VIP</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Valor Mensalidade (R$)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600">R$</div>
                <input 
                  type="number" step="0.01" value={formData.plan_price}
                  onChange={e => setFormData({...formData, plan_price: Number(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-12 py-3 md:py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Status da Conta</label>
            <div className="relative">
              <select 
                value={formData.isActive ? "true" : "false"}
                onChange={e => setFormData({...formData, isActive: e.target.value === "true"})}
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-6 py-3 md:py-3.5 focus:outline-none focus:border-brand-yellow transition-all text-sm appearance-none"
              >
                <option value="true" className="bg-[#15192A]">ATIVO</option>
                <option value="false" className="bg-[#15192A]">BLOQUEADO</option>
              </select>
            </div>
          </div>

          {/* Gestão de Assinatura */}
          <div className="md:col-span-2 p-6 rounded-[2rem] bg-black/40 border border-white/5 mt-4 space-y-6">
            <div className="flex items-center gap-3">
              <CreditCard className="text-brand-yellow w-5 h-5" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white">Gestão de Assinatura</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Data de Vencimento</label>
                <div className="flex gap-2">
                  <input 
                    type="date"
                    value={formData.expires_at.split('T')[0]}
                    onChange={e => setFormData({...formData, expires_at: new Date(e.target.value).toISOString()})}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => addDays(30)}
                    className="bg-brand-green/10 hover:bg-brand-green text-brand-green hover:text-black text-[9px] font-black px-4 rounded-xl transition-all border border-brand-green/20 uppercase tracking-widest"
                  >
                    +30 DIAS
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Disparar Alertar (Painel Cliente)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[7, 5, 2].map(days => (
                    <button
                      key={days}
                      type="button"
                      onClick={triggerAlert}
                      className="bg-brand-blue/10 hover:bg-brand-blue text-brand-blue hover:text-white text-[10px] font-black py-3 rounded-xl transition-all border border-brand-blue/20 uppercase"
                    >
                      {days} D
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-brand-yellow/5 rounded-2xl border border-brand-yellow/10">
              <div className={`w-3 h-3 rounded-full ${formData.notification_active ? 'bg-brand-yellow animate-pulse shadow-[0_0_10px_rgba(255,193,7,0.5)]' : 'bg-gray-700'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Alerta de Vencimento: <span className={formData.notification_active ? 'text-brand-yellow' : 'text-gray-600'}>
                  {formData.notification_active ? 'ATIVO NO PAINEL' : 'DESATIVADO'}
                </span>
              </span>
              {formData.notification_active && (
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, notification_active: false})}
                  className="ml-auto text-[9px] font-black uppercase text-red-500 hover:underline"
                >
                  DESATIVAR
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-brand-yellow hover:bg-white text-black font-black py-4 rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-3 mt-4 shadow-xl shadow-brand-yellow/10"
          >
            {loading ? <Loader2 className="animate-spin" /> : "CONFIRMAR E SALVAR TUDO"}
          </button>
        </form>
      </div>
    </div>

  );
}
