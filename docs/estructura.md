# Estructura del Proyecto

La aplicación Masterpiece está organizada de forma modular para facilitar la escalabilidad, el rendimiento y el mantenimiento. La estructura principal es la siguiente:

- `src/`: Carpeta principal del frontend.
  - `App.tsx`, `main.tsx`: Entradas principales de la app.
  - `components/`: Componentes reutilizables de UI, todos basados en Material UI y vistas unificadas, optimizados para móviles y desktop, escritos en TypeScript.
  - `assets/`: Recursos estáticos (imágenes, SVG, etc).
  - `config/`: Archivos de configuración.
  - `data/`: Datos estáticos o mock data, incluyendo sistema chunked para música.
  - `hooks/`: Hooks personalizados de React.
  - `pages/`: Vistas o páginas principales de la app (algunas cargadas con lazy loading).
  - `store/`: Gestión de estado global (Zustand), con slices para navegación, datos, idioma y tema. **Toda la navegación se gestiona por store, no por router tradicional.**
  - `styles/`: Archivos de estilos globales o específicos, con soporte para temas claro/oscuro y responsive.
  - `utils/`: Funciones utilitarias y helpers.
  - `LanguageContext.tsx`: Contexto para internacionalización o gestión de idioma.

- `public/`: Archivos estáticos, imágenes, íconos, sonidos y manifest para PWA.
- `android/`: Configuración y recursos para empaquetar la app como aplicación móvil Android con Capacitor.
- Archivos raíz: configuración de Vite, ESLint, Capacitor, y otros.

La estructura modular, la consolidación de stores y componentes, y la gestión de navegación por store permiten una experiencia optimizada para móviles y desktop, facilitando el mantenimiento y la evolución del proyecto. Todo el código fuente está en TypeScript, sin archivos legacy JS/JSX.
