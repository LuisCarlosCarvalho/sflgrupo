import Link from "next/link";
import { Home, Users, CreditCard, Bell, Film, HelpCircle, LogOut, X } from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  onClose?: () => void;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
  { href: "/admin/users", label: "Usuários", icon: <Users className="w-5 h-5" /> },
  { href: "/admin/finance", label: "Finanças", icon: <CreditCard className="w-5 h-5" /> },
  { href: "/admin/alerts", label: "Alertas", icon: <Bell className="w-5 h-5" /> },
  { href: "/admin/content", label: "Conteúdo", icon: <Film className="w-5 h-5" /> },
  { href: "/admin/support", label: "Suporte", icon: <HelpCircle className="w-5 h-5" /> },
  { href: "/admin/settings", label: "Ajustes Site", icon: <Home className="w-5 h-5" /> },
];

export default function Sidebar({ onClose }: SidebarProps) {
  return (
    <nav className="flex flex-col p-8 h-full bg-admin-sidebar">
      <div className="flex items-center justify-between mb-12">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="https://i.imgur.com/2ex0N3R.png" alt="Logo" className="h-9 w-auto" />
          <h2 className="text-xl font-black text-brand-yellow tracking-tighter uppercase">SFL Admin</h2>
        </Link>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-gray-500 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>
      
      <ul className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:bg-white/5 hover:text-white transition-all group border border-transparent hover:border-white/5"
            >
              <div className="group-hover:text-brand-yellow transition-colors">
                {item.icon}
              </div>
              <span>{item.label}</span>
            </Link>
          </li>
        ))}

        <div className="pt-8 pb-4">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] px-5 mb-4">Streaming</p>
          {[
            { name: "Início", href: "/dashboard" },
            { name: "Séries", href: "/dashboard?category=series" },
            { name: "Filmes", href: "/dashboard?category=movies" },
            { name: "Bombando", href: "/dashboard?category=trending" },
            { name: "Minha Lista", href: "/dashboard?category=mylist" },
            { name: "Sport's", href: "/dashboard?category=sports", color: "text-brand-yellow" },
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] text-gray-500 hover:text-white hover:bg-white/5 transition-all ${link.color || ''}`}
              >
                <span>{link.name}</span>
              </Link>
            </li>
          ))}
        </div>
      </ul>

      <button 
        onClick={() => signOut({ callbackUrl: '/' })}
        className="mt-6 flex items-center gap-4 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
      >
        <LogOut className="w-5 h-5" />
        <span>Sair do Painel</span>
      </button>
    </nav>
  );
}
