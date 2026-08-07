---
name: clean-ui-architecture
description: Guía de Arquitectura Limpia (Clean Architecture), Capa de Servicios (Repository Pattern), Manejo de Errores de Dominio, Sistema de Diseño UI UX Pro Max y Estándares de UX/UI para el CRM Odontológico.
---

# CRM ODONTÓLOGO - Clean Architecture & UX/UI Guidelines

Esta habilidad define los patrones de diseño frontend, desacoplamiento de servicios y estándares de experiencia de usuario (UX/UI) para la plataforma.

---

## 🏛️ 1. Arquitectura Limpia (Clean Architecture)

### Regla de Oro: Desacoplamiento de Vista e Infraestructura
Ningún componente de React (`src/components/` o `src/features/`) debe importar o ejecutar llamadas directas al SDK de Firebase (`getDoc`, `collection`, `signInWithEmailAndPassword`).

### Flujo de Capas Obligatorio:
1. **Vista (React Component):** Renderiza JSX y maneja eventos de UI.
2. **Custom Hook de Dominio (`src/hooks/` o `src/features/*/hooks`):** Maneja el estado local (`loading`, `error`, `data`).
3. **Capa de Servicios (`src/services/`):** Implementa el patrón Repository/CoreService. Retorna promesas de TypeScript puras.
4. **Infraestructura (`src/config/firebase.ts`):** Clientes de SDK y red.

```text
src/
  ├── components/ui/       # Átomos reutilizables puros (Button, Input, Modal, Card)
  ├── features/            # Dominios de negocio aislados
  │     ├── quotes/             # Editor Canva, PDF, Cotizaciones
  │     ├── patients/           # Expedientes, Galería de Antes/Después
  │     ├── accounting/         # Ingresos, Egresos, Utilidades
  │     └── settings/           # Marca y plantillas
  ├── services/            # Core Services / Repositorios desacoplados
  │     ├── authService.ts
  │     ├── patientService.ts
  │     ├── quoteService.ts
  │     ├── storageService.ts   # Manejo de imágenes (Antes/Después) y PDFs
  │     └── accountingService.ts
  ├── types/               # Modelos e Interfaces de TypeScript
  └── utils/               # Funciones puras
```

---

## 🎨 2. Estándares de UX/UI e Interacción

### Sensación Premium (Rich Aesthetics)
- **Sistema de Color HSL:** Colores tailoreados (pizarra médica, dorado champagne para cotizaciones, acentos de estado).
- **Feedback Inmediato & Skeleton Loaders:** Sin pantallas en blanco ni cargadores repentinos. Usar estados de carga optimistas.
- **Micro-interacciones:** Transiciones suaves (`duration-200 ease-in-out`), modales fluidos y hover states claros.

### Accesibilidad & Eficiencia en Consultorio
- **Atajos de Teclado:** Permitir llenar tablas y navegar por campos usando `Tab` y `Enter`.
- **Visor Clínico (Antes / Después):** Interfaz táctil adaptada para iPads y monitores del consultorio con slider comparativo de fotografías de tratamientos.
- **WYSIWYG (What You See Is What You Get):** Previsualización en vivo 100% idéntica al PDF final exportado.

---

## 🚨 3. Manejo de Errores de Dominio (Domain Error Pattern)

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

## 🎯 4. Reglas UI/UX Pro Max (Cero Dev Slop)

Todo componente visual DEBE alinearse al sistema de diseño **UI/UX Pro Max**:

1. **Erradicación Total de Jerga de Desarrollo:** Está PROHIBIDO incluir en la interfaz del usuario final leyendas como `"Multi-tenant v1.0"`, `"Estado de Infraestructura Cloud"`, `"RBAC Activo"`, rutas de base de datos (`/clinics/...`) o botones de prueba temporal.
2. **Paleta de Colores Curada (Dark Mode Elegante):**
   - **Fondo Base:** `bg-slate-950` / `bg-slate-900`.
   - **Tarjetas & Contenedores:** Glassmorphism refinado (`glass-card`, `backdrop-blur-xl`, bordes `border-white/10` o `border-slate-800`).
   - **Color de Acento Dorado / Champagne (Marca Dra. Daniela):** `#D8C593` / `text-amber-300` / `border-amber-500/20`.
   - **Acentos Médicos:** `cyan-500` / `blue-600` / `emerald-500`.
3. **Targets Táctiles Responsivos PWA:** Todos los botones, campos y celdas interactivos deben tener una altura/área mínima de `min-h-[44px]` para iPad, iPhone y pantallas táctiles.

---

## 🧭 5. Reglas de Enrutamiento & Navegación

1. **Login por Defecto:** Si no existe sesión activa (`authService.getCurrentUser() === null`), la aplicación DEBE cargar por defecto la vista de **Login (`LoginView`)**.
2. **Wizard de Onboarding Inicial:** Si el dueño del consultorio inicia sesión por primera vez (`hasCompletedOnboarding === false`), se le presenta el **Wizard en 3 Pasos** para configurar nombre, logo y cédula profesional.
3. **Navegación Lateral (Sidebar Responsivo):** Menú lateral colapsable en escritorio / hamburguesa en móviles con las secciones clínicas reales:
   - 📌 **Inicio / Dashboard**
   - 👥 **Pacientes & Expedientes**
   - 📝 **Cotizador (Estilo Canva)**
   - 📅 **Agenda & Citas**
   - 💰 **Contabilidad & Finanzas**
   - ⚙️ **Configuración del Consultorio**

---

## ☁️ 6. Estrategia de Entornos Firebase (Proyecto Único MVP ➔ Upgrade a Dual UAT/PROD)

### 6.1 Estado Actual (Proyecto Único MVP / Desarrollo)
- **1 Solo Proyecto Firebase (`crm-odontologo-app-prod`):** Se utiliza un único proyecto de Firebase para desarrollo, pruebas y MVP.
- **Aislamiento Multi-Tenant Lógico:** Todos los consultorios comparten la misma infraestructura de Firebase, pero sus datos se aíslan estrictamente en Firestore bajo la ruta `/clinics/{clinicId}` según las reglas de seguridad (`firestore.rules`).
- **Pruebas de Desarrollo:** Las pruebas en localhost y trabajo de subagentes utilizan cuentas demo (`nuevo@consultorio.com`, `dra.daniela@cazaresdental.com`).

### 6.2 Criterios para Activar el Upgrade a 2 Proyectos (`UAT` + `PROD`)
Se deberá desglosar Firebase en 2 proyectos independientes (`crm-odontologo-uat` y `crm-odontologo-prod`) cuando se cumpla cualquiera de las siguientes condiciones:

1. **Lanzamiento Comercial a Producción:** Cuando existan consultorios médicos reales pagando la suscripción y registrando información clínica/financiera real.
2. **Pipelines de CI/CD Desplegados:** Cuando se configure un pipeline automatizado de despegue continuo (GitHub Actions ➔ Firebase Hosting Staging Channel).

### 6.3 Procedimiento de Upgrade (Futuro)
- `crm-odontologo-uat`: Vinculado a `.env.development` (para desarrollo local y pruebas de subagentes).
- `crm-odontologo-prod`: Vinculado a `.env.production` (para despliegues finales de clientes reales).

