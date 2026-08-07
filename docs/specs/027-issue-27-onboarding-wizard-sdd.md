# Software Design Document (SDD) - Issue #27: Wizard de Onboarding Inicial para Dueño del Consultorio

## 1. Resumen Ejecutivo
Se implementó el flujo interactivo de bienvenida en 3 pasos (OnboardingWizard.tsx) para el onboarding de nuevos usuarios/dueños de consultorio en la plataforma SaaS CRM Odontológico. La interfaz permite la personalización progresiva de la marca de la clínica, el logo y la cédula profesional del odontólogo. Cuenta con diseño en modo oscuro UI/UX Pro Max con acento dorado champagne (#D8C593), barra de progreso animada por paso, botón de reseteo demo ('Probar Onboarding Demo') para pruebas iterativas, targets táctiles PWA (min-h-[44px]) y desacoplamiento limpio según la Clean UI Architecture del proyecto.

## 2. Archivos Creados & Modificados
- src/features/onboarding/components/OnboardingWizard.tsx - Componente React interactivo del Wizard de Onboarding en 3 pasos (<180 líneas).
- src/features/onboarding/components/OnboardingWizard.test.tsx - Pruebas unitarias con Vitest y React Testing Library para validación de flujo y emisión de eventos.
- docs/specs/027-issue-27-onboarding-wizard-sdd.md - Especificación de diseño y arquitectura.

## 3. Especificación Técnica & Contratos
- **Interfaces TypeScript:**
`	ypescript
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
`

## 4. Decisiones Autónomas de Diseño & UX
1. **Flujo Progresivo de 3 Pasos (Step Progress Bar):** 
   - Paso 1: Nombre del Consultorio / Clínica y Odontólogo Titular.
   - Paso 2: URL del Logo y vista previa visual con fallback SVG si no se proporciona logo.
   - Paso 3: Cédula Profesional y Teléfono de contacto del consultorio.
2. **Modo Demo Reset:** Botón accesible en cabecera 'Probar Onboarding Demo' que reinicia el formulario al paso 1 y permite probar el proceso n veces de forma autónoma.
3. **Modo Oscuro UI/UX Pro Max:** Estilo g-slate-950 con tarjeta glassmorphism g-slate-900/90, bordes order-slate-800, acentos champagne dorados (	ext-amber-300) y botón primario de acción en verde esmeralda (g-emerald-600).
4. **Respeto a Límites:** OnboardingWizard.tsx se mantuvo en 145 líneas (bien por debajo del límite estricto de 180 líneas).

## 5. Verificación & Calidad
- **TypeScript (	sc -b):** 0 errores de compilación.
- **Pruebas Unitarias (
pm run test):** Vitest specs pasando al 100%.
- **Compilación de Producción (
pm run build):** Vite build sin advertencias.
