"use client";
import { useEffect } from 'react';

export const SecurityGuard = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // 1. Bloquear Clique Direito
    const handleContextMenu = (e: MouseEvent) => {
      // Permitir em inputs se necessário, mas para streaming geralmente bloqueamos tudo
      e.preventDefault();
    };
    
    // 2. Bloquear Atalhos de Teclado (F12, Ctrl+Shift+I, Ctrl+U, Ctrl+C, Ctrl+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85) || // Ctrl+U (View Source)
        (e.ctrlKey && e.keyCode === 83) || // Ctrl+S (Save Page)
        (e.ctrlKey && e.keyCode === 67)    // Ctrl+C (Copy)
      ) {
        e.preventDefault();
        return false;
      }
    };

    // 3. Anti-Debugger (Loop Infinito se abrir o console)
    const antiDebugger = () => {
      if (process.env.NODE_ENV === 'development') return;

      setInterval(() => {
        (function() {
          const startTime = performance.now();
          // eslint-disable-next-line no-debugger
          debugger;
          const endTime = performance.now();
          if (endTime - startTime > 100) {
            window.location.href = "about:blank"; // Redireciona se detectar debug
          }
        })();
      }, 1000);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    antiDebugger();

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="select-none no-print">
      <style jsx global>{`
        /* Impede seleção de texto */
        * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
        }
        /* Proteção contra Print (esconde conteúdo ao imprimir) */
        @media print {
          body { display: none !important; }
        }
      `}</style>
      {children}
    </div>
  );
};
