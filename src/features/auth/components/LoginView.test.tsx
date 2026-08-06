import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import { LoginView } from './LoginView';

describe("LoginView", () => {
  test("debe renderizar el título y botón de Google correctamente", () => {
    const handleGoogleSignIn = vi.fn();
    render(<LoginView onGoogleSignIn={handleGoogleSignIn} />);

    expect(screen.getByText("CRM Odontológico")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continuar con google/i })
    ).toBeInTheDocument();
  });

  test("debe llamar a la función onGoogleSignIn al dar clic en el botón", () => {
    const handleGoogleSignIn = vi.fn();
    render(<LoginView onGoogleSignIn={handleGoogleSignIn} />);

    const button = screen.getByRole("button", { name: /continuar con google/i });
    fireEvent.click(button);

    expect(handleGoogleSignIn).toHaveBeenCalledTimes(1);
  });

  test("debe deshabilitar el botón y mostrar el spinner cuando isLoading es true", () => {
    const handleGoogleSignIn = vi.fn();
    render(<LoginView onGoogleSignIn={handleGoogleSignIn} isLoading={true} />);

    const button = screen.getByRole("button", { name: /continuar con google/i });
    expect(button).toBeDisabled();
    expect(screen.getByText(/iniciando sesión/i)).toBeInTheDocument();
  });

  test("debe mostrar el mensaje de error cuando la prop error está presente", () => {
    const handleGoogleSignIn = vi.fn();
    const errorMessage = "Error al conectar con Google";
    render(
      <LoginView onGoogleSignIn={handleGoogleSignIn} error={errorMessage} />
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
