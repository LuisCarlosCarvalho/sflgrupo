"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
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
              <Link href="#features" className="hover:text-white transition-colors">Recursos</Link>
              <Link href="#pricing" className="hover:text-white transition-colors">Planos</Link>
              <Link href="#faq" className="hover:text-white transition-colors">Suporte</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="text-sm font-medium hover:text-brand-blue transition-colors cursor-pointer"
            >
              Entrar
            </button>
            <Link 
              href="#pricing" 
              className="bg-brand-green hover:bg-brand-yellow text-black px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 active:scale-95"
            >
              Assinar Agora
            </Link>
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
