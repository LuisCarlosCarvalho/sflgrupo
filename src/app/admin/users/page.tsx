"use client";

import { useState } from "react";
import UserTable from "@/components/admin/UserTable";
import CreateUserModal from "@/components/admin/CreateUserModal";
import { UserPlus } from "lucide-react";

export default function AdminUsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-yellow">
            Gestão de <span className="text-white">Usuários</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Controle de acessos, bloqueios e novos cadastros.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-brand-green hover:bg-brand-yellow text-black px-8 py-4 rounded-2xl font-black transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-brand-green/10"
        >
          <UserPlus className="w-5 h-5" />
          CADASTRAR USUÁRIO
        </button>
      </header>

      <section>
        <UserTable key={refreshKey} />
      </section>

      <CreateUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleSuccess} 
      />
    </div>
  );
}
