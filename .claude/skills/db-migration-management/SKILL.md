---
name: db-migration-management
description: Guía de Versionado de Esquemas, Migraciones en Lectura (Lazy Migrations) y Scripts de Lotes para Firestore en el CRM Odontológico.
---

# CRM ODONTÓLOGO - Database Migration Management Standard

Esta habilidad define cómo manejar cambios de modelo de datos, versionado de documentos y migraciones transparentes en Firestore sin romper datos de producción.

---

## 📐 1. Versionado de Documentos (`schemaVersion`)

Todo documento guardado en Firestore (`patients`, `quotes`, `accounting`, `clinics`) DEBE incluir la propiedad `schemaVersion` en la raíz del documento:

```json
{
  "id": "pat_123",
  "name": "Juan Pérez",
  "schemaVersion": 1,
  "createdAt": "2026-08-06T00:00:00Z"
}
```

---

## 🔄 2. Estrategia de Migración Transparente en Lectura (Lazy Migration)

Cuando se actualiza el esquema de datos (ej. Versión 2 agregando el objeto `billingData` a los pacientes), el servicio correspondiente (`patientService.ts`) debe aplicar la migración en memoria antes de retornar los datos a la vista:

```typescript
export const CURRENT_PATIENT_SCHEMA_VERSION = 2;

export function migratePatientDocument(doc: any): Patient {
  let migrated = { ...doc };

  if (!migrated.schemaVersion || migrated.schemaVersion < 2) {
    migrated.billingData = migrated.billingData || { rfc: '', taxSystem: 'EXENTO' };
    migrated.schemaVersion = 2;
  }

  return migrated as Patient;
}
```

---

## 🛠️ 3. Scripts de Migración en Lotes (Batch Migration)

Para cambios estructurales masivos en la base de datos, se debe crear un script en `scripts/migrations/vX_description.js` utilizando Firebase Admin SDK / Batch Writes:

- Máximo 500 operaciones por lote (`writeBatch`).
- Registro de logs en `migration_history`.
- Invariante de idempotencia: el script debe poder ejecutarse múltiples veces sin duplicar datos ni alterar documentos ya migrados.
