// src/app/admin/layout.tsx
import Sidebar from "@/components/admin/Sidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white">
      <div className="w-64 border-r border-white/5 bg-[#15192A]">
        <Sidebar />
      </div>
      <main className="flex-1 p-10 md:p-16 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export const metadata = {
  title: "Painel Administrativo SFL",
  description: "Administração de usuários, finanças, conteúdo e suporte",
};
