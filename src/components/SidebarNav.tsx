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
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: string;
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
  { id: "dashboard", label: "Inicio", icon: "LayoutDashboard" },
  { id: "patients", label: "Pacientes", icon: "Users" },
  { id: "quotes", label: "Cotizaciones", icon: "FileText" },
  { id: "schedule", label: "Agenda", icon: "Calendar" },
  { id: "accounting", label: "Contabilidad", icon: "DollarSign" },
  { id: "settings", label: "Ajustes", icon: "Settings" },
];

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  DollarSign,
  Settings,
};

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  onTabChange,
  isCollapsed = false,
  onToggleCollapse,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const renderNavList = (isMobileView = false) => (
    <ul className="space-y-1.5 px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
        const isActive = activeTab === item.id;
        const showLabel = isMobileView || !isCollapsed;

        const btnClass =
          "w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-3 " +
          (isActive
            ? "bg-slate-800 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10 font-semibold"
            : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50");

        const iconClass = "w-5 h-5 shrink-0 " + (isActive ? "text-cyan-400" : "text-slate-400");

        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => {
                onTabChange(item.id);
                if (isMobileView && onCloseMobile) onCloseMobile();
              }}
              className={btnClass}
              title={isCollapsed && !isMobileView ? item.label : undefined}
            >
              <IconComponent className={iconClass} />
              {showLabel && <span className="truncate">{item.label}</span>}
              {item.badgeCount !== undefined && showLabel && (
                <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {item.badgeCount}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const asideClass =
    "hidden lg:flex flex-col bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 transition-all duration-200 " +
    (isCollapsed ? "w-20" : "w-64");

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            data-testid="mobile-backdrop"
          />
          <div className="relative w-72 max-w-[80vw] bg-slate-900/95 backdrop-blur-xl border-r border-white/10 h-full flex flex-col z-10 shadow-2xl">
            <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
              <span className="font-bold text-sm text-white">Navegación</span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto">{renderNavList(true)}</nav>
          </div>
        </div>
      )}

      {/* Desktop / Tablet Sidebar */}
      <aside className={asideClass}>
        <nav className="flex-1 overflow-y-auto">{renderNavList(false)}</nav>

        {onToggleCollapse && (
          <div className="p-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/60 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              {!isCollapsed && <span>Colapsar menú</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export const SidebarNavResponsive = SidebarNav;
