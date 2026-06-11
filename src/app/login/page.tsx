"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, User as UserIcon, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login Result Error:", result.error);
        setError("Usuário/E-mail ou senha incorretos.");
        setIsLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      console.error("Login Exception:", err);
      setError("Erro ao tentar logar. Verifique sua conexão ou variáveis de ambiente.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4 md:p-6 selection:bg-brand-green selection:text-black">
      <div className="max-w-md w-full glass-panel p-6 sm:p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] border-white/5 relative overflow-hidden">
        
        {/* Logo Section */}
        <div className="text-center mb-8 md:mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 md:mb-6">
            <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">SFL <span className="text-brand-yellow">STREAM</span></span>
          </Link>
          <h2 className="text-lg md:text-xl font-bold text-gray-300">Acesse sua conta</h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Usuário ou E-mail</label>
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500 group-focus-within:text-brand-blue transition-colors" />
              <input 
                type="text" 
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Nome de usuário ou e-mail"
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-10 md:px-12 py-3 md:py-4 focus:outline-none focus:border-brand-blue transition-all placeholder:text-gray-700 text-sm md:text-base text-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between ml-1">
              <label className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest">Senha</label>
              <Link href="/esqueci-senha" className="text-[10px] md:text-xs font-bold text-brand-green hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-500 group-focus-within:text-brand-green transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-10 md:px-12 py-3 md:py-4 focus:outline-none focus:border-brand-green transition-all placeholder:text-gray-700 text-sm md:text-base text-white"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-green hover:bg-brand-yellow text-black font-black py-4 md:py-5 rounded-xl md:rounded-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-brand-green/10 text-sm md:text-base mt-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "ENTRAR AGORA"
            )}
          </button>
        </form>

        <div className="mt-6 md:mt-8 text-center space-y-3 md:space-y-4">
          <p className="text-[10px] md:text-xs text-gray-500">
            Não tem uma conta? <Link href="/#pricing" className="text-brand-green font-bold hover:underline">Assinar Plano</Link>
          </p>
          <Link href="/" className="block text-[9px] md:text-[10px] text-gray-700 uppercase tracking-[0.3em] hover:text-white transition-colors">
            Voltar para a página inicial
          </Link>
        </div>

        {/* Decorative elements */}
        <div className="absolute -z-10 top-0 left-0 w-full h-full bg-brand-green/5 blur-[80px] rounded-full opacity-50" />
      </div>
    </div>
  );
}
