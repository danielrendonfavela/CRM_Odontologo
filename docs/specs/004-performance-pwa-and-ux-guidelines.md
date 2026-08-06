# 004 - Performance Extremo, PWA & Guía de UX/UI

## 📱 PWA & Soporte Móvil / Tablet

- **Modo Standalone:** Aplicación instalable en iPhone, iPad, Android y Mac/Windows.
- **Configuración PWA (`public/manifest.json`):** Iconos de alta resolución, modo oscuro (`#0f172a`), `apple-mobile-web-app-capable: yes`, `viewport-fit=cover` para integración completa con el Notch.
- **Persistencia Offline:** Almacenamiento local en IndexedDB para funcionamiento ininterrumpido sin internet.

---

## ⚡ Estándares de Rendimiento

- **Compresión HTTP Brotli:** Pre-compresión `.br` en producción de assets JS/CSS.
- **Compresión de Fotos Clínicas en Cliente:** Conversión previa a WebP (<200KB) antes de subir a Cloud Storage.
- **Core Web Vitals:** LCP < 1.0s, INP < 50ms, CLS = 0.
