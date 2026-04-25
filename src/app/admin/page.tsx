import Link from "next/link";
import { Users, CreditCard, AlertTriangle, Film, HelpCircle, ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "Admin – Dashboard SFL",
  description: "Visão geral do painel administrativo",
};

const stats = [
  { label: "Usuários", href: "/admin/users", icon: Users, color: "text-brand-green", bg: "bg-brand-green/10" },
  { label: "Finanças", href: "/admin/finance", icon: CreditCard, color: "text-brand-yellow", bg: "bg-brand-yellow/10" },
  { label: "Alertas", href: "/admin/alerts", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
  { label: "Conteúdo", href: "/admin/content", icon: Film, color: "text-brand-blue", bg: "bg-brand-blue/10" },
  { label: "Suporte", href: "/admin/support", icon: HelpCircle, color: "text-brand-yellow", bg: "bg-brand-yellow/10" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-12">
      <header className="relative">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-brand-yellow/10 blur-[120px] rounded-full -z-10" />
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
          Painel <span className="text-brand-yellow">Administrativo</span>
        </h1>
        <p className="text-gray-500 mt-4 text-lg font-medium max-w-2xl">
          Bem-vindo ao centro de comando SFL STREAM. Gerencie usuários, finanças e suporte em um só lugar.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative bg-[#15192A]/50 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] hover:border-brand-yellow/30 transition-all duration-500 overflow-hidden"
          >
            <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <item.icon className="w-7 h-7" />
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-1">{item.label}</h3>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Acessar Módulo</p>
              </div>
              <ArrowUpRight className="w-6 h-6 text-gray-700 group-hover:text-brand-yellow group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
            </div>

            {/* Hover Decor */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}
