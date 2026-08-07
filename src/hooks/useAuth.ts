import { useState, useEffect, useCallback } from "react";
import { authService, AuthUser } from "../services/authService";

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  isFirstLogin: boolean;
}

export interface UseAuthReturn extends AuthState {
  error: string | null;
  signInWithGoogle: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
  completeOnboarding: () => void;
  setDemoUser: (email: string | null) => void;
}

const TEST_ACCOUNTS = {
  NUEVO: "nuevo@consultorio.com",
  VETERAN: "dra.daniela@cazaresdental.com",
} as const;

export function useAuth(): UseAuthReturn {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    hasCompletedOnboarding: false,
    isFirstLogin: false,
  });
  const [error, setError] = useState<string | null>(null);

  const calculateOnboardingState = (user: AuthUser | null, manualCompleted?: boolean) => {
    if (!user) {
      return { hasCompletedOnboarding: false, isFirstLogin: false };
    }

    if (user.email === TEST_ACCOUNTS.NUEVO) {
      return {
        hasCompletedOnboarding: manualCompleted ?? false,
        isFirstLogin: !(manualCompleted ?? false),
      };
    }

    if (user.email === TEST_ACCOUNTS.VETERAN) {
      return { hasCompletedOnboarding: true, isFirstLogin: false };
    }

    return {
      hasCompletedOnboarding: manualCompleted ?? true,
      isFirstLogin: false,
    };
  };

  useEffect(() => {
    let isSubscribed = true;

    // Safety fallback timeout: Ensure isLoading is resolved within 1.5s max
    const timer = setTimeout(() => {
      if (isSubscribed) {
        setAuthState((prev) => (prev.isLoading ? { ...prev, isLoading: false } : prev));
      }
    }, 1500);

    const unsubscribe = authService.onAuthStateChanged((user) => {
      clearTimeout(timer);
      if (!isSubscribed) return;

      if (!user) {
        setAuthState({
          user: null,
          isLoading: false,
          hasCompletedOnboarding: false,
          isFirstLogin: false,
        });
      } else {
        const { hasCompletedOnboarding, isFirstLogin } = calculateOnboardingState(user);
        setAuthState({
          user,
          isLoading: false,
          hasCompletedOnboarding,
          isFirstLogin,
        });
      }
    });

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(async (): Promise<AuthUser | null> => {
    try {
      setError(null);
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      const user = await authService.signInWithGoogle();
      const { hasCompletedOnboarding, isFirstLogin } = calculateOnboardingState(user);
      setAuthState({
        user,
        isLoading: false,
        hasCompletedOnboarding,
        isFirstLogin,
      });
      return user;
    } catch (err: unknown) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      const message = err instanceof Error ? err.message : "Error de autenticación";
      setError(message);
      return null;
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await authService.signOut();
      setAuthState({
        user: null,
        isLoading: false,
        hasCompletedOnboarding: false,
        isFirstLogin: false,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al cerrar sesión";
      setError(message);
    }
  }, []);

  const completeOnboarding = useCallback(() => {
    setAuthState((prev) => {
      if (!prev.user) return prev;
      return {
        ...prev,
        hasCompletedOnboarding: true,
        isFirstLogin: false,
      };
    });
  }, []);

  const setDemoUser = useCallback((email: string | null) => {
    if (!email) {
      setAuthState({
        user: null,
        isLoading: false,
        hasCompletedOnboarding: false,
        isFirstLogin: false,
      });
      return;
    }

    const mockUser: AuthUser = {
      uid: `usr-${email.split("@")[0]}`,
      email,
      displayName: email === TEST_ACCOUNTS.NUEVO ? "Dr. Nuevo Usuario" : "Dra. Daniela Cázares",
      photoURL: null,
    };

    const { hasCompletedOnboarding, isFirstLogin } = calculateOnboardingState(mockUser);
    setAuthState({
      user: mockUser,
      isLoading: false,
      hasCompletedOnboarding,
      isFirstLogin,
    });
  }, []);

  return {
    ...authState,
    error,
    signInWithGoogle,
    signOut,
    completeOnboarding,
    setDemoUser,
  };
}

export default useAuth;
