# 003 - Estándares de Calidad, Pruebas Automatizadas & Especificación de Issues

## 📐 Estándar de Issues Herméticos (7 Dimensiones)

Cada tarea o requerimiento en GitHub se redacta bajo las 7 dimensiones obligatorias:
1. Contexto & Propósito de Negocio (Business Why).
2. Dependencias Bloqueantes (`Depende de: #XX`).
3. Ubicación Exacta de Archivos & Contratos TypeScript (Zero Guessing).
4. Criterios de Aceptación BDD (*Given-When-Then*).
5. Requisitos No Funcionales (NFRs, INP <50ms, CLS = 0, límite 150 líneas).
6. Casos de Prueba Unitarios Obligatorios (Vitest Specs).
7. Definición de Terminado (DoD).

---

## 🧪 Estrategia de Pruebas & CI Pipeline

- **Vitest + React Testing Library:** Pruebas unitarias y de componentes.
- **CI Pipeline (`.github/workflows/ci.yml`):** Ejecución automática de `npm run lint`, `npm run test` y `npm run build` en cada PR.
- **AI PR Reviewer Bot (`.github/workflows/pr-reviewer.yml`):** Audita el diff contra `AGENTS.md` y publica la revisión en GitHub.
