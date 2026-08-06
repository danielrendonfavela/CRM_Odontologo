import React, { useState } from "react";
import { Stethoscope, AlertCircle, X, Loader2 } from "lucide-react";

export interface LoginViewProps {
  onGoogleSignIn: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onGoogleSignIn,
  isLoading = false,
  error: externalError = null,
}) => {
  const [dismissedError, setDismissedError] = useState<string | null>(null);

  const visibleError =
    externalError && externalError !== dismissedError ? externalError : null;

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Ambient background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Error Alert */}
      {visibleError && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-rose-950/85 border border-rose-700/50 text-rose-200 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span className="text-sm font-medium">{visibleError}</span>
            </div>
            <button
              onClick={() => setDismissedError(visibleError)}
              aria-label="Cerrar alerta de error"
              className="p-1 rounded-lg hover:bg-rose-900/50 text-rose-400 hover:text-rose-200 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Glassmorphic Login Card */}
      <main className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 flex flex-col items-center text-center border border-white/10 backdrop-blur-xl bg-slate-900/60">
        {/* Monogram / Logo Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20 mb-6 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
            <Stethoscope className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        {/* Title & Branding */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent mb-2">
          CRM Odontológico
        </h1>
        <p className="text-sm text-slate-400 mb-8 max-w-xs">
          Gestión inteligente de pacientes, cotizaciones y agenda clínica.
        </p>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={onGoogleSignIn}
          disabled={isLoading}
          aria-label="Continuar con Google"
          aria-busy={isLoading}
          className="w-full min-h-[44px] h-12 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-3 bg-slate-800/90 hover:bg-slate-700/90 active:scale-[0.99] border border-slate-700/60 text-white shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" aria-hidden="true" />
              <span>Iniciando sesión...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.04.01 12s.45 3.8 1.26 5.42l4.01-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continuar con Google</span>
            </>
          )}
        </button>

        {/* Footer / Sub-info */}
        <div className="mt-8 text-xs text-slate-500 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sistema Seguro Multi-tenant</span>
        </div>
      </main>
    </div>
  );
};
