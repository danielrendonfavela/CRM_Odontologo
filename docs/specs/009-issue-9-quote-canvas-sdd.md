# SDD - Issue #9: Componente Canvas de Cotización (Canva Style)

## 📌 Contexto & Propósito de Negocio
Especificación de diseño e implementación técnica para el componente `QuoteCanvas` (`src/features/quotes/components/QuoteCanvas.tsx`). Este componente proporciona el lienzo de cotización estilo Canva para el consultorio de la Dra. Daniela Cázares (Prostodoncia Avanzada).

---

## 🏗️ Decisiones de Arquitectura & Diseño
1. **Lienzo Proporcional A4 (`max-w-[210mm] min-h-[297mm]`):**
   - Garantiza fidelidad en pantalla y renderizado preciso listo para impresión / exportación a PDF sin desbordamiento.
2. **Branding Personalizado Dra. Daniela Cázares:**
   - Encabezado con monograma circular dorado "DC" (`#D8C593`), Cédula profesional, teléfono y correo electrónico.
   - Subtítulo "Prostodoncia Avanzada" con tipografía serif sofisticada.
3. **Tabla Champagne con Bordes limpios:**
   - Cabecera en color champagne `#D8C593` con bordes oscuros definidos (`border-stone-800`).
   - Columnas: Tratamiento/Descripción, Diente, Precio Unitario, Cantidad, Descuento y Total.
4. **Cálculo Autónomo de Resumen Monetario:**
   - Integración directa con `formatMXN` para desplegar Subtotal, Descuentos globales y Total final en moneda mexicana.
5. **Pie Decorativo:**
   - Barra inferior decorativa con color de acento y leyenda de validez de 30 días.

---

## 📁 Archivos Creados
- `src/features/quotes/components/QuoteCanvas.tsx` (Lienzo visual A4, 148 líneas).
- `src/features/quotes/components/QuoteCanvas.test.tsx` (Pruebas unitarias con Vitest + React Testing Library).
- `docs/specs/009-issue-9-quote-canvas-sdd.md` (Este documento).

---

## 🧪 Cobertura de Pruebas Unitarias
- `test("QuoteCanvas debe renderizar los datos del médico y el monograma correctamente")`: Verifica nombre, cédula, subtítulo y monograma.
- `test("QuoteCanvas debe renderizar las filas de la tabla de tratamientos recibidas en la prop items")`: Verifica listado de items, tratamientos y número de diente.

---

## ✅ Cumplimiento de DoD
- [x] `tsc -b` en 0 errores.
- [x] `npm run test` pasa al 100% (5 de 5 pruebas en verde).
- [x] `npm run build` compila limpiamente sin advertencias.
- [x] PR abierto a `develop` vinculando `Closes #9`.
