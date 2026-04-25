// src/app/admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Save, Loader2, Plus, Trash2, Edit3, Tv, Smartphone, Globe, ShieldCheck } from "lucide-react";

export default function SiteSettingsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: plansData } = await supabase.from("pricing_plans").select("*").order("name");
    const { data: featuresData } = await supabase.from("site_features").select("*").order("title");
    if (plansData) setPlans(plansData);
    if (featuresData) setFeatures(featuresData);
    setLoading(false);
  }

  async function updatePlan(id: string, updates: any) {
    setSaving(true);
    await supabase.from("pricing_plans").update(updates).eq("id", id);
    fetchData();
    setSaving(false);
  }

  async function updateFeature(id: string, updates: any) {
    setSaving(true);
    await supabase.from("site_features").update(updates).eq("id", id);
    fetchData();
    setSaving(false);
  }

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-brand-yellow w-10 h-10" /></div>;

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-yellow">Ajustes do <span className="text-white">Site</span></h1>
        <p className="text-gray-500 mt-2 font-medium">Gerencie os planos e recursos exibidos na página inicial.</p>
      </header>

      {/* PLANOS DE PREÇO */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
            <span className="w-2 h-8 bg-brand-blue rounded-full"></span>
            Planos de Assinatura
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="glass-panel p-8 rounded-[2rem] border-white/5 space-y-6">
              <div className="flex justify-between items-start">
                <input 
                  className="bg-transparent text-xl font-black uppercase tracking-tighter w-full focus:outline-none focus:text-brand-yellow"
                  value={plan.name}
                  onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? {...p, name: e.target.value} : p))}
                />
                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${
                  plan.color_theme === 'blue' ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20' :
                  plan.color_theme === 'green' ? 'bg-brand-green/10 text-brand-green border-brand-green/20' :
                  'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20'
                }`}>
                  {plan.color_theme}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-black uppercase">Preço e Moeda</label>
                <div className="flex items-center gap-3">
                  <select 
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-brand-yellow"
                    value={plan.currency}
                    onChange={(e) => updatePlan(plan.id, { currency: e.target.value })}
                  >
                    <option value="BRL" className="bg-[#15192A]">R$ (BRL)</option>
                    <option value="EUR" className="bg-[#15192A]">€ (EUR)</option>
                    <option value="USD" className="bg-[#15192A]">$ (USD)</option>
                  </select>
                  <div className="flex items-baseline gap-1 flex-1">
                    <span className="text-sm font-bold text-brand-yellow">
                      {plan.currency === 'BRL' ? 'R$' : plan.currency === 'EUR' ? '€' : '$'}
                    </span>
                    <input 
                      className="bg-transparent text-3xl font-black w-full focus:outline-none"
                      value={plan.price}
                      onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? {...p, price: e.target.value} : p))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-gray-500 font-black uppercase">Recursos (Um por linha)</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-medium focus:outline-none focus:border-white/20 min-h-[120px]"
                  value={plan.features.join("\n")}
                  onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? {...p, features: e.target.value.split("\n")} : p))}
                />
              </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={plan.is_popular}
                      onChange={(e) => updatePlan(plan.id, { is_popular: e.target.checked })}
                    />
                    <div className={`w-4 h-4 rounded border transition-all ${plan.is_popular ? 'bg-brand-green border-brand-green' : 'border-white/20 group-hover:border-white/40'}`} />
                    <span className="text-[10px] font-black uppercase text-gray-500 group-hover:text-gray-300">Mais Popular</span>
                  </label>

                  <button 
                    onClick={() => updatePlan(plan.id, plan)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-brand-yellow hover:bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all disabled:opacity-50"
                  >
                    <Save className="w-3 h-3" />
                    Salvar
                  </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RECURSOS / DIFERENCIAIS */}
      <section className="space-y-6">
        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
          <span className="w-2 h-8 bg-brand-green rounded-full"></span>
          Recursos e Diferenciais
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature.id} className="glass-panel p-6 rounded-3xl border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-white/5 ${
                  feature.color_theme === 'green' ? 'text-brand-green' :
                  feature.color_theme === 'yellow' ? 'text-brand-yellow' :
                  'text-brand-blue'
                }`}>
                  <Tv className="w-5 h-5" />
                </div>
                <select 
                  className="bg-transparent text-[10px] font-black uppercase border-none focus:outline-none text-gray-500"
                  value={feature.color_theme}
                  onChange={(e) => updateFeature(feature.id, { color_theme: e.target.value })}
                >
                  <option value="green">Verde</option>
                  <option value="yellow">Amarelo</option>
                  <option value="blue">Azul</option>
                </select>
              </div>

              <input 
                className="w-full bg-transparent font-black uppercase tracking-tighter focus:outline-none focus:text-brand-yellow"
                value={feature.title}
                onChange={(e) => setFeatures(features.map(f => f.id === feature.id ? {...f, title: e.target.value} : f))}
              />

              <textarea 
                className="w-full bg-transparent text-xs text-gray-500 leading-relaxed focus:outline-none resize-none h-20"
                value={feature.description}
                onChange={(e) => setFeatures(features.map(f => f.id === feature.id ? {...f, description: e.target.value} : f))}
              />

              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={() => updateFeature(feature.id, feature)}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-brand-green hover:bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all disabled:opacity-50"
                >
                  <Save className="w-3 h-3" />
                  Salvar Alteração
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {saving && (
        <div className="fixed bottom-10 right-10 bg-brand-green text-black px-6 py-3 rounded-full font-black text-xs flex items-center gap-2 shadow-2xl animate-in slide-in-from-bottom-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          SALVANDO ALTERAÇÕES...
        </div>
      )}
    </div>
  );
}
