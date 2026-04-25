"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Bell, User, Menu, X, ChevronDown, CreditCard, ShoppingBag, LogOut, Trophy, Tv } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import SearchBar from "./SearchBar";

export default function DashboardNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "inicio";
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Início", href: "/dashboard", category: "inicio" },
    { name: "Séries", href: "/dashboard?category=series", category: "series" },
    { name: "Filmes", href: "/dashboard?category=movies", category: "movies" },
    { name: "Bombando", href: "/dashboard?category=trending", category: "trending" },
    { name: "Minha Lista", href: "/dashboard?category=mylist", category: "mylist" },
    { name: "Sport's", href: "/dashboard?category=sports", category: "sports", icon: <Trophy className="w-3 h-3 text-brand-yellow" /> },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? "bg-black/95 backdrop-blur-2xl border-b border-white/5 py-3" : "bg-gradient-to-b from-black/90 to-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <img 
              src="https://i.imgur.com/2ex0N3R.png" 
              alt="SFL Logo" 
              className="h-8 md:h-9 w-auto transition-transform group-hover:scale-105" 
            />
            <span className="text-xl font-black tracking-tighter hidden md:block text-white">
              SFL <span className="text-brand-yellow">STREAM</span>
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                className={`text-[10px] font-black uppercase tracking-widest transition-all hover:text-brand-green flex items-center gap-2 ${
                  currentCategory === link.category ? "text-brand-green" : "text-gray-400"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-white/70">
            <SearchBar />
            
            {/* WhatsApp Icon ANTES do Sininho */}
            <a 
              href={`https://wa.me/${process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '5511928485483'}`}
              target="_blank"
              className="hover:text-brand-green transition-all transform hover:scale-110"
              title="Suporte WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .081 5.363.079 11.969c0 2.112.551 4.173 1.595 5.987L0 24l6.191-1.622a11.851 11.851 0 005.854 1.536h.005c6.603 0 11.967-5.363 11.97-11.97a11.815 11.815 0 00-3.407-8.457z" />
              </svg>
            </a>

            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="hover:text-white transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-green rounded-full shadow-[0_0_10px_#00a651]"></span>
              </button>

              {/* Dropdown de Notificações */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-6 w-80 glass-panel rounded-2xl border-white/5 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Notificações</h3>
                    <span className="text-[8px] font-black bg-brand-green/20 text-brand-green px-2 py-0.5 rounded-full">NOVO</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                      <p className="text-[10px] font-black text-brand-yellow uppercase mb-1">Seja bem-vindo!</p>
                      <p className="text-[10px] text-gray-400 font-medium">Sua conta está ativa e pronta para uso. Explore o catálogo!</p>
                    </div>
                    <div className="p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                      <p className="text-[10px] font-black text-brand-blue uppercase mb-1">Suporte</p>
                      <p className="text-[10px] text-gray-400 font-medium">Precisa de ajuda? Use o ícone do WhatsApp ao lado.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="relative pl-4 border-l border-white/10">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-full bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30 group-hover:bg-brand-blue/40 transition-all overflow-hidden">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="User" />
                ) : (
                  <User className="w-4 h-4 text-brand-blue" />
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-4 w-56 glass-panel rounded-2xl border-white/5 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-white/5 mb-2">
                  <p className="text-[10px] font-black text-brand-green uppercase tracking-widest mb-1">Assinante SFL</p>
                  <p className="text-sm font-bold text-white truncate">{session?.user?.name || "Usuário"}</p>
                  <Link 
                    href="/dashboard/perfil"
                    className="text-[10px] text-brand-green font-bold uppercase hover:underline mt-1 inline-block"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Ver Meu Perfil
                  </Link>
                </div>
                
                {session?.user?.role !== "ADMIN" && (
                  <>
                    <Link 
                      href="/dashboard/meu-plano"
                      className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <CreditCard className="w-4 h-4 text-brand-yellow" />
                      MEU PLANO
                    </Link>
                    
                    <Link 
                      href="/dashboard/meus-pedidos"
                      className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <ShoppingBag className="w-4 h-4 text-brand-blue" />
                      MEUS PEDIDOS
                    </Link>
                  </>
                )}

                {session?.user?.role === "ADMIN" && (
                  <Link 
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-brand-green hover:bg-brand-green/5 rounded-xl transition-all border-t border-white/5 mt-2"
                  >
                    <User className="w-4 h-4" />
                    PAINEL ADMIN
                  </Link>
                )}
                
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-500/5 rounded-xl transition-all mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  SAIR DA CONTA
                </button>
              </div>
            )}
          </div>
          
          <button 
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {/* Mobile Menu (Sidebar Style) */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/95 backdrop-blur-md z-[55] animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="lg:hidden fixed inset-y-0 left-0 w-[300px] z-[60] bg-black border-r border-white/5 animate-in slide-in-from-left duration-300 flex flex-col">
            {/* Header */}
            <div className="p-8 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <img src="https://i.imgur.com/2ex0N3R.png" alt="Logo" className="h-8 w-auto" />
                <span className="text-lg font-black text-white tracking-tighter uppercase">SFL STREAM</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>

            {/* Search (Integrated) */}
            <div className="px-6 py-4">
              <SearchBar fullWidth />
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-4 mb-4">Navegação</p>
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    currentCategory === link.category 
                      ? "bg-brand-blue/10 text-brand-blue border border-brand-blue/20" 
                      : "text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <div className={`${currentCategory === link.category ? "text-brand-blue" : "text-gray-600"}`}>
                    {link.icon || <Tv size={14} />}
                  </div>
                  {link.name}
                </Link>
              ))}

              <div className="pt-8 mt-4 border-t border-white/5">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-4 mb-4">Central de Ajuda</p>
                <a 
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP || '5511928485483'}`}
                  target="_blank"
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-brand-green hover:bg-brand-green/5 transition-all"
                >
                  <div className="p-2 rounded-lg bg-brand-green/10">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.445 0 .081 5.363.079 11.969c0 2.112.551 4.173 1.595 5.987L0 24l6.191-1.622a11.851 11.851 0 005.854 1.536h.005c6.603 0 11.967-5.363 11.97-11.97a11.815 11.815 0 00-3.407-8.457z" />
                    </svg>
                  </div>
                  Suporte WhatsApp
                </a>
              </div>
            </div>

            {/* Footer / User Profile Card */}
            <div className="p-6 mt-auto border-t border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-brand-blue overflow-hidden">
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="User" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-white truncate uppercase tracking-tighter">{session?.user?.name || "Assinante"}</p>
                  <p className="text-[9px] text-gray-500 truncate uppercase font-bold tracking-widest">{session?.user?.role || "CLIENTE"}</p>
                </div>
              </div>

              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-3 bg-red-500/10 text-red-500 font-black py-4 rounded-xl text-[10px] uppercase tracking-widest border border-red-500/20 active:scale-95 transition-all"
              >
                <LogOut size={14} />
                Sair da Conta
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
