"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Play, User as UserIcon, LogOut, ChevronDown, Menu, X } from "lucide-react";
import LoginModal from "./LoginModal";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const menuLinks = [
    { name: "Recursos", href: "/#features" },
    { name: "Planos", href: "/#pricing" },
    { name: "Suporte", href: "/#faq" },
  ];

  const authLinks = [
    { name: "Início", href: "/dashboard" },
    { name: "Séries", href: "/dashboard?category=series" },
    { name: "Filmes", href: "/dashboard?category=movies" },
    { name: "Bombando", href: "/dashboard?category=trending" },
    { name: "Minha Lista", href: "/dashboard?category=mylist" },
    { name: "Sport's", href: "/dashboard?category=sports" },
  ];

  const displayLinks = session ? authLinks : menuLinks;

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
            
            <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
              {displayLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`hover:text-brand-green transition-colors ${
                    link.name === "Sport's" ? "text-brand-yellow" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
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

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[60] flex justify-end">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <div className="relative w-full max-w-[300px] bg-black h-full border-l border-white/10 p-8 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between mb-12">
                <img 
                  src="https://i.imgur.com/2ex0N3R.png" 
                  alt="SFL Logo" 
                  className="h-8 w-auto" 
                />
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                {displayLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-black uppercase tracking-tighter hover:text-brand-green transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto space-y-6">
                {!session ? (
                  <>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsLoginModalOpen(true);
                      }}
                      className="w-full py-4 text-center text-lg font-bold border border-white/10 rounded-2xl hover:bg-white/5 transition-all"
                    >
                      Entrar
                    </button>
                    <Link 
                      href="/#pricing"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-4 text-center text-lg font-black bg-brand-green text-black rounded-2xl shadow-lg shadow-brand-green/20"
                    >
                      ASSINAR AGORA
                    </Link>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Link 
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-4 text-center text-lg font-black bg-white/5 text-white border border-white/10 rounded-2xl"
                    >
                      DASHBOARD
                    </Link>
                    <button 
                      onClick={() => signOut()}
                      className="w-full py-4 text-center text-lg font-bold text-red-500 bg-red-500/5 rounded-2xl"
                    >
                      SAIR
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}

