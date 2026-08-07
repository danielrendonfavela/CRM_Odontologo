import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SidebarNav } from "./SidebarNav";

describe("SidebarNav", () => {
  test("SidebarNav debe emitir onTabChange al hacer clic en una opción de navegación", () => {
    const handleTabChange = vi.fn();
    render(<SidebarNav activeTab="dashboard" onTabChange={handleTabChange} />);

    const patientsButton = screen.getByRole("button", { name: /pacientes/i });
    fireEvent.click(patientsButton);

    expect(handleTabChange).toHaveBeenCalledWith("patients");
  });

  test("SidebarNav debe alternar colapso en pantallas móviles", () => {
    const handleCloseMobile = vi.fn();
    render(
      <SidebarNav
        activeTab="dashboard"
        onTabChange={vi.fn()}
        isOpenMobile={true}
        onCloseMobile={handleCloseMobile}
      />
    );

    const closeButton = screen.getByRole("button", { name: /cerrar menú/i });
    fireEvent.click(closeButton);

    expect(handleCloseMobile).toHaveBeenCalledTimes(1);
  });

  test("debe alternar colapso en escritorio si se provee onToggleCollapse", () => {
    const handleToggle = vi.fn();
    render(
      <SidebarNav
        activeTab="dashboard"
        onTabChange={vi.fn()}
        isCollapsed={false}
        onToggleCollapse={handleToggle}
      />
    );

    const toggleButton = screen.getByRole("button", { name: /colapsar sidebar/i });
    fireEvent.click(toggleButton);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});
