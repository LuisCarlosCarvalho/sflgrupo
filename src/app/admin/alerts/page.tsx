// src/app/admin/alerts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import AlertCard from "@/components/admin/AlertCard";
import { Loader2, BellOff } from "lucide-react";

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAlerts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("alerts")
      .select("*, User(email, name)")
      .order("sent_at", { ascending: false });

    if (error) console.error("Erro ao buscar alertas:", error);
    else setAlerts(data || []);
    setLoading(false);
  }

  async function dismissAlert(id: string) {
    const { error } = await supabase.from("alerts").delete().eq("id", id);
    if (error) console.error("Erro ao remover alerta:", error);
    else setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-yellow">
          Sistema de <span className="text-white">Alertas</span>
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Visualize os avisos de vencimento enviados aos clientes.</p>
      </header>

      <section>
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-brand-yellow w-12 h-12" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600 space-y-4">
            <BellOff className="w-16 h-16 opacity-20" />
            <p className="font-bold uppercase tracking-widest text-sm">Nenhum alerta pendente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 max-w-4xl">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onDismiss={dismissAlert} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
