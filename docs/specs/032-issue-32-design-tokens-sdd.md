# SDD: 032 - Issue #32: Fundación de Design Tokens (Paletas de Marca y Tipografía Unificada)

## 📌 Status
**Estado:** Completed
**Fecha:** 2026-08-07
**Autor:** Subagente Desarrollador (IA)

---

## 🎯 Objetivo de Negocio
Reconstruir la fuente de verdad del theming de la plataforma, eliminando la competencia entre 3 mecanismos (variables CSS por `[data-theme]`, overrides `!important` de Tailwind y hex hardcodeado en JSX). Se introduce una capa semántica de color invariante entre temas (éxito/advertencia/peligro/info) y se unifica la tipografía de las 3 paletas de marca (Lexend + Source Sans 3), eliminando 4 fuentes redundantes sin justificación de diseño.

---

## 🏗️ Cambios Realizados

### 1. `src/index.css`
- **`@import` de Google Fonts (línea 1):** reemplazado. Antes cargaba `Inter`, `Outfit`, `Playfair Display` y `Plus Jakarta Sans`. Ahora carga únicamente `Lexend:wght@400;500;600;700` y `Source+Sans+3:wght@400;500;600;700`.
- **Tokens semánticos nuevos (agregados en un bloque `:root` separado, fuera de `[data-theme]`, por lo que NO varían entre temas):**
  ```css
  --color-success: #22C55E; --color-success-bg: rgba(34,197,94,0.10); --color-success-border: rgba(34,197,94,0.20);
  --color-warning: #F59E0B; --color-warning-bg: rgba(245,158,11,0.10); --color-warning-border: rgba(245,158,11,0.20);
  --color-danger:  #F43F5E; --color-danger-bg: rgba(244,63,94,0.10);  --color-danger-border: rgba(244,63,94,0.20);
  --color-info:    #38BDF8; --color-info-bg: rgba(56,189,248,0.10);  --color-info-border: rgba(56,189,248,0.20);
  ```
- **Utilidades semánticas nuevas** (mismo patrón que `.theme-accent-text/-bg/-border`): `.theme-success-text/-bg/-border`, `.theme-warning-text/-bg/-border`, `.theme-danger-text/-bg/-border`, `.theme-info-text/-bg/-border`. Todas con `!important` para ganar especificidad sobre utilidades Tailwind, igual que las existentes de accent.
- **Bloques `[data-theme]` reescritos** con los valores exactos especificados en el issue (`gold`, `emerald`, `editorial`): nuevos `--bg-app`, `--bg-surface`, `--bg-card`, `--color-muted` (en `editorial`), `--border-glass`, y tipografía unificada `--font-heading: 'Lexend'` / `--font-body: 'Source Sans 3'` en los 3 temas. `--color-accent`/`--color-accent-hover`/`--color-accent-glow` se mantuvieron sin cambios respecto al valor previo de `gold` y `emerald`; `editorial` cambió su acento de amarillo (`#EAB308`) a durazno (`#E8A87C`) según especificación.
- **Se mantuvieron intactos** los overrides `.bg-slate-950/900/800` con `!important` y `.glass-card`, ya que `App.tsx` y otros componentes aún dependen de ellos hasta su propia migración (fuera del alcance de este issue).

### 2. `src/hooks/useTheme.ts`
- Se actualizó `badgeColor` de la opción `editorial` en `THEME_OPTIONS` de `#EAB308` a `#E8A87C` para reflejar el nuevo acento de la paleta.
- `gold` (`#D8C593`) y `emerald` (`#10B981`) ya coincidían con los valores objetivo, no requirieron cambio.
- La API pública del hook (`theme`, `setTheme`, `themeOptions`) no se modificó.

### 3. `src/hooks/useTheme.test.ts` (nuevo)
Suite Vitest + React Testing Library (`renderHook`/`act`), siguiendo la convención de `SidebarNav.test.tsx` y `ProtectedRoute.test.tsx`:
1. `THEME_OPTIONS expone los 3 ids gold/emerald/editorial con badgeColor actualizado` — verifica orden e IDs, y los 3 valores hex de `badgeColor`.
2. `useTheme persiste y restaura el tema seleccionado desde localStorage` — cambia el tema, valida `localStorage.getItem`, desmonta y remonta el hook para confirmar la restauración.
3. `useTheme aplica data-theme=gold por defecto si no hay valor guardado` — valida el atributo `data-theme` en `document.documentElement` tras el primer render sin valor previo en `localStorage`.

---

## 🎨 Contratos CSS Exportados (Tokens)

| Categoría | Variables |
|---|---|
| Semántica (invariante por tema) | `--color-success(-bg/-border)`, `--color-warning(-bg/-border)`, `--color-danger(-bg/-border)`, `--color-info(-bg/-border)` |
| Marca (varía por `[data-theme]`) | `--bg-app`, `--bg-surface`, `--bg-card`, `--color-primary`, `--color-muted`, `--color-accent`, `--color-accent-hover`, `--color-accent-glow`, `--border-glass`, `--font-heading`, `--font-body` |
| Utilidades semánticas | `.theme-success-text/-bg/-border`, `.theme-warning-text/-bg/-border`, `.theme-danger-text/-bg/-border`, `.theme-info-text/-bg/-border` |
| Utilidades de marca (ya existentes, sin cambio de contrato) | `.theme-accent-text/-bg/-border` |

---

## 🧩 Decisiones Autónomas
1. **Ubicación del bloque de tokens semánticos:** se agregó como un bloque `:root { ... }` independiente inmediatamente antes de `:root, [data-theme="gold"] { ... }`, en vez de fusionarlo dentro del selector `:root, [data-theme="gold"]`. Esto deja explícito en el código que estas variables son intencionalmente invariantes por tema (no seleccionables por `[data-theme]`), cumpliendo el AC-2 de forma inequívoca y facilitando auditoría visual futura.
2. **`--color-accent` de `gold` y `emerald`:** el issue no especificaba cambio de acento para estos dos temas (solo `bg-app`/`bg-surface`/`bg-card`/`border-glass`/fuentes), por lo que se conservó el mismo valor de acento que ya tenían antes de esta issue, consistente con el `badgeColor` que ya coincidía en `useTheme.ts`.
3. **Alcance de tests:** se limitó la suite a los 3 tests explícitamente pedidos, sin agregar cobertura adicional no solicitada, para mantener el cambio atómico y alineado al issue.

---

## ⚡ Verificación & DoD
- [x] `npx tsc -b`: 0 errores de TypeScript.
- [x] `npm run test`: 8 archivos de test, 28 tests, 100% en verde (incluye los 3 nuevos de `useTheme.test.ts`).
- [x] `npm run build`: compilación Vite limpia sin advertencias (4.95s).
- [x] AC-1: `[data-theme="editorial"]` → `--color-accent: #E8A87C`. Verificado en `src/index.css`.
- [x] AC-2: `--color-success: #22C55E` definido en `:root` fuera de bloques `[data-theme]`, por lo que es invariante entre temas.
- [x] AC-3: `@import` de `src/index.css` solo referencia `Lexend` y `Source+Sans+3`.
