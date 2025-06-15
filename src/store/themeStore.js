import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Store consolidado para tema y estilos
const useThemeStore = create(
  devtools(
    (set, get) => ({      // ==========================================
      // ESTADO DE TEMA
      // ==========================================
      theme: 'light', // 'light' o 'dark'
      isDarkTheme: false, // Computed property basada en theme
      fontSize: 'normal', // 'small', 'normal', 'large'
      animations: true, // Habilitar/deshabilitar animaciones
      
      // ==========================================
      // CONFIGURACIÓN DE ESTILOS
      // ==========================================
      
      // Configuración de estilos de botones especiales
      specialButtonLabels: {
        spanishCinema: {
          es: 'Cine Español',
          en: 'Spanish Cinema'
        },
        masterpiece: {
          es: 'Obras Maestras',
          en: 'Masterpieces'
        }
      },      // Configuración de badges y elementos SVG
      masterpieceBadge: {
        svg: {
          width: "28",
          height: "28",
          viewBox: "0 0 28 28",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        },
        circle: {
          cx: "14",
          cy: "14", 
          r: "14",
          fill: "#ffd700"
        },
        star: {
          d: "M14 4l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z",
          fill: "#fff"
        },
        text: {
          x: "14",
          y: "18",
          textAnchor: "middle",
          fontSize: "12",
          fontWeight: "bold",
          fill: "#fff",
          content: "★"
        }
      },

      // Configuración de layouts
      layouts: {
        mobileHome: {
          imageSize: { width: 80, height: 110 },
          desktopImageSize: { width: 120, height: 170 }
        }      },

      // ==========================================
      // ACCIONES DE TEMA
      // ==========================================
      setTheme: (theme) => {
        const isDarkTheme = theme === 'dark';
        set({ theme, isDarkTheme }, false, 'setTheme');
        // Aplicar clase al elemento HTML para cambios globales de CSS
        document.documentElement.setAttribute('data-theme', theme);
      },
        toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        const isDarkTheme = newTheme === 'dark';
        set({ theme: newTheme, isDarkTheme }, false, 'toggleTheme');
        document.documentElement.setAttribute('data-theme', newTheme);
      },
      
      setFontSize: (fontSize) => {
        set({ fontSize }, false, 'setFontSize');
        // Aplicar clase al elemento HTML para cambios globales de tamaño de fuente
        document.documentElement.setAttribute('data-font-size', fontSize);
      },
      
      toggleAnimations: () => {
        const currentAnimations = get().animations;
        set({ animations: !currentAnimations }, false, 'toggleAnimations');
        document.documentElement.setAttribute('data-animations', !currentAnimations);
      },

      // ==========================================
      // GETTERS DE ESTILOS
      // ==========================================
      
      // Obtener etiquetas de botones especiales
      getSpecialButtonLabel: (type, lang) => {
        const { specialButtonLabels } = get();
        return specialButtonLabels[type] ? specialButtonLabels[type][lang] : '';
      },      // Obtener configuración de badge
      getMasterpieceBadgeConfig: () => {
        return get().masterpieceBadge;
      },
        // Método de inicialización para configurar el tema basado en preferencias del sistema
      initializeTheme: () => {
        // Detectar preferencia de color del sistema
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDarkMode ? 'dark' : 'light';
        const isDarkTheme = initialTheme === 'dark';
        
        set({ theme: initialTheme, isDarkTheme }, false, 'initializeTheme');
        document.documentElement.setAttribute('data-theme', initialTheme);
        
        // Escuchar cambios en la preferencia del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          const newTheme = e.matches ? 'dark' : 'light';
          const isDarkTheme = newTheme === 'dark';
          set({ theme: newTheme, isDarkTheme }, false, 'systemThemeChange');
          document.documentElement.setAttribute('data-theme', newTheme);
        });
      }
    }),
    { name: 'theme-store' }
  )
);

// Inicializar el tema al importar el store
useThemeStore.getState().initializeTheme();

export default useThemeStore;
