import { describe, test, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme, THEME_OPTIONS } from "./useTheme";

const THEME_STORAGE_KEY = "crm_odontologo_theme";

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  test("THEME_OPTIONS expone los 3 ids gold/emerald/editorial con badgeColor actualizado", () => {
    expect(THEME_OPTIONS).toHaveLength(3);

    const ids = THEME_OPTIONS.map((option) => option.id);
    expect(ids).toEqual(["gold", "emerald", "editorial"]);

    const goldOption = THEME_OPTIONS.find((option) => option.id === "gold");
    const emeraldOption = THEME_OPTIONS.find((option) => option.id === "emerald");
    const editorialOption = THEME_OPTIONS.find((option) => option.id === "editorial");

    expect(goldOption?.badgeColor).toBe("#D8C593");
    expect(emeraldOption?.badgeColor).toBe("#10B981");
    expect(editorialOption?.badgeColor).toBe("#E8A87C");
  });

  test("useTheme persiste y restaura el tema seleccionado desde localStorage", () => {
    const { result, unmount } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme("emerald");
    });

    expect(result.current.theme).toBe("emerald");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("emerald");

    unmount();

    const { result: secondResult } = renderHook(() => useTheme());
    expect(secondResult.current.theme).toBe("emerald");
  });

  test("useTheme aplica data-theme=gold por defecto si no hay valor guardado", () => {
    renderHook(() => useTheme());

    expect(document.documentElement.getAttribute("data-theme")).toBe("gold");
  });
});
