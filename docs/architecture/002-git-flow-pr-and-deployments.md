# 002 - Git Flow, Pull Requests & Pipelines de Despliegue (UAT & PROD)

## 🌿 Política de Gobernanza de Ramas

- **`develop`**: Integración continua de desarrollo. Protegida contra borrado y force push.
- **`uat`**: Entorno de pruebas de pre-producción (`https://crm-odontologo-uat.web.app`). Protegida.
- **`prod`**: Entorno de producción oficial (`https://crm-odontologo.web.app`). Protegida.
- **`feature/issue-XX-nombre`**: Ramas secundarias atómicas creadas por subagentes para resolver issues individuales.

---

## 🚀 Pipelines de Despliegue Automatizado (GitHub Actions)

### 1. `deploy-uat.yml` (Entorno UAT)
- **Disparador:** Push o merge a la rama `uat`.
- **Acciones:** Executa `npm run test`, realiza el build con variables UAT y despliega mediante `FirebaseExtended/action-hosting-deploy` al target `uat`.

### 2. `deploy-prod.yml` (Entorno Producción)
- **Disparador:** Push o merge a la rama `prod`.
- **Acciones:** Ejecuta `npm run test`, realiza el build con variables de Producción y despliega al target `prod`.
