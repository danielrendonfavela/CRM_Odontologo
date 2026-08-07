import React from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

export interface SidebarNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Inicio", icon: LayoutDashboard },
  { id: "patients", label: "Pacientes", icon: Users, badgeCount: 24 },
  { id: "quotes", label: "Cotizaciones", icon: FileText },
  { id: "schedule", label: "Agenda", icon: Calendar, badgeCount: 4 },
  { id: "accounting", label: "Contabilidad", icon: DollarSign },
  { id: "settings", label: "Ajustes", icon: Settings },
];

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onTabChange,
  isCollapsed = false,
  onToggleCollapse,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const content = (
    <div className="flex flex-col h-full bg-[#080C0E] text-slate-200 border-r border-white/[0.08] select-none">
      {/* Navigation List */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onTabChange(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              title={item.label}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3.5 text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-[#D8C593]/10 text-[#D8C593] font-semibold border-l-2 border-[#D8C593] shadow-sm shadow-black/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? "text-[#D8C593]" : "text-slate-400 group-hover:text-slate-200"
                }`}
              />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badgeCount !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? "bg-[#D8C593]/20 text-[#D8C593]"
                          : "bg-white/[0.06] text-slate-400"
                      }`}
                    >
                      {item.badgeCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle Footer Button */}
      {onToggleCollapse && (
        <div className="p-3 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="w-full min-h-[44px] px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] text-xs font-medium flex items-center gap-3 transition-colors cursor-pointer"
            aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 shrink-0 mx-auto" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 shrink-0" />
                <span>Colapsar menú</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block h-[calc(100vh-4rem)] sticky top-16 transition-all duration-200 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 max-w-xs w-full bg-[#080C0E] shadow-2xl z-10 flex flex-col">
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
              <span className="font-bold text-sm text-slate-100">Navegación</span>
              <button
                type="button"
                onClick={onCloseMobile}
                aria-label="Cerrar menú"
                className="p-2 min-h-[44px] text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{content}</div>
          </div>
        </div>
      )}
    </>
  );
};
