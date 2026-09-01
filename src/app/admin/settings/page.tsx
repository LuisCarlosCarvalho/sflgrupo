"use client";

import { useState, useEffect } from "react";
import { getSettingsData, updatePricingPlan, updateSiteFeature, saveSystemSetting } from "@/app/actions/settings";
import { Save, Loader2, Tv, RefreshCcw } from "lucide-react";

export default function SiteSettingsPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [epgUrl, setEpgUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (isMounted) await fetchData();
    };
    load();
    return () => { isMounted = false; };
  }, []);

  async function fetchData() {
    const data = await getSettingsData();
    if (data.plans) setPlans(data.plans);
    if (data.features) setFeatures(data.features);
    if (data.epgUrl) setEpgUrl(data.epgUrl);
    setLoading(false);
  }

  async function handleUpdatePlan(id: string, updates: any) {
    setSaving(true);
    await updatePricingPlan(id, updates);
    await fetchData();
    setSaving(false);
  }

  async function handleUpdateFeature(id: string, updates: any) {
    setSaving(true);
    await updateSiteFeature(id, updates);
    await fetchData();
    setSaving(false);
  }

  async function handleSaveEpgUrl() {
    setSaving(true);
    try {
      await saveSystemSetting("epg_url", epgUrl);
      await fetchData();
    } catch (error: any) {
      alert("Erro ao salvar URL: " + error.message);
    }
    setSaving(false);
  }

  async function refreshEpg() {
    setRefreshing(true);
    try {
      const response = await fetch("http://localhost:3001/api/admin/refresh", { method: "POST" });
      const data = await response.json();
      if (data.ok) alert("Grade de TV atualizada com sucesso!");
      else alert("Erro no serviço: " + data.error);
    } catch (err) {
      console.error(err);
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
                onClick={handleSaveEpgUrl}
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
                <label className="text-[10px] text-gray-500 font-black uppercase">Preço BRL (R$)</label>
                <input 
                  className="bg-transparent text-3xl font-black w-full focus:outline-none"
                  value={plan.priceBrl ?? 0}
                  type="number"
                  onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? {...p, priceBrl: parseFloat(e.target.value) || 0} : p))}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-gray-500 font-black uppercase">Recursos (Um por linha)</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-medium min-h-[120px]"
                  value={(plan.features || []).join("\n")}
                  onChange={(e) => setPlans(plans.map(p => p.id === plan.id ? {...p, features: e.target.value.split("\n")} : p))}
                />
              </div>

              <button 
                onClick={() => handleUpdatePlan(plan.id, plan)}
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
                onClick={() => handleUpdateFeature(feature.id, feature)}
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
