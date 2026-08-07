import React from "react";
import { Activity, Menu, LogIn, Eye, UserCheck, LogOut } from "lucide-react";

export interface HeaderNavProps {
  clinicName: string;
  doctorName: string;
  doctorRole?: string;
  doctorAvatarUrl?: string;
  onOpenMobileMenu?: () => void;
  onViewLogin?: () => void;
  onViewCanvas?: () => void;
  onSignOut?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  clinicName,
  doctorName,
  doctorRole = "admin",
  doctorAvatarUrl,
  onOpenMobileMenu,
  onViewLogin,
  onViewCanvas,
  onSignOut,
}) => {
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-800/80 text-slate-300 hover:text-white cursor-pointer transition-colors border border-slate-700/60"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white leading-tight">CRM Odontológico</h1>
              <p className="text-xs text-slate-400 font-medium truncate max-w-[200px] sm:max-w-xs">
                {clinicName}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onViewLogin && (
            <button
              type="button"
              onClick={onViewLogin}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700/80 flex items-center gap-1.5 cursor-pointer transition-all duration-200"
            >
              <LogIn className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Ver Login UI</span>
            </button>
          )}

          {onViewCanvas && (
            <button
              type="button"
              onClick={onViewCanvas}
              className="min-h-[44px] px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-medium text-amber-300 border border-amber-500/20 flex items-center gap-1.5 cursor-pointer transition-all duration-200"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ver Canvas Cotización</span>
            </button>
          )}

          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            {doctorAvatarUrl ? (
              <img
                src={doctorAvatarUrl}
                alt={doctorName}
                className="w-9 h-9 rounded-full object-cover border border-cyan-500/30"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {getInitials(doctorName)}
              </div>
            )}

            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-200">{doctorName}</p>
              <div className="flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-purple-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  {doctorRole}
                </span>
              </div>
            </div>

            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                title="Cerrar sesión"
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-100 border border-rose-800/40 transition-colors cursor-pointer"
                aria-label="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
