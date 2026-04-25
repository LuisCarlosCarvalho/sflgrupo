"use client";

import Sidebar from "@/components/admin/Sidebar";
import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-[100] w-72 bg-[#15192A] border-r border-white/5 transition-transform duration-300 transform
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:inset-auto lg:z-0
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-6 border-b border-white/5 bg-[#15192A]/50 backdrop-blur-xl sticky top-0 z-[80]">
          <div className="flex items-center gap-2">
            <img src="https://i.imgur.com/2ex0N3R.png" alt="Logo" className="h-6 w-auto" />
            <h2 className="text-sm font-black text-brand-yellow tracking-tighter uppercase">SFL Admin</h2>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-xl bg-white/5 text-white"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
