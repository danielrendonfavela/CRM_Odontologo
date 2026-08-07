import React, { useState } from "react";
import { Stethoscope, Menu, Eye, UserCheck, LogOut, Palette, Check, Search, Plus, Command } from "lucide-react";
import { ThemeType, THEME_OPTIONS } from "../hooks/useTheme";

export interface HeaderNavProps {
  clinicName: string;
  doctorName: string;
  doctorRole?: string;
  doctorAvatarUrl?: string;
  currentTheme?: ThemeType;
  onThemeChange?: (theme: ThemeType) => void;
  onOpenMobileMenu?: () => void;
  onViewCanvas?: () => void;
  onSignOut?: () => void;
  onNewRegister?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  clinicName,
  doctorName,
  doctorRole = "admin",
  doctorAvatarUrl,
  currentTheme = "gold",
  onThemeChange,
  onOpenMobileMenu,
  onViewCanvas,
  onSignOut,
  onNewRegister,
}) => {
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="border-b border-white/[0.08] bg-[#080C0E]/90 backdrop-blur-xl sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Branding & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {onOpenMobileMenu && (
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-white/[0.05] text-slate-300 hover:text-white cursor-pointer transition-colors border border-white/10"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0E1418] border border-[#D8C593]/30 flex items-center justify-center shadow-lg shadow-black/40 shrink-0">
              <Stethoscope className="w-5 h-5 text-[#D8C593]" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-slate-100 tracking-tight leading-tight">
                CRM Odontológico
              </h1>
              <p className="text-xs text-slate-400 font-medium truncate max-w-[160px] sm:max-w-xs">
                {clinicName}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Command Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md items-center relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar pacientes, expediente, cotización..."
            className="w-full h-10 pl-9 pr-12 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#D8C593]/50 focus:ring-1 focus:ring-[#D8C593]/30 transition-all"
          />
          <div className="absolute right-2.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.08] text-[10px] text-slate-400 border border-white/10 font-mono pointer-events-none">
            <Command className="w-2.5 h-2.5" /> K
          </div>
        </div>

        {/* Right: Actions, Theme Switcher & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* New Register Button */}
          {onNewRegister && (
            <button
              type="button"
              onClick={onNewRegister}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#D8C593] hover:bg-[#E8D8A7] active:scale-[0.98] text-slate-950 text-xs font-semibold flex items-center gap-2 shadow-md shadow-[#D8C593]/15 cursor-pointer transition-all duration-150"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nueva Cotización</span>
            </button>
          )}

          {/* Canvas View */}
          {onViewCanvas && (
            <button
              type="button"
              onClick={onViewCanvas}
              title="Previsualizar PDF Canva"
              className="min-h-[44px] px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 border border-white/10 flex items-center gap-1.5 cursor-pointer transition-all duration-150"
            >
              <Eye className="w-4 h-4 text-[#D8C593]" />
              <span className="hidden md:inline">Ver Canvas</span>
            </button>
          )}

          {/* Theme Selector Dropdown */}
          {onThemeChange && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                aria-label="Cambiar tema visual"
                title="Personalidad de Marca"
                className="min-h-[44px] px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 border border-white/10 flex items-center gap-2 cursor-pointer transition-all duration-150"
              >
                <Palette className="w-4 h-4 text-[#D8C593]" />
                <span className="hidden md:inline">Tema</span>
              </button>

              {isThemeOpen && (
                <div className="absolute right-0 mt-2 w-60 rounded-2xl p-2 shadow-2xl z-50 border border-white/15 bg-[#0E1418] backdrop-blur-2xl">
                  <p className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10 mb-1">
                    Personalidad de Marca
                  </p>
                  {THEME_OPTIONS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onThemeChange(t.id);
                        setIsThemeOpen(false);
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                        currentTheme === t.id
                          ? "bg-white/[0.10] text-white border border-white/10"
                          : "text-slate-300 hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm border border-white/20"
                          style={{ backgroundColor: t.badgeColor }}
                        />
                        <div>
                          <p className="font-semibold">{t.name}</p>
                          <p className="text-[10px] text-slate-400">{t.subtitle}</p>
                        </div>
                      </div>
                      {currentTheme === t.id && <Check className="w-4 h-4 text-[#D8C593]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Doctor Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            {doctorAvatarUrl ? (
              <img
                src={doctorAvatarUrl}
                alt={doctorName}
                className="w-9 h-9 rounded-xl object-cover border border-[#D8C593]/40 shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#172026] border border-[#D8C593]/40 flex items-center justify-center text-[#D8C593] font-bold text-xs shadow-sm">
                {getInitials(doctorName)}
              </div>
            )}

            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">{doctorName}</p>
              <div className="flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-[#D8C593]" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8C593]">
                  {doctorRole}
                </span>
              </div>
            </div>

            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                title="Cerrar sesión"
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors cursor-pointer"
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
