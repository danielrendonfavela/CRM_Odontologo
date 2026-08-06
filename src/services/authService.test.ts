import { describe, test, expect, vi, beforeEach } from "vitest";
import { authService } from "./authService";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from "firebase/auth";

vi.mock("firebase/auth", () => ({
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock("../config/firebase", () => ({
  auth: {
    currentUser: null,
  },
}));

describe("authService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("signInWithGoogle debe mapear correctamente los campos del usuario retornado por Firebase", async () => {
    const mockFirebaseUser = {
      uid: "user-123",
      email: "doctor@ejemplo.com",
      displayName: "Dr. Roberto Gómez",
      photoURL: "https://ejemplo.com/foto.jpg",
    };

    vi.mocked(signInWithPopup).mockResolvedValueOnce({
      user: mockFirebaseUser,
    } as never);

    const result = await authService.signInWithGoogle();

    expect(signInWithPopup).toHaveBeenCalled();
    expect(result).toEqual({
      uid: "user-123",
      email: "doctor@ejemplo.com",
      displayName: "Dr. Roberto Gómez",
      photoURL: "https://ejemplo.com/foto.jpg",
    });
  });

  test("signOut debe invocar la función firebaseSignOut del SDK", async () => {
    vi.mocked(firebaseSignOut).mockResolvedValueOnce();

    await authService.signOut();

    expect(firebaseSignOut).toHaveBeenCalled();
  });

  test("onAuthStateChanged debe llamar al callback cuando cambia el estado de autenticación", () => {
    const mockFirebaseUser = {
      uid: "user-456",
      email: "paciente@ejemplo.com",
      displayName: "Ana López",
      photoURL: null,
    };

    vi.mocked(firebaseOnAuthStateChanged).mockImplementationOnce((_auth, callback) => {
      (callback as (user: typeof mockFirebaseUser | null) => void)(mockFirebaseUser);
      return () => {};
    });

    const callback = vi.fn();
    authService.onAuthStateChanged(callback);

    expect(firebaseOnAuthStateChanged).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith({
      uid: "user-456",
      email: "paciente@ejemplo.com",
      displayName: "Ana López",
      photoURL: null,
    });
  });

  test("debe retornar mensaje de error amigable cuando el popup es cerrado", async () => {
    const popupClosedError = {
      code: "auth/popup-closed-by-user",
      message: "The popup has been closed by the user.",
    };

    vi.mocked(signInWithPopup).mockRejectedValueOnce(popupClosedError);

    await expect(authService.signInWithGoogle()).rejects.toThrow(
      "Autenticación cancelada por el usuario"
    );
  });
});
