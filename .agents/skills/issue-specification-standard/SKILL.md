---
name: issue-specification-standard
description: Estándar de Especificación de Issues Enriquecidos (Atomic Issues, BDD Acceptance Criteria, NFRs, Vitest Specs y Definition of Done) para el CRM Odontológico.
---

# CRM ODONTÓLOGO - Atomic & Enriched Issue Specification Standard

Esta habilidad define las reglas estrictas para crear y estructurar cada GitHub Issue o User Story en el proyecto. Ningún subagente o desarrollador debe iniciar trabajo sin un Issue que cumpla este estándar de 6 dimensiones.

---

## 📐 Las 6 Dimensiones de un Issue Enriquecido

Todo Issue debe ser **Atómico** (abarcar máximo 1 a 3 archivos) y contener las siguientes 6 secciones:

### 1. 📌 Contexto & Propósito de Negocio (Business Why)
- Razón de ser de la funcionalidad y beneficio para el usuario (Dra. Daniela o Asistente).

### 2. 📁 Ubicación Exacta de Archivos & Contratos TypeScript (Zero Guessing)
- Definición explícita de rutas de archivo, tipos e interfaces.
  - Ejemplo: `src/features/auth/components/LoginView.tsx`
  - Ejemplo Props: `LoginViewProps { onGoogleSignIn: () => void; isLoading: boolean; error?: string; }`

### 3. 🎯 Criterios de Aceptación (ACs) en Formato BDD (Given-When-Then)
- Criterios matemáticos sin ambigüedad:
  - **AC-1:** *DADO* que el usuario está en una pantalla móvil, *CUANDO* se renderiza la vista de Login, *ENTONCES* se muestra el botón 'Continuar con Google' ocupando el 100% del ancho con área táctil >= 44px.
  - **AC-2:** *DADO* que el usuario da clic en 'Continuar con Google', *CUANDO* inicia el proceso de autenticación, *ENTONCES* el botón se deshabilita y muestra un spinner de carga.

### 4. ⚡ Requisitos No Funcionales (NFRs & Performance)
- Límite de líneas por archivo (máximo 150-200).
- TypeScript estricto sin `any`.
- Respuesta a la interacción `<50ms` (INP).
- Accesibilidad ARIA, contraste HSL y soporte de teclado (`Tab`, `Enter`, `Escape`).

### 5. 🧪 Casos de Prueba Unitarios Obligatorios (Vitest Spec)
- Especificación de las pruebas unitarias que deben crearse en Vitest:
  - `test("debe renderizar el botón de Google correctamente")`
  - `test("debe deshabilitar interacción cuando isLoading es true")`

### 6. ✅ Definición de Terminado (Definition of Done - DoD)
- [ ] `npm run lint` pasa en 0 errores.
- [ ] `npm run test` pasa con 100% de éxito en Vitest.
- [ ] `npm run build` compila de forma limpia en `<4s`.
- [ ] PR abierto a `develop` vinculando `Closes #XX`.
