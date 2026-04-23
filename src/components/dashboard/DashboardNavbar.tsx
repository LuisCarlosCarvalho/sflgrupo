"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Bell, User, Menu, X, ChevronDown, CreditCard, ShoppingBag, LogOut, Trophy } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function DashboardNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
            <span className="text-xl font-black tracking-tighter hidden md:block">
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
            <button className="hover:text-white transition-colors"><Search className="w-5 h-5" /></button>
            <button className="hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-green rounded-full shadow-[0_0_10px_#00a651]"></span>
            </button>
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
                </div>
                
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

                {session?.user?.role === "ADMIN" && (
                  <Link 
                    href="/sfl-admin"
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
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-2xl border-t border-white/5 py-8 px-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-black uppercase tracking-tighter flex items-center gap-3 ${
                  currentCategory === link.category ? "text-brand-green" : "text-white"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
