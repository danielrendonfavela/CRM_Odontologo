import React, { useState } from "react";
import { Sparkles, Building2, Award, ArrowRight, CheckCircle2 } from "lucide-react";

export interface OnboardingWizardProps {
  onComplete: () => void;
  userEmail?: string | null;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  userEmail,
}) => {
  const [step, setStep] = useState<number>(1);
  const [clinicName, setClinicName] = useState<string>("");
  const [professionalId, setProfessionalId] = useState<string>("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <main className="w-full max-w-lg glass-card rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 border border-white/10 backdrop-blur-xl bg-slate-900/70">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Configuración Inicial</span>
          </div>
          <span className="text-xs font-mono text-slate-400">Paso {step} de 3</span>
        </div>

        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mb-8">
          <div
            className="bg-gradient-to-r from-cyan-500 to-amber-400 h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-6">
            <div className="text-left space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Nombre del Consultorio</h2>
              <p className="text-xs text-slate-400">
                Bienvenido {userEmail ? `(${userEmail})` : ""}. Ingrese el nombre de su clínica u odontología.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Nombre Comercial</label>
              <input
                type="text"
                required
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="Ej. Clínica DentalCare Pro"
                className="w-full min-h-[44px] px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] h-12 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleNext} className="space-y-6">
            <div className="text-left space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Cédula Profesional</h2>
              <p className="text-xs text-slate-400">
                Esta cédula se imprimirá en sus expedientes y cotizaciones digitales.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Número de Cédula</label>
              <input
                type="text"
                required
                value={professionalId}
                onChange={(e) => setProfessionalId(e.target.value)}
                placeholder="Ej. Céd. Prof. 129084"
                className="w-full min-h-[44px] px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] h-12 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">¡Todo Listo!</h2>
              <p className="text-xs text-slate-400 mt-2">
                Su consultorio <strong className="text-slate-200">{clinicName || "Odontológico"}</strong> ha sido configurado exitosamente.
              </p>
            </div>

            <button
              type="button"
              onClick={onComplete}
              className="w-full min-h-[44px] h-12 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <span>Ingresar al Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default OnboardingWizard;
