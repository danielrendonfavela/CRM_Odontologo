# CRM & Plataforma Contable Odontológica

Plataforma SaaS Multi-tenant diseñada para la gestión contable, administración de pacientes y generación de presupuestos personalizados en tiempo real para consultorios odontológicos.

## 🚀 Características Principales

- **Personalizador de Presupuestos (Estilo Canva):** Editor visual en tiempo real para crear cotizaciones con colores, tipografías (Google Fonts), fondos y logos personalizables, con exportación a PDF vectorial.
- **Gestión Contable:** Registro de ingresos, egresos, gastos fijos/variables y reportes financieros del consultorio.
- **CRM de Pacientes:** Expediente de pacientes, historial de presupuestos y catálogo de tratamientos/servicios.
- **Arquitectura Multi-tenant & Roles (RBAC):**
  - **Admin / Dueña (Doctora):** Acceso total a contabilidad, presupuestos y ajustes.
  - **Asistente / Recepcionista:** Gestión de pacientes y creación de borradores de cotizaciones (sin acceso a datos contables confidenciales).

## 🛠️ Stack Tecnológico

- **Frontend:** React + Vite / Next.js
- **Backend & Database:** Firebase (Firestore, Authentication, Storage, Hosting)
- **Generación de PDF:** HTML2PDF / React-PDF
