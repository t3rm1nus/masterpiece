# Masterpiece

Aplicación multiplataforma de recomendaciones culturales (películas, cómics, libros, música, videojuegos, juegos de mesa y podcasts), desarrollada con React, Vite, Material UI y Zustand, 100% en TypeScript.

## Características principales
- **Frontend moderno**: React 19 + Vite + TypeScript.
- **UI avanzada**: Material UI (MUI), diseño responsive y soporte PWA/mobile.
- **Gestión de estado**: Zustand, stores centralizados y tipados.
- **Sin legacy**: Todo el código fuente está en TypeScript (.ts/.tsx), sin archivos JS/JSX legacy.
- **Experiencia multiplataforma**: Web, PWA y empaquetado móvil con Capacitor.
- **Internacionalización**: Soporte multilenguaje (es/en).

## Estructura del proyecto
- `src/` - Código fuente principal
  - `components/` - Componentes reutilizables y principales (TypeScript)
  - `store/` - Zustand stores y slices (TypeScript)
  - `hooks/` - Hooks personalizados
  - `data/` - Datos estáticos y mock data
  - `styles/` - Estilos globales y temáticos
  - `utils/` - Utilidades y helpers
  - `LanguageContext.tsx` - Contexto de idioma
- `public/` - Recursos estáticos, imágenes, sonidos, manifest
- `android/` - Empaquetado móvil (Capacitor)

## Instalación y uso
```bash
npm install
npm run dev # Desarrollo
npm run build # Build producción
npm run preview # Previsualización
```

## Stack tecnológico
- React 19, Vite, TypeScript
- Material UI, Emotion
- Zustand
- Capacitor (Android)
- ESLint, @types/*

## Buenas prácticas
- Mantener todo el código en TypeScript
- Documentar hooks y componentes principales
- Añadir pruebas unitarias/end-to-end
- Revisar accesibilidad y performance
- Mantener dependencias actualizadas

## Documentación adicional
- Estructura: `docs/estructura.md`
- Componentes: `docs/componentes.md`
- Estado: `docs/estado.md`
- Arquitectura: `docs/arquitectura.md`
- Dependencias: `docs/dependencias.md`
- Recomendaciones: `docs/recomendaciones.md`

---
Proyecto migrado y mantenido 100% en TypeScript, sin legacy JS/JSX. Para dudas, consulta la documentación en `/docs`. 