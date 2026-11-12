"use client";

import { useState, useEffect, useRef } from "react";
import {
  getAllHomePlatformsAdmin,
  createHomePlatform,
  updateHomePlatform,
  deleteHomePlatform,
  seedDefaultHomePlatforms,
  type HomePlatformItem,
} from "@/app/actions/platforms";
import {
  Plus,
  Upload,
  Link2,
  Copy,
  Check,
  Trash2,
  Pencil,
  Download,
  Clock,
  Loader2,
  Sparkles,
  ExternalLink,
  X,
  BookOpen,
} from "lucide-react";

const GRADIENT_PRESETS = [
  { label: "LG (Verde/Teal)", value: "from-emerald-400 via-teal-400 to-cyan-500" },
  { label: "Android TV (Azul)", value: "from-sky-400 via-blue-500 to-indigo-600" },
  { label: "Fire TV (Rosa/Laranja)", value: "from-pink-400 via-rose-400 to-amber-300" },
  { label: "Samsung (Roxo/Ciano)", value: "from-indigo-400 via-purple-400 to-cyan-400" },
  { label: "Ouro / Amarelo", value: "from-amber-400 via-yellow-500 to-orange-500" },
  { label: "Vermelho / Coral", value: "from-red-500 via-rose-500 to-pink-500" },
  { label: "Escuro Premium", value: "from-slate-700 via-slate-800 to-zinc-900" },
];

export default function PlatformsManager() {
  const [items, setItems] = useState<HomePlatformItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"AVAILABLE" | "COMING_SOON" | "HOW_TO_INSTALL">("AVAILABLE");
  const [fileUrl, setFileUrl] = useState("");
  const [gradient, setGradient] = useState(GRADIENT_PRESETS[0].value);
  const [order, setOrder] = useState(0);
  const [active, setActive] = useState(true);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadItems() {
    setLoading(true);
    try {
      const data = await getAllHomePlatformsAdmin();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setLogoUrl("");
    setDescription("");
    setStatus("AVAILABLE");
    setFileUrl("");
    setGradient(GRADIENT_PRESETS[0].value);
    setOrder(items.length + 1);
    setActive(true);
  }

  function startEdit(item: HomePlatformItem) {
    setEditingId(item.id);
    setName(item.name);
    setLogoUrl(item.logoUrl);
    setDescription(item.description);
    setStatus(
      item.status === "AVAILABLE" || item.status === "HOW_TO_INSTALL"
        ? item.status
        : "COMING_SOON"
    );
    setFileUrl(item.fileUrl || "");
    setGradient(item.gradient || GRADIENT_PRESETS[0].value);
    setOrder(item.order);
    setActive(item.active);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleUpload(file: File, target: "logo" | "file") {
    if (target === "logo") setUploadingLogo(true);
    else setUploadingFile(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Erro ao enviar arquivo.");
        return;
      }

      if (target === "logo") {
        setLogoUrl(data.url);
      } else {
        setFileUrl(data.url);
      }
    } catch (err) {
      console.error(err);
      alert("Falha no upload do arquivo.");
    } finally {
      if (target === "logo") setUploadingLogo(false);
      else setUploadingFile(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !logoUrl.trim()) {
      alert("Preencha o nome e a logo.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        logoUrl,
        description,
        status,
        fileUrl: fileUrl || null,
        gradient,
        order,
        active,
      };

      if (editingId) {
        await updateHomePlatform(editingId, payload);
      } else {
        await createHomePlatform(payload);
      }

      resetForm();
      await loadItems();
    } catch (err: any) {
      alert(err?.message || "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este item do carrossel?")) return;
    setSaving(true);
    try {
      await deleteHomePlatform(id);
      if (editingId === id) resetForm();
      await loadItems();
    } finally {
      setSaving(false);
    }
  }

  async function handleSeedDefaults() {
    setSaving(true);
    try {
      await seedDefaultHomePlatforms();
      await loadItems();
    } finally {
      setSaving(false);
    }
  }

  function getFullShortUrl(shortCode: string) {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/d/${shortCode}`;
    }
    return `/d/${shortCode}`;
  }

  function copyShortUrl(id: string, shortCode: string) {
    navigator.clipboard.writeText(getFullShortUrl(shortCode));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Formulário */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 bg-white/5 border border-white/10 rounded-[2rem] p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-yellow/10 flex items-center justify-center text-brand-yellow">
                {editingId ? <Pencil size={20} /> : <Plus size={20} />}
              </div>
              <h2 className="text-lg font-black uppercase tracking-tight text-white">
                {editingId ? "Editar Logo / App" : "Nova Logo no Carrossel"}
              </h2>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white"
                title="Cancelar edição"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
              Nome da Plataforma
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: LG, Android TV, Fire TV, Samsung"
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-yellow"
            />
          </div>

          {/* Logo URL ou Upload */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
              Logo (URL ou Enviar Imagem)
            </label>
            <div className="flex gap-2">
              <input
                required
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://... ou envie a imagem"
                className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-yellow"
              />
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f, "logo");
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                disabled={uploadingLogo}
                onClick={() => logoInputRef.current?.click()}
                className="px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Logo
              </button>
            </div>
          </div>

          {/* Preview do Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/30 border border-white/5">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} p-2.5 flex flex-col items-center justify-between border border-white/20 flex-shrink-0`}
            >
              <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="Preview" className="max-w-[80%] max-h-10 object-contain drop-shadow" />
                ) : (
                  <span className="text-[10px] text-white/70 font-bold">LOGO</span>
                )}
              </div>
              <span className="px-2 py-0.5 rounded-full bg-black/40 text-[8px] font-black uppercase text-white">
                {status === "AVAILABLE"
                  ? "Baixar"
                  : status === "HOW_TO_INSTALL"
                  ? "Como Instalar"
                  : "Breve"}
              </span>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <p className="font-bold text-white">Pré-visualização do Card</p>
              <p>Aparece assim no carrossel da tela Home.</p>
            </div>
          </div>

          {/* Gradiente */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
              Cor / Gradiente do Card
            </label>
            <div className="grid grid-cols-7 gap-2">
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  title={preset.label}
                  onClick={() => setGradient(preset.value)}
                  className={`h-9 rounded-xl bg-gradient-to-br ${preset.value} transition-all ${
                    gradient === preset.value
                      ? "ring-2 ring-brand-yellow scale-105"
                      : "opacity-65 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
              Status de Disponibilidade
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setStatus("AVAILABLE")}
                className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-2xl text-[11px] font-black uppercase tracking-wider border transition-all ${
                  status === "AVAILABLE"
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                    : "bg-black/30 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <Download className="w-4 h-4 flex-shrink-0" />
                Baixar
              </button>
              <button
                type="button"
                onClick={() => setStatus("COMING_SOON")}
                className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-2xl text-[11px] font-black uppercase tracking-wider border transition-all ${
                  status === "COMING_SOON"
                    ? "bg-amber-500/20 border-amber-400 text-amber-300"
                    : "bg-black/30 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <Clock className="w-4 h-4 flex-shrink-0" />
                Breve
              </button>
              <button
                type="button"
                onClick={() => setStatus("HOW_TO_INSTALL")}
                className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-2xl text-[11px] font-black uppercase tracking-wider border transition-all ${
                  status === "HOW_TO_INSTALL"
                    ? "bg-sky-500/20 border-sky-400 text-sky-300"
                    : "bg-black/30 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <BookOpen className="w-4 h-4 flex-shrink-0" />
                Como Instalar
              </button>
            </div>
          </div>

          {/* Arquivo ou URL do arquivo */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
              Arquivo para Download (Carregar Arquivo ou URL)
            </label>
            <div className="flex gap-2">
              <input
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://... ou envie um arquivo (até 4MB)"
                className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-yellow"
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUpload(f, "file");
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                disabled={uploadingFile}
                onClick={() => fileInputRef.current?.click()}
                className="px-4 rounded-2xl bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-blue border border-brand-blue/30 text-xs font-black flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {uploadingFile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Arquivo
              </button>
            </div>
            <p className="text-[11px] text-gray-500 ml-2 flex items-center gap-1.5">
              <Link2 className="w-3 h-3 text-brand-yellow" />
              Ao salvar com arquivo ou URL, uma <strong>URL encurtada</strong> é criada automaticamente.
            </p>
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
              Descrição
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explique sobre o app, como baixar ou previsão de lançamento..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-yellow min-h-[95px]"
            />
          </div>

          {/* Ordem e Ativo */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">
                Ordem
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer mt-4 ml-2">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-5 h-5 accent-brand-yellow rounded"
              />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Visível na Home
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-yellow hover:bg-brand-yellow/90 text-black font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg shadow-brand-yellow/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {editingId ? "Salvar Alterações" : "Adicionar ao Carrossel"}
          </button>
        </form>

        {/* Lista de Itens */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">
              Logos Cadastradas ({items.length})
            </h3>
            {items.length === 0 && !loading && (
              <button
                type="button"
                onClick={handleSeedDefaults}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow hover:text-black text-xs font-black uppercase transition-all border border-brand-yellow/30"
              >
                <Sparkles className="w-4 h-4" />
                Carregar Logos Padrão (10 Plataformas)
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-brand-yellow" />
            </div>
          ) : items.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-[2rem] text-gray-500 space-y-2">
              <p className="font-bold uppercase tracking-widest text-xs">
                Nenhuma logo cadastrada no banco ainda
              </p>
              <p className="text-xs text-gray-600">
                Adicione uma ao lado ou clique em &ldquo;Carregar Logos Padrão&rdquo;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => {
                const isAvailable = item.status === "AVAILABLE";
                const isHowToInstall = item.status === "HOW_TO_INSTALL";
                return (
                  <div
                    key={item.id}
                    className={`bg-white/5 border rounded-3xl p-5 flex flex-col justify-between gap-4 transition-all ${
                      item.active ? "border-white/10 hover:border-brand-yellow/40" : "border-white/5 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} p-2 flex items-center justify-center flex-shrink-0 border border-white/20`}
                        >
                          <img
                            src={item.logoUrl}
                            alt={item.name}
                            className="max-w-full max-h-full object-contain drop-shadow"
                          />
                        </div>
                        <div>
                          <h4 className="font-black text-white text-base leading-tight">{item.name}</h4>
                          <span
                            className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              isAvailable
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : isHowToInstall
                                ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                                : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {isAvailable ? (
                              <Download className="w-2.5 h-2.5" />
                            ) : isHowToInstall ? (
                              <BookOpen className="w-2.5 h-2.5" />
                            ) : (
                              <Clock className="w-2.5 h-2.5" />
                            )}
                            {isAvailable ? "Baixar" : isHowToInstall ? "Como Instalar" : "Breve"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="p-2 text-gray-400 hover:text-brand-yellow hover:bg-brand-yellow/10 rounded-xl transition-all"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {item.shortCode ? (
                      <div className="bg-black/40 border border-white/10 rounded-2xl p-3 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-brand-yellow">
                          <span className="flex items-center gap-1.5">
                            <Link2 className="w-3.5 h-3.5" />
                            URL Encurtada
                          </span>
                          <a
                            href={`/d/${item.shortCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white flex items-center gap-1"
                          >
                            Testar <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-xs text-gray-200 truncate">
                            {getFullShortUrl(item.shortCode)}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyShortUrl(item.id, item.shortCode!)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase text-white flex-shrink-0"
                          >
                            {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {copiedId === item.id ? "Copiado" : "Copiar"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] text-gray-500 italic px-1">
                        Sem arquivo/URL vinculado ainda.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

