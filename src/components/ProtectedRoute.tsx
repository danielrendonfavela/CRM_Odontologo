import React from "react";
import { Loader2 } from "lucide-react";
import { AuthUser } from "../services/authService";
import { LoginView } from "../features/auth/components/LoginView";
import { OnboardingWizard } from "./OnboardingWizard";

export interface ProtectedRouteProps {
  user: AuthUser | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  onGoogleSignIn: () => void;
  onCompleteOnboarding?: () => void;
  authError?: string | null;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  user,
  isLoading,
  hasCompletedOnboarding,
  onGoogleSignIn,
  onCompleteOnboarding = () => {},
  authError = null,
  children,
}) => {
  if (isLoading) {
    return (
      <div
        data-testid="auth-loading-spinner"
        className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400"
      >
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-xs font-medium tracking-wide">Verificando sesión...</span>
      </div>
    );
  }

  if (!user) {
    return <LoginView onGoogleSignIn={onGoogleSignIn} isLoading={isLoading} error={authError} />;
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingWizard onComplete={onCompleteOnboarding} userEmail={user.email} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
