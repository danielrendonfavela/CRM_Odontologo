---
name: clean-ui-architecture
description: Guía de Arquitectura Limpia (Clean Architecture), Capa de Servicios (Repository Pattern), Sistema de Diseño UI UX Pro Max y Estándares de UX/UI para el CRM Odontológico.
---

# CRM ODONTÓLOGO - Clean UI Architecture & UI UX Pro Max Standard

Esta habilidad estandariza la separación de capas, el desacoplamiento de la interfaz de usuario respecto a servicios de base de datos y la aplicación del sistema de diseño **UI/UX Pro Max** para erradicar cualquier jerga o insignia de desarrollo ("AI Slop").

---

## 🎨 1. Estándares Visuales UI UX Pro Max (Cero Dev Slop)

Todo componente React UI construido para el CRM Odontológico DEBE cumplir con las siguientes directrices de diseño:

- **Cero Insignias o Jerga de Desarrollo:** Está PROHIBIDO incluir textos técnicos como `"Multi-tenant v1.0"`, `"Estado de Infraestructura Cloud"`, `"RBAC Activo"`, rutas de base de datos (`/clinics/...`) o botones de previsualización temporal en la interfaz final.
- **Paleta de Colores Curada (Modo Oscuro Elegante):**
  - Fondo Principal: `bg-slate-950` / `bg-slate-900`
  - Tarjetas / Paneles: Glassmorphism refinado (`glass-card`, `backdrop-blur-xl`, bordes `border-white/10` o `border-slate-800`).
  - Acento Dorado / Champagne (Marca Dra. Daniela): `#D8C593` / `text-amber-300` / `border-amber-500/20`.
  - Acento Médico: `cyan-500` / `blue-600` / `emerald-500`.
- **Target Táctil PWA Responsivo:** Todos los botones e insumos interactivos deben tener un alto mínimo de `min-h-[44px]` para un uso óptimo en iPad / iPhone / Pantalla táctil.

---

## 📐 2. Desacoplamiento Estricto (Repository Pattern)

- **Prohibición Directa de SDK:** Ningún componente React en `src/features/.../components/` o `src/components/` puede importar `firebase/firestore` ni ejecutar `getFirestore()`, `collection()`, `doc()` directamente.
- **Capa de Servicios (`src/services/`):** Toda interacción con la nube o base de datos DEBE realizarse consumiendo las interfaces exportadas por los servicios en `src/services/` (ej. `authService.ts`, `tenantService.ts`, `storageService.ts`).

---

## 🧭 3. Navegación & Experiencia del Usuario (UX)

- **Login por Defecto:** Si no existe sesión activa (`authService.getCurrentUser() === null`), la aplicación DEBE cargar directamente la pantalla de **Login (`LoginView`)**.
- **Sidebar Responsivo:** Navegación por menú lateral colapsable / menú hamburguesa con las secciones reales de la práctica clínica:
  1. 📌 **Inicio / Dashboard**
  2. 👥 **Pacientes & Expedientes**
  3. 📝 **Cotizador (Estilo Canva)**
  4. 📅 **Agenda de Citas**
  5. 💰 **Contabilidad & Finanzas**
  6. ⚙️ **Configuración del Consultorio**
