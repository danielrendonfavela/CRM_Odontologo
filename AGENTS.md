# AGENTS.md - Contexto y Guía para Asistentes de IA (Antigravity & Claude)

Bienvenido al proyecto **CRM ODONTÓLOGO**. Este archivo contiene el contexto fundamental del proyecto, arquitectura, reglas de gobernanza y punteros a la documentación histórica para que cualquier sesión de agente pueda operar con total claridad.

---

## 📌 Resumen del Proyecto y Stack Tecnológico

- **Aplicación**: Plataforma SaaS Multi-tenant de Gestión Contable, CRM de Pacientes y Cotizaciones Personalizadas (Estilo Canva) para Consultorios Odontológicos.
- **Tecnologías Core**: React 18 / Vite, TypeScript (modo estricto), Tailwind CSS / Vanilla CSS.
- **Backend / Nube**: Google Firebase (Firebase Auth + Cloud Firestore + Firebase Storage + Firebase Hosting).
- **Exportación PDF**: HTML2PDF / React-PDF (generación vectorial de alta fidelidad).

---

## 📜 Reglas de Gobernanza e Ingeniería (OBLIGATORIAS)

1. **Flujo Automatizado de Issues & PRs (`issue-workflow`)**:
   - Todo Bug o User Story detectado debe primero **registrarse como Issue en GitHub** con criterios de aceptación.
   - El trabajo de código se delega a un **Subagente en un Git Worktree aislado** (`Workspace: 'share'`) bajo la rama `fix/issue-XX` o `feature/issue-XX`.

2. **Cero Auto-Merge / Cero Push Directo a `uat` o `prod`**:
   - Todo cambio debe realizarse en su propia rama y enviarse mediante un **Pull Request (PR) a `develop`** para la **aprobación manual del usuario**.

3. **Verificación Pre-Merge**:
   - Todo código debe ser validado ejecutando `npm run build` sin errores ni advertencias de TypeScript antes de solicitar revisión de PR.

4. **Historial de Features en `docs/specs/`**:
   - Cada nueva especificación, plan de implementación o cambio arquitectónico debe registrarse en la carpeta `docs/specs/` con nomenclatura incremental (`001-...md`, `002-...md`).

---

## 🗂️ Registro de Funcionalidades e Historial (`docs/specs/`)

Consulta los documentos de especificación técnica en `docs/specs/` para conocer el detalle de la arquitectura construida.
