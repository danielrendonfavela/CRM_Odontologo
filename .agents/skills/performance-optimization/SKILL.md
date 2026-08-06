---
name: performance-optimization
description: Guía de Estándares de Rendimiento Extremo (PWA, Brotli, Cold/Warm Start, O(1), Web Vitals y Optimización de Fotos Clínicas) para el CRM Odontológico.
---

# CRM ODONTÓLOGO - Performance & PWA Guidelines

Esta habilidad impone los estándares de velocidad, respuesta táctil en iPhone/iPad/Desktop y uso eficiente de memoria/red.

---

## ⚡ 1. Métricas Core Web Vitals Obligatorias

- **LCP (Largest Contentful Paint) < 1.0s:** Carga de página inicial ultra rápida mediante Code Splitting (`React.lazy`).
- **INP (Interaction to Next Paint) < 50ms:** Respuesta a clics/toques instantánea usando `useTransition`.
- **CLS (Cumulative Layout Shift) = 0:** Evitar saltos de pantalla definiendo contenedores con `aspect-ratio` y siluetas animadas (Skeleton Loaders).

---

## 📱 2. Configuración PWA (Instalable en iPhone, iPad y Desktop)

- **Standalone Mode:** Metas de Safari (`apple-mobile-web-app-capable: yes`, `viewport-fit=cover`).
- **PWA Manifest (`public/manifest.json`):** Iconos de alta resolución (192px, 512px), color de tema de marca (`theme_color`) y orientación optimizada.
- **Persistencia Offline (Firestore IndexedDB):** Caché en memoria local para funcionamiento ininterrumpido sin internet.

---

## 🖼️ 3. Optimización de Imágenes Médicas (Fotos Clínicas)

- **Compresión en Cliente (WebP/AVIF):** Toda foto tomada con iPhone o cámara se comprime en el navegador a WebP (<200 KB) antes de subir a Cloud Storage.
- **Lazy Loading de Imágenes:** Atributo `loading="lazy"` y `decoding="async"` para galerías de pacientes.

---

## 🧮 4. Estructuras de Datos y Complejidad Algorítmica

- **Acceso O(1):** Organizar colecciones en memoria mediante Mapas Hash / Objetos clave-valor por ID (`patientsMap[patientId]`) en lugar de búsquedas $O(n)$ (`.find()`).
- **Virtual Scrolling:** Renderizar solo los elementos visibles en pantalla para listas largas de pacientes o presupuestos.
- **Compresión HTTP Brotli:** Pre-compresión `.br` en producción de assets JS/CSS.
