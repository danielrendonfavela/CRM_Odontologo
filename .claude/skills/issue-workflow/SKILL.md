---
name: issue-workflow
description: Workflow automatizado de creación de GitHub Issues, asignación de subagente en Git Worktree, verificación, AI PR Reviewer y entrega al usuario.
---

# CRM ODONTÓLOGO - Automated Issue & Review Workflow

Esta habilidad estandariza el flujo automatizado desde la creación del Issue hasta la revisión de código por IA y la entrega final al usuario.

---

## 🔄 Flujo Automatizado de 6 Pasos

```mermaid
sequenceDiagram
    participant U as Usuario
    participant AP as Agente Principal
    participant SA as Subagente (Worktree)
    participant GH as GitHub (CI / AI Reviewer)

    U->>AP: 1. Aprobar Issue Enriquecido (7D)
    AP->>SA: 2. Invocar Subagente en rama 'feature/issue-XX'
    SA->>SA: 3. Desarrollar solución y validar con 'npm run test && npm run build'
    SA->>GH: 4. Push de rama y abrir Pull Request ('Closes #XX')
    GH->>GH: 5. Ejecutar CI Checks y AI PR Reviewer (Feedback automatizado)
    Note over SA,GH: Si AI Reviewer solicita cambios, el Subagente los corrige en la misma rama
    GH-->>U: 6. Notificar al Usuario con PR [✅ APROBADO BDC] para revisión de UI/UX
```

---

## 🎨 Paso 0: Inteligencia de Diseño Pre-Codificación (OBLIGATORIO)

Antes de escribir una sola línea de código, todo subagente DEBE ejecutar los siguientes pasos:

### 0.1 Leer Fuentes de Verdad de Diseño
1. **`design-system/crm-odontologo/MASTER.md`** — Paleta de colores (slate + dorado `#D8C593`), tipografía (Inter + DM Sans), spacing tokens, shadow depths, anti-patrones y pre-delivery checklist.
2. **`.agents/skills/clean-ui-architecture/SKILL.md`** — Arquitectura de 3 capas, Repository Pattern, manejo de errores de dominio, reglas de enrutamiento y estándares visuales UI UX Pro Max.

### 0.2 Búsquedas Autónomas de UX & Stack (Opcional pero Recomendado)
El subagente PUEDE ejecutar búsquedas específicas del skill `ui-ux-pro-max` para obtener directrices tácticas relevantes a su componente:

```bash
# Tips de UX para el componente (loading states, animaciones, accesibilidad)
python .agents/skills/ui-ux-pro-max/scripts/search.py "<keywords del componente>" --domain ux

# Mejores prácticas de React para el componente (hooks, performance, state)
python .agents/skills/ui-ux-pro-max/scripts/search.py "<keywords del componente>" --stack react
```

### 0.3 Reglas Visuales No Negociables
- **Iconos:** Lucide React SVG. PROHIBIDO usar emojis como iconos en la UI.
- **Targets Táctiles:** `min-h-[44px]` en botones, inputs y celdas interactivas.
- **Transiciones:** `transition-all duration-200` (150-300ms). Cero cambios instantáneos.
- **Cursor:** `cursor-pointer` en todo elemento clickeable.
- **Dev Jargon:** PROHIBIDO. Cero badges de "Multi-tenant", "RBAC", "Infraestructura", etc.

---

## 📋 Protocolo de Revisión Técnica & Autocorrección

1. **Revisión Técnica 100% Automatizada:**
   - El subagente NO le pide al usuario que revise tipos de TypeScript, cobertura de código ni rendimiento. De eso se encargan los CI Checks y el **AI PR Reviewer Bot**.
2. **Ciclo de Autocorrección del Subagente:**
   - Si el AI PR Reviewer publica un comentario con observaciones o `[⚠️ REQUIERE CAMBIOS]`, el subagente lee las observaciones con `gh pr view`, aplica las correcciones en su rama `feature/issue-XX`, sube los cambios a GitHub y espera la aprobación verde del AI Reviewer (`[✅ APROBADO]`).
3. **Entrega Visual al Usuario:**
   - Una vez que el PR tiene los CI Checks en verde y la aprobación del AI PR Reviewer, el Agente Principal notifica al usuario entregando el enlace del PR. El usuario solo debe verificar el aspecto visual y la experiencia (UI/UX) antes de presionar 'Merge'.
