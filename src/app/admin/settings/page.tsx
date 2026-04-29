// src/app/admin/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { Save, Loader2, Tv, RefreshCcw, ExternalLink, Plus, Trash2 } from "lucide-react";

export default function SiteSettingsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [epgUrl, setEpgUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: plansData } = await supabase.from("pricing_plans").select("*").order("name");
    const { data: featuresData } = await supabase.from("site_features").select("*").order("title");
    const { data: settingsData } = await supabase.from("system_settings").select("*").eq("key", "epg_url").single();
    
    if (plansData) setPlans(plansData);
    if (featuresData) setFeatures(featuresData);
    if (settingsData) setEpgUrl(settingsData.value);
    
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

  async function saveEpgUrl() {
    setSaving(true);
    const { error } = await supabase
      .from("system_settings")
      .update({ value: epgUrl })
      .eq("key", "epg_url");
    
    if (error) alert("Erro ao salvar URL: " + error.message);
    else fetchData();
    setSaving(false);
  }

  async function refreshEpg() {
    setRefreshing(true);
    try {
      const response = await fetch("http://localhost:3001/api/admin/refresh", { method: "POST" });
      const data = await response.json();
      if (data.ok) alert("Grade de TV atualizada com sucesso!");
      else alert("Erro no serviço: " + data.error);
    } catch (e) {
      alert("Serviço de EPG está offline ou bloqueado pelo navegador.");
    }
    setRefreshing(false);
  }

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-brand-yellow w-10 h-10" /></div>;

  return (
    <div className="space-y-12 pb-20">
      <header>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-yellow">Ajustes do <span className="text-white">Site</span></h1>
        <p className="text-gray-500 mt-2 font-medium">Gerencie os planos, recursos e o guia de TV da plataforma.</p>
      </header>

      {/* CONFIGURAÇÕES DE TV / EPG */}
      <section className="space-y-6">
        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
          <span className="w-2 h-8 bg-brand-yellow rounded-full"></span>
          Configurações de TV (EPG)
        </h2>

        <div className="glass-panel p-8 rounded-[2rem] border-white/5 space-y-6 max-w-4xl">
          <div className="flex items-center gap-4 p-4 bg-brand-yellow/5 border border-brand-yellow/20 rounded-2xl">
            <Tv className="w-8 h-8 text-brand-yellow" />
            <div>
              <p className="text-xs font-black uppercase text-brand-yellow">Motor de Programação Profissional</p>
              <p className="text-[10px] text-gray-500 font-medium">O arquivo XMLTV deve ser uma URL direta ou .xml.gz</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 font-black uppercase tracking-widest">URL da Fonte de EPG</label>
            <div className="flex gap-4">
              <input 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-medium focus:outline-none focus:border-brand-yellow transition-colors"
                placeholder="Ex: http://u.dnago.top/epg"
                value={epgUrl}
                onChange={(e) => setEpgUrl(e.target.value)}
              />
              <button 
                onClick={saveEpgUrl}
                disabled={saving}
                className="bg-brand-yellow hover:bg-white text-black px-6 py-3 rounded-xl text-xs font-black uppercase transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar URL
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-wrap gap-4">
            <button 
              onClick={refreshEpg}
              disabled={refreshing}
              className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-brand-green hover:bg-white text-black px-8 py-4 rounded-2xl text-xs font-black uppercase transition-all disabled:opacity-50 shadow-lg shadow-brand-green/20"
            >
              {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
              FORÇAR ATUALIZAÇÃO DA GRADE AGORA
            </button>
          </div>
        </div>
      </section>

      {/* PLANOS DE PREÇO */}
      <section className="space-y-6">
        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
          <span className="w-2 h-8 bg-brand-blue rounded-full"></span>
          Planos de Assinatura
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="glass-panel p-8 rounded-[2rem] border-white/5 space-y-6">
              <div className="flex justify-between items-start">
                <input 
                  className="bg-transparent text-xl font-black uppercase tracking-tighter w-full focus:outline-none focus:text-brand-yellow"
                  value={plan.name}
                  onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? {...p, name: e.target.value} : p))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-black uppercase">Preço</label>
                <div className="flex items-center gap-3">
                  <select 
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    value={plan.currency}
                    onChange={(e) => updatePlan(plan.id, { currency: e.target.value })}
                  >
                    <option value="BRL" className="bg-[#15192A]">R$ (BRL)</option>
                    <option value="EUR" className="bg-[#15192A]">€ (EUR)</option>
                  </select>
                  <input 
                    className="bg-transparent text-3xl font-black w-full focus:outline-none"
                    value={plan.price}
                    onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? {...p, price: e.target.value} : p))}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-gray-500 font-black uppercase">Recursos (Um por linha)</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-medium min-h-[120px]"
                  value={plan.features.join("\n")}
                  onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? {...p, features: e.target.value.split("\n")} : p))}
                />
              </div>

              <button 
                onClick={() => updatePlan(plan.id, plan)}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-brand-yellow hover:bg-white text-black px-4 py-3 rounded-xl text-xs font-black uppercase transition-all"
              >
                <Save className="w-3 h-3" />
                Salvar Plano
              </button>
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
              <input 
                className="w-full bg-transparent font-black uppercase tracking-tighter focus:outline-none"
                value={feature.title}
                onChange={(e) => setFeatures(features.map(f => f.id === feature.id ? {...f, title: e.target.value} : f))}
              />
              <textarea 
                className="w-full bg-transparent text-xs text-gray-500 leading-relaxed h-20"
                value={feature.description}
                onChange={(e) => setFeatures(features.map(f => f.id === feature.id ? {...f, description: e.target.value} : f))}
              />
              <button 
                onClick={() => updateFeature(feature.id, feature)}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-brand-green hover:bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all"
              >
                <Save className="w-3 h-3" />
                Salvar
              </button>
            </div>
          ))}
        </div>
      </section>

      {saving && (
        <div className="fixed bottom-10 right-10 bg-brand-green text-black px-6 py-3 rounded-full font-black text-xs flex items-center gap-2 shadow-2xl animate-in slide-in-from-bottom-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          SALVANDO...
        </div>
      )}
    </div>
  );
}
