"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Clock, X, ExternalLink, Copy, Check, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import type { HomePlatformItem } from "@/app/actions/platforms";

interface HomePlatformCarouselProps {
  platforms: HomePlatformItem[];
}

export default function HomePlatformCarousel({ platforms }: HomePlatformCarouselProps) {
  const [selected, setSelected] = useState<HomePlatformItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const manualTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Duplicate items 3x for seamless infinite scrolling in both directions
  const trackItems = platforms && platforms.length > 0 ? [...platforms, ...platforms, ...platforms] : [];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || platforms.length === 0) return;

    // Start at the middle set so user can immediately scroll left or right
    const initTimer = setTimeout(() => {
      if (el.scrollWidth > 0) {
        el.scrollLeft = el.scrollWidth / 3;
      }
    }, 50);

    return () => clearTimeout(initTimer);
  }, [platforms.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || platforms.length === 0) return;

    let animId: number;
    let carry = 0;

    const step = () => {
      if (!isPaused && el) {
        const oneSet = el.scrollWidth / 3;
        if (oneSet > 0) {
          carry += 0.45; // Slow, smooth auto-scroll
          if (carry >= 1) {
            const px = Math.floor(carry);
            el.scrollLeft += px;
            carry -= px;
          }

          if (el.scrollLeft >= oneSet * 2) {
            el.scrollLeft -= oneSet;
          } else if (el.scrollLeft <= 2) {
            el.scrollLeft += oneSet;
          }
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, platforms.length]);

  if (!platforms || platforms.length === 0) return null;

  const handleManualScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    setIsPaused(true);
    if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);

    const oneSet = el.scrollWidth / 3;
    if (oneSet > 0) {
      if (direction === "left" && el.scrollLeft < 150) {
        el.scrollLeft += oneSet;
      } else if (direction === "right" && el.scrollLeft > oneSet * 2 - 150) {
        el.scrollLeft -= oneSet;
      }
    }

    el.scrollBy({
      left: direction === "left" ? -140 : 140,
      behavior: "smooth",
    });

    manualTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 1800);
  };

  const getDownloadHref = (item: HomePlatformItem) => {
    if (item.shortCode) return `/d/${item.shortCode}`;
    return item.fileUrl || "#";
  };

  const getFullShortUrl = (shortCode: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/d/${shortCode}`;
    }
    return `/d/${shortCode}`;
  };

  const handleCopyShortUrl = (shortCode: string) => {
    const url = getFullShortUrl(shortCode);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div
        className="relative w-full py-3 select-none group/carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => handleManualScroll("left")}
          aria-label="Anterior"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-brand-yellow text-white hover:text-black border border-white/15 backdrop-blur-md flex items-center justify-center shadow-lg transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Track with Transparency Fade */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto no-scrollbar px-2"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="flex gap-3 sm:gap-4 w-max py-1">
            {trackItems.map((item, idx) => {
              const isAvailable = item.status === "AVAILABLE";
              const isHowToInstall = item.status === "HOW_TO_INSTALL";
              const statusLabel = isAvailable
                ? "Baixar"
                : isHowToInstall
                ? "Como Instalar"
                : "Breve";

              return (
                <button
                  key={`${item.id}-${idx}`}
                  type="button"
                  onClick={() => setSelected(item)}
                  title={`${item.name} — ${statusLabel}`}
                  className={`group relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 xl:w-[118px] xl:h-[118px] rounded-2xl bg-gradient-to-br ${item.gradient} p-3 flex flex-col items-center justify-between shadow-lg hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer border border-white/20`}
                >
                  <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      className="max-w-[78%] max-h-[54px] object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider backdrop-blur-md whitespace-nowrap ${
                      isAvailable
                        ? "bg-black/45 text-emerald-300 border border-emerald-300/30"
                        : isHowToInstall
                        ? "bg-black/45 text-sky-300 border border-sky-300/30"
                        : "bg-black/35 text-white/85 border border-white/20"
                    }`}
                  >
                    {isAvailable ? (
                      <>
                        <Download className="w-2.5 h-2.5" />
                        Baixar
                      </>
                    ) : isHowToInstall ? (
                      <>
                        <BookOpen className="w-2.5 h-2.5" />
                        Como Instalar
                      </>
                    ) : (
                      <>
                        <Clock className="w-2.5 h-2.5" />
                        Breve
                      </>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() => handleManualScroll("right")}
          aria-label="Próximo"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-brand-yellow text-white hover:text-black border border-white/15 backdrop-blur-md flex items-center justify-center shadow-lg transition-all cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      {/* Modal de Detalhes / Download */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-md bg-[#111420] border border-white/10 rounded-[2rem] p-7 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selected.gradient} p-2.5 flex items-center justify-center flex-shrink-0 shadow-lg border border-white/20`}
              >
                <img
                  src={selected.logoUrl}
                  alt={selected.name}
                  className="max-w-full max-h-full object-contain drop-shadow"
                />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">{selected.name}</h3>
                <span
                  className={`inline-flex items-center gap-1.5 mt-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    selected.status === "AVAILABLE"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : selected.status === "HOW_TO_INSTALL"
                      ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {selected.status === "AVAILABLE" ? (
                    <>
                      <Download className="w-3 h-3" />
                      Disponível para Baixar
                    </>
                  ) : selected.status === "HOW_TO_INSTALL" ? (
                    <>
                      <BookOpen className="w-3 h-3" />
                      Como Instalar
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3" />
                      Em Desenvolvimento (Breve)
                    </>
                  )}
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-6 bg-white/5 border border-white/5 rounded-2xl p-4 whitespace-pre-line">
              {selected.description || "Sem descrição disponível."}
            </p>

            {(selected.status === "AVAILABLE" || selected.status === "HOW_TO_INSTALL") &&
            (selected.shortCode || selected.fileUrl) ? (
              <div className="space-y-3">
                <a
                  href={getDownloadHref(selected)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-brand-yellow hover:bg-brand-yellow/90 text-black font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg shadow-brand-yellow/20"
                >
                  {selected.status === "HOW_TO_INSTALL" ? (
                    <>
                      <BookOpen className="w-5 h-5" />
                      Abrir Link / Guia
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Baixar Agora
                    </>
                  )}
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </a>

                {selected.shortCode && (
                  <div className="flex items-center justify-between gap-2 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5">
                    <span className="text-xs text-gray-400 truncate font-mono">
                      {getFullShortUrl(selected.shortCode)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyShortUrl(selected.shortCode!)}
                      className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-brand-yellow hover:text-white transition-colors flex-shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copiado" : "Copiar"}
                    </button>
                  </div>
                )}
              </div>
            ) : selected.status === "HOW_TO_INSTALL" ? (
              <div className="text-center py-3 px-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-200 text-xs font-bold">
                Siga as instruções acima para instalar o aplicativo no seu dispositivo.
              </div>
            ) : (
              <div className="text-center py-3 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-bold">
                {selected.status === "AVAILABLE"
                  ? "Link de download ainda não configurado no painel."
                  : "Este aplicativo está em desenvolvimento e será liberado em breve."}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
