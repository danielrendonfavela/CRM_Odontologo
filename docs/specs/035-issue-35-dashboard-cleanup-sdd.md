# Software Design Document (SDD) - Issue #35: Dashboard — Eliminar Elementos Decorativos Sin Función Real

**Autor:** Subagente Desarrollador (Issue #35)
**Fecha:** 07 de Agosto de 2026
**Estado:** Aprobado & Verificado
**Relacionado:** Issue #35 (este documento), Issue #33 (`HeaderNav.tsx`, no tocado), Issue #34 (`SidebarNav.tsx`, no tocado)

---

## 1. Resumen Ejecutivo

El dashboard en `src/App.tsx` contenía tres elementos decorativos que simulaban datos inexistentes o incorrectos:

1. Un badge "● Consultorio Activo" con probabilidad 100% de ser cierto (sin monitoreo real de uptime detrás).
2. Un indicador de tendencia "+12% este mes" en la tarjeta "Total Pacientes", con un número fijo sin cálculo alguno.
3. Un subtítulo hardcodeado "1 Aprobada · 1 Enviada" en la tarjeta "Cotizaciones Creadas" que no era fiel a los datos de muestra reales (`sampleQuotes` solo contiene una cotización `approved`, ninguna `sent`).

Este documento describe la limpieza aplicada, exclusivamente en `src/App.tsx`, sin tocar ningún otro archivo, pestaña o componente.

---

## 2. Cambios Implementados

### 2.1 Eliminación del badge "Consultorio Activo"
Se eliminó el `<div className="flex items-center gap-2">` contenedor completo (incluyendo el `<span>` del badge con el punto animado `animate-pulse` y el texto "Consultorio Activo") de la sección "Header Banner & Section Title". No quedó ningún `<div>` vacío tras la eliminación.

### 2.2 Eliminación del indicador de tendencia "+12% este mes"
Se eliminó el bloque `<div className="flex items-center gap-1 text-emerald-400 ...">` (con el ícono `TrendingUp` y el texto "+12% este mes") de la tarjeta "Total Pacientes". Dado que `TrendingUp` no se usaba en ningún otro lugar del archivo, también se eliminó su import de `lucide-react`.

### 2.3 Corrección del subtítulo de "Cotizaciones Creadas"
Se reemplazó el texto fijo `"1 Aprobada · 1 Enviada"` por un cálculo real derivado de `sampleQuotes`:

```typescript
const approvedQuotesCount = sampleQuotes.filter((q) => q.status === "approved").length;
const sentQuotesCount = sampleQuotes.filter((q) => q.status === "sent").length;
```

Y en el JSX, conservando el ícono `Clock` existente:

```tsx
<Clock className="w-3.5 h-3.5 text-amber-400" />
<span>
  {approvedQuotesCount} Aprobada{approvedQuotesCount !== 1 ? "s" : ""} ·{" "}
  {sentQuotesCount} Enviada{sentQuotesCount !== 1 ? "s" : ""}
</span>
```

Con los datos de muestra actuales (`sampleQuotes` con una cotización `approved` y cero `sent`), el subtítulo renderiza **"1 Aprobada · 0 Enviadas"**, cumpliendo AC-3 exactamente.

---

## 3. Verificación & Cobertura de Tests (Vitest)

Se creó `src/App.test.tsx` con las 3 pruebas requeridas por el issue:

1. `test("el dashboard no renderiza el badge Consultorio Activo")`
2. `test("la tarjeta de pacientes no muestra un indicador de tendencia fijo")`
3. `test("el subtítulo de cotizaciones refleja el conteo real por estado desde sampleQuotes")`

Resultado: `npm run test` → **8 archivos de test, 28 pruebas, 100% en verde** (incluye la suite completa preexistente más las 3 nuevas).

---

## 4. Decisiones Autónomas

Ante detalles no especificados explícitamente en el issue, se tomaron las siguientes decisiones:

1. **Ubicación de las constantes derivadas**: `approvedQuotesCount` y `sentQuotesCount` se declararon inmediatamente después del array `sampleQuotes` (antes de `sampleAccounting`), manteniendo la cercanía semántica con los datos de los que dependen.

2. **Estrategia de mocking en `App.test.tsx`**: `App.tsx` consume `useAuth()` y `useTheme()` directamente (a diferencia de `ProtectedRoute.test.tsx`, que recibe `user`/`isLoading` como props). Como `useAuth` invoca a `authService.onAuthStateChanged`, que depende de Firebase real (`src/config/firebase.ts`, sin mocks globales en `src/test/setup.ts`), se optó por mockear los módulos `./hooks/useAuth` y `./hooks/useTheme` completos vía `vi.mock(...)`, simulando un usuario autenticado con `hasCompletedOnboarding: true`. Esto evita cualquier dependencia de red/Firebase en el test y permite que `ProtectedRoute` renderice el dashboard directamente.

3. **Formato de pluralización**: se usó el patrón `{count} Aprobada{count !== 1 ? "s" : ""}` para pluralizar dinámicamente "Aprobada"/"Aprobadas" y "Enviada"/"Enviadas" según el conteo real, siguiendo el ejemplo de JSX sugerido en el issue.

4. **No se modificó** ningún color, otra pestaña (patients/quotes/schedule/accounting/settings), `HeaderNav.tsx` ni `SidebarNav.tsx`, conforme al alcance estricto del issue.

---

## 5. Criterios de Aceptación Cumplidos (Definition of Done)

- [x] AC-1: El dashboard renderizado ya no contiene el badge "Consultorio Activo".
- [x] AC-2: La tarjeta "Total Pacientes" ya no muestra ningún indicador de tendencia porcentual fijo.
- [x] AC-3: Con `sampleQuotes` (1 `approved`, 0 `sent`), el subtítulo de "Cotizaciones Creadas" muestra "1 Aprobada · 0 Enviadas".
- [x] `npx tsc -b` → 0 errores.
- [x] `npm run test` → 28/28 pruebas en verde.
- [x] `npm run build` → compilación limpia sin advertencias.
- [x] Único archivo de producción modificado: `src/App.tsx`. Archivos nuevos: `src/App.test.tsx`, este SDD.
