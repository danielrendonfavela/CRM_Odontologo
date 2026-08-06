---
name: clean-ui-architecture
description: Guía de Arquitectura Limpia (Clean Architecture), Capa de Servicios (Repository Pattern), Manejo de Errores de Dominio, Sistema de Diseño UI UX Pro Max y Estándares de UX/UI para el CRM Odontológico.
---

# CRM ODONTÓLOGO - Clean Architecture, Service Layer & UI UX Pro Max Standard

Esta habilidad es la guía maestra de arquitectura frontend y diseño visual para el proyecto **CRM ODONTÓLOGO**. Garantiza la separación estricta de responsabilidades, la encapsulación de lógica en la capa de servicios y una experiencia visual de nivel enterprise sin insignias ni jerga de desarrollador ("AI Slop").

---

## 🏛️ 1. Arquitectura de 3 Capas (Clean Architecture)

Toda funcionalidad en el sistema debe respetar la división tripartita de capas:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Capa de Presentación (React UI Components & Custom Hooks) │
│    src/features/*/components/ & src/hooks/                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Consume Interfaces Puras)
┌──────────────────────────────▼──────────────────────────────┐
│ 2. Capa de Servicios y Dominio (Business Logic & Repositories)│
│    src/services/ (authService.ts, tenantService.ts, etc.)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Llama a SDK de la Nube)
┌──────────────────────────────▼──────────────────────────────┐
│ 3. Capa de Infraestructura & Almacenamiento (Firebase SDK)   │
│    src/config/firebase.ts, StorageService, Firestore SDK    │
└─────────────────────────────────────────────────────────────┘
```

### Regla de Oro de Desacoplamiento (Repository Pattern):
- **Prohibición Directa de SDK en UI:** NINGÚN componente React en `src/features/.../components/` o `src/components/` puede importar `firebase/firestore`, `firebase/auth` ni ejecutar `getFirestore()`, `collection()`, `doc()`, `signInWithPopup()` directamente.
- **Interfaces Puras en Services:** Todo servicio en `src/services/` exporta contratos TypeScript puros (`AuthService`, `TenantService`, `QuoteService`) y maneja la comunicación con Firebase por debajo.

---

## 🚨 2. Manejo de Errores de Dominio (Domain Error Pattern)

Los servicios no deben retornar excepciones descontroladas de tipo `any`. Deben capturar errores de infraestructura y re-emitir excepciones de dominio fuertemente tipadas:

```typescript
export class DomainError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class NetworkError extends DomainError {
  constructor(message = 'Pérdida de conexión a internet') {
    super(message, 'NETWORK_ERROR');
  }
}

export class AuthError extends DomainError {
  constructor(message = 'Error de autenticación o permisos insuficientes') {
    super(message, 'AUTH_ERROR');
  }
}
```

La UI captura estas excepciones y renderiza alertas flotantes de error accesibles (`role="alert"`, `aria-live="assertive"`).

---

## 🎣 3. Encapsulación de Lógica en Custom Hooks

Los componentes de presentación React son **Componentes Tontos (Presentacionales)** enfocados 100% en JSX y Tailwind. La lógica de estado, ordenamiento, filtrado y llamadas a servicios debe encapsularse en Custom Hooks:

- **Ubicación:** `src/hooks/` para hooks globales, o `src/features/[feature]/hooks/` para hooks de dominio.
- **Nomenclatura:** `use[Name].ts` (ej. `useAuth.ts`, `usePatients.ts`, `useQuoteEditor.ts`).
- **Límite de tamaño:** Máximo 50 líneas por función/hook.

---

## 🎨 4. Sistema de Diseño UI/UX Pro Max (Cero Dev Slop)

Todo componente visual DEBE alinearse al sistema de diseño **UI/UX Pro Max**:

1. **Erradicación Total de Jerga de Desarrollo:** Está estrictamente PROHIBIDO incluir en la interfaz del usuario final leyendas como `"Multi-tenant v1.0"`, `"Estado de Infraestructura Cloud"`, `"RBAC Activo"`, rutas de base de datos (`/clinics/...`) o botones de prueba temporal.
2. **Paleta de Colores Curada (Dark Mode Elegante):**
   - **Fondo Base:** `bg-slate-950` / `bg-slate-900`.
   - **Tarjetas & Contenedores:** Glassmorphism refinado (`glass-card`, `backdrop-blur-xl`, bordes `border-white/10` o `border-slate-800`).
   - **Color de Acento Dorado / Champagne (Marca Dra. Daniela):** `#D8C593` / `text-amber-300` / `border-amber-500/20`.
   - **Acentos Médicos:** `cyan-500` / `blue-600` / `emerald-500`.
3. **Targets Táctiles Responsivos PWA:** Todos los botones, campos y celdas interactivos deben tener una altura/área mínima de `min-h-[44px]` para iPad, iPhone y pantallas táctiles.
4. **Micro-animaciones Sobrias:** Transiciones suaves de `150ms` a `300ms` (`transition-all duration-200`) para hovers y estados activos.

---

## 🧭 5. Reglas de Enrutamiento & Experiencia del Usuario (UX)

1. **Login por Defecto:** Si no existe sesión activa (`authService.getCurrentUser() === null`), la aplicación DEBE cargar por defecto la vista de **Login (`LoginView`)**.
2. **Wizard de Onboarding Inicial (Primera Vez):** Si el dueño del consultorio inicia sesión por primera vez (`hasCompletedOnboarding === false`), se le presenta el **Wizard en 3 Pasos** (`OnboardingWizard.tsx`) para configurar el nombre de su consultorio, logo y cédula profesional.
3. **Navegación Lateral (Sidebar Responsivo):** Una vez dentro del CRM, la navegación se realiza mediante un Sidebar colapsable en escritorio y menú hamburguesa en dispositivos móviles/tablets con las secciones clínicas reales:
   - 📌 **Inicio / Dashboard**
   - 👥 **Pacientes & Expedientes**
   - 📝 **Cotizador (Estilo Canva)**
   - 📅 **Agenda & Citas (Google Calendar)**
   - 💰 **Contabilidad & Finanzas (Acceso por Rol)**
   - ⚙️ **Configuración del Consultorio**
