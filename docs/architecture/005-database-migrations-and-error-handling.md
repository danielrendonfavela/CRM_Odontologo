# 005 - Administración de BD, Migraciones & Error Handling Enterprise

## 🗄️ 1. Estrategia de Migraciones de Base de Datos

- **Versionado de Documentos:** Todos los documentos en Firestore contienen `schemaVersion`.
- **Lazy Migrations:** Transformación transparente en tiempo de lectura en la capa de servicios (`src/services/`).
- **Batch Migrations:** Scripts de administración en `scripts/migrations/` usando escrituras por lotes de 500 documentos.
- **Indexación Automatizada:** Definición de índices en `firestore.indexes.json`.

---

## 🚨 2. Error Handling & Edge Cases de la Industria

- **Error Boundaries:** React Error Boundaries envuelven los módulos principales para evitar pantallazos negros.
- **Exponential Backoff:** Reintentos automáticos (1s, 2s, 4s) ante cortes de red o latencia.
- **Detector de Navegación Privada (Incógnito):** Fallback a almacenamiento en memoria RAM si `IndexedDB` o `LocalStorage` son bloqueados por el navegador.
- **Observador de Red:** Banner no invasivo de estado de conexión (`online`/`offline`).
