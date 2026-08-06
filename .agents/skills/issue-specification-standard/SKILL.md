---
name: issue-specification-standard
description: Estándar de Especificación de Issues Enriquecidos (Atomic Issues, BDD Acceptance Criteria, NFRs, Vitest Specs, Endpoint Isolation, Dependencies y Definition of Done) para el CRM Odontológico.
---

# CRM ODONTÓLOGO - Atomic & Enriched Issue Specification Standard

Esta habilidad define las reglas estrictas para crear y estructurar cada GitHub Issue o User Story en el proyecto. Ningún subagente o desarrollador debe iniciar trabajo sin un Issue que cumpla el **Principio de Granularidad Atómica**, el **Aislamiento de Endpoints** y la **Especificación de 7 Dimensiones**.

---

## ⚛️ 1. Principio de Granularidad Atómica ("Progreso Chico pero Firme")

- **Regla de la Tarea Única (Atomic Task Rule):** Ningún Issue debe requerir la modificación o creación de más de **1 a 3 archivos**.
- **Aislamiento de Endpoints / Servicios Backend:** Si un requerimiento involucra un Endpoint o Método de Servicio (ej. `POST /api/v1/quotes` o `quoteService.createQuote()`), el Issue se enfoca **únicamente en el Endpoint**, su validación de DTOs, mutación de BD y pruebas de servicio. NO debe incluir la UI.
- **Cadena de Dependencias Explícita:** Los Issues de UI declaran explícitamente `Depende de: #XX (Endpoint Backend)`. No se inicia la UI hasta que su Endpoint dependiente esté fusionado en `develop`.

---

## 📐 2. Las 7 Dimensiones Obligatorias de un Issue Enriquecido

Todo Issue debe estructurarse con las siguientes 7 secciones:

### 📌 1. Contexto & Propósito de Negocio (Business Why)
- Razón de ser de la funcionalidad y beneficio para el usuario (Dra. Daniela o Asistente).

### 🔗 2. Dependencias Bloqueantes (Blocking Dependencies)
- Declaración explícita de pre-requisitos: `Depende de: #XX` o `Dependencias: Ninguna (Bloque Base)`.

### 📁 3. Ubicación Exacta de Archivos & Contratos TypeScript (Zero Guessing)
- Rutas explícitas de archivo, DTOs, tipos e interfaces.
  - Ejemplo: `src/services/quoteService.ts`
  - Ejemplo DTO: `CreateQuoteDTO { patientId: string; items: QuoteItemInput[]; total: number; }`

### 🎯 4. Criterios de Aceptación (ACs) en Formato BDD (Given-When-Then)
- Criterios matemáticos sin ambigüedad:
  - **AC-1:** *DADO* que el servicio recibe un DTO válido, *CUANDO* invoca `createQuote(dto)`, *ENTONCES* persiste el documento en `/clinics/{clinicId}/quotes/{quoteId}` y retorna el objeto con su `id` generado.
  - **AC-2:** *DADO* que el `patientId` es nulo o vacío, *CUANDO* se invoca el método, *ENTONCES* lanza una excepción `ValidationError('El ID del paciente es obligatorio')`.

### ⚡ 5. Requisitos No Funcionales (NFRs & Performance)
- Límite de líneas por archivo (máximo 150-200).
- TypeScript estricto sin `any`.
- Respuesta del servicio `<50ms`.

### 🧪 6. Casos de Prueba Unitarios Obligatorios (Vitest Spec)
- Especificación de las pruebas unitarias que deben crearse en Vitest:
  - `test("createQuote debe persistir el presupuesto y retornar el id generado")`
  - `test("createQuote debe lanzar ValidationError si faltan campos obligatorios")`

### ✅ 7. Definición de Terminado (Definition of Done - DoD)
- [ ] `tsc -b` pasa en 0 errores.
- [ ] `npm run test` pasa con 100% de éxito en Vitest.
- [ ] `npm run build` compila de forma limpia en `<4s`.
- [ ] PR abierto a `develop` vinculando `Closes #XX`.
