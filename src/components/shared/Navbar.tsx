"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Play } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

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
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-navbar py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="SFL Grupo Logo" 
              className="h-12 w-auto object-contain"
            />
            <span className="text-xl font-black tracking-tighter hidden sm:block">
              SFL <span className="text-brand-yellow">STREAM</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <Link href="#features" className="hover:text-white transition-colors">Recursos</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Planos</Link>
            <Link href="#faq" className="hover:text-white transition-colors">Suporte</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-medium hover:text-brand-blue transition-colors"
          >
            Entrar
          </Link>
          <Link 
            href="/register" 
            className="bg-brand-green hover:bg-brand-yellow text-black px-5 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 active:scale-95"
          >
            Assinar Agora
          </Link>
        </div>
      </div>
    </nav>
  );
}
