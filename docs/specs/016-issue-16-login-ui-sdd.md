# Software Design Document (SDD) - Issue #16: UI de Pantalla de Login Responsiva

## 1. Resumen Ejecutivo
Se implementó el componente de la pantalla visual de inicio de sesión (`LoginView.tsx`) para la plataforma SaaS CRM Odontológico. La interfaz cuenta con una estética moderna en modo oscuro, tarjeta con glassmorphism, soporte para la PWA responsiva en dispositivos móviles y de escritorio, estado de carga deshabilitando doble interacción con spinner animado, alerta flotante elegante en caso de errores de autenticación y cumplimiento total con estándares de accesibilidad (A11y).

## 2. Archivos Creados & Modificados
- `src/features/auth/components/LoginView.tsx` - Componente UI responsivo con Tailwind CSS v4, Glassmorphism, Lucide React icons e inline SVG de Google.
- `src/features/auth/components/LoginView.test.tsx` - Batería de 4 pruebas unitarias con Vitest y React Testing Library.
- `docs/specs/016-issue-16-login-ui-sdd.md` - Este documento de diseño y arquitectura.

## 3. Especificación Técnica & Contratos
- **Interfaz TypeScript:**
```typescript
export interface LoginViewProps {
  onGoogleSignIn: () => void;
  isLoading?: boolean;
  error?: string | null;
}
```

## 4. Decisiones Autónomas de Diseño & UX
1. **Glassmorphism & Fondo Oscuro (`bg-slate-950` / `glass-card`):** Se utilizó la paleta Tailwind `slate` con efectos de resplandor ambiental tenue en cian e índigo para dar una apariencia médica tecnológica de gama alta.
2. **Touch Targets PWA:** El botón de autenticación posee una altura mínima de `44px` (`h-12`) con padding cómodo y bordes redondeados para una experiencia táctil fluida en iPhone/iPad PWA.
3. **Manejo de Alerta de Error Desmitificable:** La alerta de error utiliza `role="alert"` y `aria-live="assertive"`, permitiendo descartar el mensaje mediante un botón de cierre autónomo sin alterar el estado global de props.
4. **Respeto a Límites:** `LoginView.tsx` se mantuvo estrictamente en 92 líneas de código (bien por debajo del límite de 150 líneas).

## 5. Verificación & Calidad
- **TypeScript (`tsc -b`):** 0 errores de compilación.
- **Pruebas Unitarias (`npm run test`):** 4 de 4 casos de prueba pasando al 100%.
- **Compilación de Producción (`npm run build`):** Vite build sin advertencias ni errores.
