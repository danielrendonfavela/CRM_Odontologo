# Software Design Document (SDD) - Issue #19: Detección de Modo Incógnito & Fallback RAM

## 1. Contexto & Propósito
En navegadores web modernos (Chrome, Safari, Firefox, Edge), el modo de navegación privada / incógnito puede restringir o provocar excepciones (SecurityError, QuotaExceededError) al acceder a IndexedDB o LocalStorage. Para prevenir fallos fatales de ejecución y garantizar una experiencia fluida al usuario sin pérdida de interacción, se ha diseñado e implementado un servicio unificado de almacenamiento storageService con fallback transparente en memoria RAM.

## 2. Arquitectura & Componentes Creados

### 2.1 src/services/storageService.ts
- **Interfaz StorageService**: Define el contrato asíncrono (isPrivateMode, setItem, getItem, 
emoveItem, clear).
- **Detección Dinámica de Modo Privado**: Evalúa de manera no bloqueante el soporte y restricciones de IndexedDB y localStorage.
- **Estrategia Fallback RAM**: Mantiene una estructura Map<string, string> en memoria para capturar y servir datos temporalmente en caso de restricciones o excepciones.
- **Cache de Estado**: Almacena en memoria el resultado de la detección para no re-ejecutar verificaciones en llamadas subsecuentes.
- **Límite NFR**: Mantenido estrictamente en 120 líneas de código.

### 2.2 src/components/IncognitoBanner.tsx
- Componente flotante tenue y elegante (glassmorphism) que se renderiza automáticamente en la esquina inferior del Dashboard cuando se detecta modo de navegación privada.
- Informa al usuario que los datos y borradores se mantendrán en memoria RAM y no persistirán al cerrar la ventana.
- Incluye botón de descarte manual para mantener la interfaz limpia.

### 2.3 src/services/storageService.test.ts
- Batería de 5 pruebas unitarias con Vitest:
  1. isPrivateMode retorna 	rue ante SecurityError en IndexedDB.open.
  2. isPrivateMode retorna alse cuando IndexedDB y localStorage están operativos.
  3. setItem conmuta automáticamente a fallback RAM ante QuotaExceededError en localStorage.
  4. Operación persistente normal de setItem y getItem en localStorage.
  5. 
emoveItem y clear resetean tanto RAM como localStorage.

## 3. Decisiones Autónomas de Diseño
1. **Detección Doble (IndexedDB + LocalStorage)**: Se combinó el testeo de apertura de IndexedDB con la prueba de escritura temporal en LocalStorage para máxima compatibilidad cross-browser (Safari iOS vs Chrome Desktop).
2. **Aislamiento en Componente Reutilizable**: En lugar de inflar App.tsx, la alerta flotante de modo privado se encapsuló en IncognitoBanner.tsx respondiendo a los principios de SRP (Single Responsibility Principle) de AGENTS.md.
3. **Resiliency & Zero Crash**: Toda llamada a la API nativa de almacenamiento web está resguardada en bloques 	ry/catch que redireccionan silenciosamente el flujo a la memoria RAM ante cualquier fallo.

## 4. Verificación & DoD
- **TypeScript**: 	sc -b completado en 0 errores.
- **Vitest Unit Tests**: 
pm run test con 100% de éxito (8/8 pruebas totales pasadas).
- **Vite Build**: Compilación limpia en producción (dist/ generado exitosamente).
