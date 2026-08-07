import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { ProtectedRoute } from "./ProtectedRoute";
import type { AuthUser } from "../services/authService";

describe("ProtectedRoute", () => {
  const mockVeteranUser: AuthUser = {
    uid: "usr-01",
    email: "dra.daniela@cazaresdental.com",
    displayName: "Dra. Daniela Cázares",
    photoURL: null,
  };

  const mockNewUser: AuthUser = {
    uid: "usr-02",
    email: "nuevo@consultorio.com",
    displayName: "Dr. Nuevo Usuario",
    photoURL: null,
  };

  test("ProtectedRoute debe renderizar spinner de carga mientras verifica sesión", () => {
    render(
      <ProtectedRoute
        user={null}
        isLoading={true}
        hasCompletedOnboarding={false}
        onGoogleSignIn={vi.fn()}
      >
        <div data-testid="dashboard-content">Dashboard Principal</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("auth-loading-spinner")).toBeInTheDocument();
    expect(screen.getByText("Verificando sesión...")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-content")).not.toBeInTheDocument();
  });

  test("ProtectedRoute debe renderizar LoginView cuando no hay usuario autenticado", () => {
    const handleGoogleSignIn = vi.fn();

    render(
      <ProtectedRoute
        user={null}
        isLoading={false}
        hasCompletedOnboarding={false}
        onGoogleSignIn={handleGoogleSignIn}
      >
        <div data-testid="dashboard-content">Dashboard Principal</div>
      </ProtectedRoute>
    );

    expect(screen.getByRole("heading", { name: /CRM Odontológico/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continuar con Google/i })).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-content")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Continuar con Google/i }));
    expect(handleGoogleSignIn).toHaveBeenCalledTimes(1);
  });

  test("ProtectedRoute debe renderizar OnboardingWizard cuando el usuario no ha completado el registro inicial", () => {
    const handleCompleteOnboarding = vi.fn();

    render(
      <ProtectedRoute
        user={mockNewUser}
        isLoading={false}
        hasCompletedOnboarding={false}
        onGoogleSignIn={vi.fn()}
        onCompleteOnboarding={handleCompleteOnboarding}
      >
        <div data-testid="dashboard-content">Dashboard Principal</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Configuración Inicial")).toBeInTheDocument();
    expect(screen.getByText("Nombre del Consultorio")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-content")).not.toBeInTheDocument();
  });

  test("ProtectedRoute debe renderizar el Dashboard (children) cuando el usuario está autenticado y ha completado onboarding", () => {
    render(
      <ProtectedRoute
        user={mockVeteranUser}
        isLoading={false}
        hasCompletedOnboarding={true}
        onGoogleSignIn={vi.fn()}
      >
        <div data-testid="dashboard-content">Dashboard Principal</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId("dashboard-content")).toBeInTheDocument();
    expect(screen.getByText("Dashboard Principal")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /CRM Odontológico/i })).not.toBeInTheDocument();
  });
});
