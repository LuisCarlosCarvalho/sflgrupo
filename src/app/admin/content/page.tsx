import TrailerForm from "@/components/admin/TrailerForm";
import { prisma } from "@/lib/prisma";
import { Film } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin – Conteúdo SFL",
  description: "Overrides de trailers e links manuais",
};

async function getOverrides() {
  try {
    return await prisma.trailerOverride.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching trailer overrides:", error);
    return [];
  }
}

export default async function AdminContentPage() {
  const overrides = await getOverrides();

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-brand-yellow">
          Central de <span className="text-white">Conteúdo</span>
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Configure links manuais para trailers de filmes específicos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <TrailerForm />

        <div className="space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tight ml-1">Configurações Ativas</h2>
          <div className="space-y-3">
            {overrides.length === 0 ? (
              <p className="text-gray-600 font-medium italic">Nenhum override configurado.</p>
            ) : (
              overrides.map((ov) => (
                <div
                  key={ov.id}
                  className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-white/[0.08] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-300">Filme ID: {ov.mediaId}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[200px]">{ov.youtubeUrl}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
