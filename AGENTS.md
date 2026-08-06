# AGENTS.md - Contexto, Arquitectura y Reglas de Calidad para Asistentes de IA

Bienvenido al proyecto **CRM ODONTÓLOGO**. Este archivo contiene el contexto fundamental del proyecto, arquitectura, estándares de calidad estricta y reglas de gobernanza para que cualquier sesión de agente opere con total claridad.

---

## 📌 Resumen del Proyecto y Stack Tecnológico

- **Aplicación**: Plataforma SaaS Multi-tenant de Gestión Contable, CRM de Pacientes y Cotizaciones Personalizadas (Estilo Canva) para Consultorios Odontológicos.
- **Tecnologías Core**: React 18 / Vite 6, TypeScript (modo estricto), Tailwind CSS v4.
- **Backend / Nube**: Google Firebase (Firebase Auth + Cloud Firestore + Firebase Storage + Firebase Hosting).
- **Testing**: Vitest + React Testing Library + Firebase Rules Unit Testing.
- **Exportación PDF**: HTML2PDF / React-PDF (generación vectorial de alta fidelidad).

---

## 📐 Estándares de Arquitectura y Limpieza de Código (OBLIGATORIOS)

### 1. Límite de Tamaño de Archivos (Single Responsibility Principle)
- **Componentes / Páginas:** Máximo **150 - 200 líneas por archivo**. Si un archivo excede las 200 líneas, **DEBE** modularizarse en subcomponentes o mover la lógica a Custom Hooks.
- **Funciones y Hooks:** Máximo **50 líneas por función**.
- **Cero Monolitos:** Prohibido crear componentes monolíticos masivos.

### 2. Convención de Nombres Estándar
- **Componentes React:** `PascalCase.tsx` (ej. `QuoteTable.tsx`, `PatientCard.tsx`).
- **Custom Hooks:** `camelCase.ts` con prefijo `use` (ej. `useQuoteEditor.ts`, `usePatients.ts`).
- **Servicios y Utilidades:** `camelCase.ts` (ej. `tenantService.ts`, `formatCurrency.ts`).
- **Tipos e Interfaces:** `PascalCase.ts` (ej. `QuoteTypes.ts`, `ClinicTenant.ts`).

### 3. Arquitectura Basada en Dominios/Funcionalidades (Feature-Driven Architecture)
```text
src/
  ├── components/      # Componentes UI reutilizables genéricos (Button, Input, Modal, Table)
  ├── features/        # Módulos aislados por área de negocio (Domain Driven)
  │     ├── quotes/         # Editor estilo Canva, generador de PDF, vistas de presupuesto
  │     ├── patients/       # CRM de pacientes y expedientes
  │     ├── accounting/     # Ingresos, egresos, reportes de utilidades
  │     └── settings/       # Personalizador de marca y datos del consultorio
  ├── hooks/           # Custom hooks globales
  ├── services/        # Firebase Auth, Firestore y Storage helpers
  ├── types/           # Definiciones globales de TypeScript
  └── utils/           # Funciones puras (formateadores, validadores)
```

---

## 📜 Reglas de Gobernanza e Ingeniería (OBLIGATORIAS)

1. **Flujo Automatizado de Issues & PRs (`issue-workflow`)**:
   - Todo Bug o User Story detectado debe primero **registrarse como Issue en GitHub** con criterios de aceptación.
   - El trabajo de código se delega a un **Subagente en un Git Worktree aislado** (`Workspace: 'share'`) bajo la rama `fix/issue-XX` o `feature/issue-XX`.

2. **Cero Auto-Merge / Cero Push Directo a `develop`, `uat` o `prod`**:
   - Todo cambio debe realizarse en su propia rama y enviarse mediante un **Pull Request (PR) a `develop`** para la **aprobación manual del usuario**.

3. **Verificación Pre-Merge en Batería de Checks**:
   - Todo PR debe pasar limpiamente:
     - `tsc -b` (cero errores de TypeScript).
     - `npm run test` (todos los unit/component tests en verde).
     - `npm run build` (compilación limpia de Vite sin advertencias).

4. **Historial de Features en `docs/specs/`**:
   - Cada nueva especificación, plan de implementación o cambio arquitectónico debe registrarse en la carpeta `docs/specs/` con nomenclatura incremental (`001-...md`, `002-...md`).
