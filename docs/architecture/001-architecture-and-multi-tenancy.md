# 001 - Especificación Arquitectónica & Modelo Multi-tenant (SaaS)

## 📌 Resumen de Arquitectura

El **CRM Odontológico** está diseñado como una plataforma SaaS Multi-tenant escalable sobre React 18, Vite 6, TypeScript 5, Tailwind CSS v4 y Google Firebase.

---

## 🏛️ Capa de Servicios & Clean Architecture (CoreService Pattern)

La arquitectura desacopla totalmente la vista de la infraestructura mediante la capa de servicios (`src/services/`):

1. **Vistas & Componentes (`src/components/ui/` & `src/features/`):** Componentes puros de presentación.
2. **Custom Hooks (`src/hooks/` & `src/features/*/hooks/`):** Gestión de estado reactivo y llamadas a servicios.
3. **Capa de Servicios (`src/services/`):**
   - `authService.ts`: Autenticación con Google OAuth 2.0 (Firebase Auth SDK).
   - `patientService.ts`: CRUD de pacientes e historial clínico en Firestore.
   - `quoteService.ts`: Motor de presupuestos y almacenamiento de cotizaciones.
   - `storageService.ts`: Manejo de imágenes clínicas y PDFs en Cloud Storage.
   - `accountingService.ts`: Registro de ingresos, egresos y utilidades.

---

## 🏢 Modelo de Datos Multi-tenant & Roles (RBAC)

### Colección Raíz: `/clinics/{clinicId}`
Cada consultorio opera en una partición aislada bajo Firestore:

- `/clinics/{clinicId}/patients/{patientId}`
- `/clinics/{clinicId}/quotes/{quoteId}`
- `/clinics/{clinicId}/accounting/{recordId}`
- `/clinics/{clinicId}/users/{userId}`

### Matriz de Roles (RBAC):
- **Admin / Dueña (Doctora):** Acceso total a contabilidad, configuración de plantillas, presupuestos y pacientes.
- **Asistente / Recepcionista:** Acceso limitado a agenda, pacientes y creación de borradores de cotizaciones. Acceso restringido a reportes contables.
