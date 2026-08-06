# SDD: Servicio de Autenticación Google OAuth 2.0 (Issue #17)

## 1. Resumen Ejecutivo
Implementación del servicio de autenticación desacoplado `authService.ts` para el CRM Odontológico utilizando el SDK de Firebase Auth. El servicio encapsula las llamadas a Google OAuth 2.0 (`signInWithPopup`), gestión del estado de sesión (`onAuthStateChanged`), cierre de sesión (`signOut`) y consulta de usuario actual (`getCurrentUser`), previniendo el acoplamiento directo entre los componentes UI y Firebase SDK.

## 2. Ubicación de Archivos Creados
- `src/services/authService.ts` (Servicio desacoplado con interfaces `AuthUser` y `AuthService`).
- `src/services/authService.test.ts` (Batería de 4 pruebas unitarias con Vitest).
- `docs/specs/017-issue-17-auth-service-sdd.md` (Especificación y Registro de Diseño del Software).

## 3. Interfaces y Contrato TypeScript
```typescript
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthService {
  signInWithGoogle(): Promise<AuthUser>;
  signOut(): Promise<void>;
  getCurrentUser(): AuthUser | null;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
}
```

## 4. Decisiones Autónomas Tomadas
1. **Desacoplamiento Estricto de Tipos:** Se implementó una función pura interna `mapFirebaseUser` para mapear el objeto `User` de Firebase a la interfaz liviana y pura `AuthUser`. Esto garantiza que los componentes UI consuman únicamente tipos independientes de la infraestructura.
2. **Manejo Amigable de Excepciones de Popup:** Se capturó específicamente la excepción `auth/popup-closed-by-user` arrojada al cerrar el popup de inicio de sesión de Google, re-lanzando una excepción amigable con el mensaje `"Autenticación cancelada por el usuario"`.
3. **Suscripción Reactiva a Cambios de Sesión:** `onAuthStateChanged` abstrae el listener de Firebase `firebaseOnAuthStateChanged`, facilitando la integración limpia con custom hooks de React como `useAuth`.

## 5. Verificación de Calidad
- **TypeScript:** `tsc -b` verificado con 0 errores.
- **Vitest Unit Tests:** 4/4 casos de prueba obligatorios pasando al 100%.
- **Vite Build:** Compilación limpia para producción finalizada exitosamente.
