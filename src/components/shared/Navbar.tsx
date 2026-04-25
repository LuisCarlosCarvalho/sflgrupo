"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Play, User as UserIcon, LogOut, ChevronDown } from "lucide-react";
import LoginModal from "./LoginModal";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "glass-navbar py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <img 
                src="https://i.imgur.com/2ex0N3R.png" 
                alt="SFL Grupo Logo" 
                className="h-8 md:h-10 w-auto group-hover:scale-105 transition-transform" 
              />
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
              <Link href="/#features" className="hover:text-white transition-colors">Recursos</Link>
              <Link href="/#pricing" className="hover:text-white transition-colors">Planos</Link>
              <Link href="/#faq" className="hover:text-white transition-colors">Suporte</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all border border-white/10"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue border border-brand-blue/30 overflow-hidden">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-3 h-3" />
                    )}
                  </div>
                  <span className="text-xs font-bold hidden sm:block">{session.user?.name?.split(' ')[0]}</span>
                  <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 glass-panel rounded-2xl border-white/5 p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                    <Link 
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                      Acessar Dashboard
                    </Link>
                    {session.user?.role === 'ADMIN' && (
                      <Link 
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-brand-yellow hover:bg-brand-yellow/5 rounded-xl transition-all"
                      >
                        Painel Admin
                      </Link>
                    )}
                    <button 
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 rounded-xl transition-all border-t border-white/5 mt-1"
                    >
                      <LogOut className="w-3 h-3" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-sm font-medium hover:text-brand-blue transition-colors cursor-pointer"
                >
                  Entrar
                </button>
                <Link 
                  href="/#pricing" 
                  className="bg-brand-green hover:bg-brand-yellow text-black px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 active:scale-95"
                >
                  Assinar Agora
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}
