---
name: clean-ui-architecture
description: Guía de Arquitectura Limpia (Clean Architecture), Capa de Servicios (Repository Pattern), Sistema de Diseño UI y Estándares de UX/UI para el CRM Odontológico.
---

# CRM ODONTÓLOGO - Clean Architecture & UX/UI Guidelines

Esta habilidad define los patrones de diseño frontend, desacoplamiento de servicios y estándares de experiencia de usuario (UX/UI) para la plataforma.

---

## 🏛️ 1. Arquitectura Limpia (Clean Architecture)

### Regla de Oro: Desacoplamiento de Vista e Infraestructura
Ningún componente de React (`src/components/` o `src/features/`) debe importar o ejecutar llamadas directas al SDK de Firebase (`getDoc`, `collection`, `signInWithEmailAndPassword`).

### Flujo de Capas Obligatorio:
1. **Vista (React Component):** Renderiza JSX y maneja eventos de UI.
2. **Custom Hook de Dominio (`src/hooks/` o `src/features/*/hooks`):** Maneja el estado local (`loading`, `error`, `data`).
3. **Capa de Servicios (`src/services/`):** Implementa el patrón Repository/CoreService. Retorna promesas de TypeScript puras.
4. **Infraestructura (`src/config/firebase.ts`):** Clientes de SDK y red.

```text
src/
  ├── components/ui/       # Átomos reutilizables puros (Button, Input, Modal, Card)
  ├── features/            # Dominios de negocio aislados
  │     ├── quotes/             # Editor Canva, PDF, Cotizaciones
  │     ├── patients/           # Expedientes, Galería de Antes/Después
  │     ├── accounting/         # Ingresos, Egresos, Utilidades
  │     └── settings/           # Marca y plantillas
  ├── services/            # Core Services / Repositorios desacoplados
  │     ├── authService.ts
  │     ├── patientService.ts
  │     ├── quoteService.ts
  │     ├── storageService.ts   # Manejo de imágenes (Antes/Después) y PDFs
  │     └── accountingService.ts
  ├── types/               # Modelos e Interfaces de TypeScript
  └── utils/               # Funciones puras
```

---

## 🎨 2. Estándares de UX/UI e Interacción

### Sensación Premium (Rich Aesthetics)
- **Sistema de Color HSL:** Colores tailoreados (pizarra médica, dorado champagne para cotizaciones, acentos de estado).
- **Feedback Inmediato & Skeleton Loaders:** Sin pantallas en blanco ni cargadores repentinos. Usar estados de carga optimistas.
- **Micro-interacciones:** Transiciones suaves (`duration-200 ease-in-out`), modales fluidos y hover states claros.

### Accesibilidad & Eficiencia en Consultorio
- **Atajos de Teclado:** Permitir llenar tablas y navegar por campos usando `Tab` y `Enter`.
- **Visor Clínico (Antes / Después):** Interfaz táctil adaptada para iPads y monitores del consultorio con slider comparativo de fotografías de tratamientos.
- **WYSIWYG (What You See Is What You Get):** Previsualización en vivo 100% idéntica al PDF final exportado.
