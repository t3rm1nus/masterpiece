# Estructura del Proyecto

La aplicación Masterpiece está organizada de forma modular para facilitar la escalabilidad y el mantenimiento. La estructura principal es la siguiente:

- `src/`: Carpeta principal del frontend.
  - `App.jsx`, `main.jsx`: Entradas principales de la app.
  - `components/`: Componentes reutilizables de UI, priorizando Material UI y vistas unificadas.
  - `assets/`: Recursos estáticos (imágenes, SVG, etc).
  - `config/`: Archivos de configuración.
  - `data/`: Datos estáticos o mock data.
  - `hooks/`: Hooks personalizados de React.
  - `pages/`: Vistas o páginas principales de la app.
  - `store/`: Gestión de estado global (Zustand).
  - `styles/`: Archivos de estilos globales o específicos.
  - `utils/`: Funciones utilitarias y helpers.
  - `LanguageContext.jsx`: Contexto para internacionalización o gestión de idioma.

- `public/`: Archivos estáticos, imágenes, íconos, sonidos y manifest para PWA.
- `android/`: Configuración y recursos para empaquetar la app como aplicación móvil Android con Capacitor.
- Archivos raíz: configuración de Vite, ESLint, Capacitor, y otros.

La estructura modular y la consolidación de componentes facilitan el mantenimiento y la evolución del proyecto.
