import PlatformsManager from "@/components/admin/PlatformsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin – Carrossel Home SFL",
  description: "Gerencie as logos, downloads e URLs encurtadas do carrossel da Home",
};

export default function AdminPlatformsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-brand-yellow">
          Carrossel <span className="text-white">Home</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm font-medium">
          Gerencie as logos exibidas na tela inicial, defina se estão disponíveis para baixar ou em breve, envie arquivos e gere URLs encurtadas automaticamente.
        </p>
      </header>

      <PlatformsManager />
    </div>
  );
}

