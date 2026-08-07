import React, { useState } from 'react';

export interface ClinicBrandConfig {
  clinicName: string;
  doctorName: string;
  professionalId: string;
  phone: string;
  logoUrl?: string;
}

export interface OnboardingWizardProps {
  onComplete: (config: ClinicBrandConfig) => Promise<void>;
  onSkipDemo?: () => void;
}

const initialConfig: ClinicBrandConfig = {
  clinicName: '',
  doctorName: '',
  professionalId: '',
  phone: '',
  logoUrl: '',
};

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onSkipDemo }) => {
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formData, setFormData] = useState<ClinicBrandConfig>(initialConfig);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetDemo = () => {
    setStep(1);
    setFormData(initialConfig);
    if (onSkipDemo) {
      onSkipDemo();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((prev) => prev + 1);
      return;
    }
    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = formData.clinicName.trim() !== '' && formData.doctorName.trim() !== '';
  const isStep3Valid = formData.professionalId.trim() !== '' && formData.phone.trim() !== '';
  const isNextDisabled = (step === 1 && !isStep1Valid) || (step === 3 && (!isStep3Valid || isSubmitting));

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300/80">Configuración Inicial</span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-50 mt-1">
              {step === 1 ? 'Nombre del Consultorio' : step === 2 ? 'Logo y Perfil de Marca' : 'Cédula y Datos de Contacto'}
            </h1>
          </div>
          <button type="button" onClick={handleResetDemo} className="text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer min-h-[44px]">
            Probar Onboarding Demo
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Paso {step} de 3</span>
            <span>{step === 1 ? '33%' : step === 2 ? '66%' : '100%'}</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="clinicName" className="block text-xs font-medium text-slate-300 mb-1">Nombre del Consultorio / Clínica *</label>
                <input id="clinicName" name="clinicName" type="text" required value={formData.clinicName} onChange={handleChange} placeholder="Ej. Clínica Odontológica Sonrisas" className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 min-h-[44px] focus:border-amber-400 focus:outline-none transition-all" />
              </div>
              <div>
                <label htmlFor="doctorName" className="block text-xs font-medium text-slate-300 mb-1">Nombre del Odontólogo / Titular *</label>
                <input id="doctorName" name="doctorName" type="text" required value={formData.doctorName} onChange={handleChange} placeholder="Ej. Dra. Daniela Rendón" className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 min-h-[44px] focus:border-amber-400 focus:outline-none transition-all" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="logoUrl" className="block text-xs font-medium text-slate-300 mb-1">URL del Logo (Opcional)</label>
                <input id="logoUrl" name="logoUrl" type="url" value={formData.logoUrl || ''} onChange={handleChange} placeholder="https://ejemplo.com/logo.png" className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 min-h-[44px] focus:border-amber-400 focus:outline-none transition-all" />
              </div>
              <div className="flex items-center justify-center p-4 border border-dashed border-slate-800 rounded-xl bg-slate-950/50">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Vista previa logo" className="h-16 object-contain" />
                ) : (
                  <div className="text-center text-slate-400 text-xs py-2">
                    <svg className="w-8 h-8 mx-auto mb-1 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2H6a2 2 0 0-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Sin logo seleccionado (se usará el estilo predeterminado)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="professionalId" className="block text-xs font-medium text-slate-300 mb-1">Cédula Profesional *</label>
                <input id="professionalId" name="professionalId" type="text" required value={formData.professionalId} onChange={handleChange} placeholder="Ej. CED-87654321" className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 min-h-[44px] focus:border-amber-400 focus:outline-none transition-all" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-slate-300 mb-1">Teléfono del Consultorio *</label>
                <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="Ej. 55-1234-5678" className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 min-h-[44px] focus:border-amber-400 focus:outline-none transition-all" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 gap-3">
            {step > 1 ? (
              <button type="button" onClick={() => setStep((prev) => prev - 1)} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg min-h-[44px] font-medium transition-colors cursor-pointer text-sm">
                Atrás
              </button>
            ) : <div />}
            <button type="submit" disabled={isNextDisabled} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg min-h-[44px] font-medium transition-colors cursor-pointer text-sm flex items-center gap-2">
              {isSubmitting ? 'Guardando...' : step === 3 ? 'Finalizar Configuración' : 'Siguiente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
