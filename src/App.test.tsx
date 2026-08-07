import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import App from "./App";

vi.mock("./hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      uid: "usr-01",
      email: "dra.daniela@cazaresdental.com",
      displayName: "Dra. Daniela Cázares",
      photoURL: null,
    },
    isLoading: false,
    hasCompletedOnboarding: true,
    isFirstLogin: false,
    signInWithGoogle: vi.fn(),
    signOut: vi.fn(),
    completeOnboarding: vi.fn(),
    setDemoUser: vi.fn(),
    error: null,
  }),
}));

vi.mock("./hooks/useTheme", () => ({
  useTheme: () => ({
    theme: "gold",
    setTheme: vi.fn(),
    themeOptions: [],
  }),
}));

describe("App - Dashboard", () => {
  test("el dashboard no renderiza el badge Consultorio Activo", () => {
    render(<App />);

    expect(screen.queryByText(/Consultorio Activo/i)).not.toBeInTheDocument();
  });

  test("la tarjeta de pacientes no muestra un indicador de tendencia fijo", () => {
    render(<App />);

    expect(screen.queryByText(/\+12% este mes/i)).not.toBeInTheDocument();
  });

  test("el subtítulo de cotizaciones refleja el conteo real por estado desde sampleQuotes", () => {
    render(<App />);

    expect(screen.getByText("1 Aprobada · 0 Enviadas")).toBeInTheDocument();
  });
});
