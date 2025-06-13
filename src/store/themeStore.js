import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Store para gestionar temas y preferencias visuales
const useThemeStore = create(
  devtools(
    (set, get) => ({
      // Estado inicial
      theme: 'light', // 'light' o 'dark'
      fontSize: 'normal', // 'small', 'normal', 'large'
      animations: true, // Habilitar/deshabilitar animaciones
      
      // Acciones
      setTheme: (theme) => {
        set({ theme }, false, 'setTheme');
        // Aplicar clase al elemento HTML para cambios globales de CSS
        document.documentElement.setAttribute('data-theme', theme);
      },
      
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme }, false, 'toggleTheme');
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
      
      // Método de inicialización para configurar el tema basado en preferencias del sistema
      initializeTheme: () => {
        // Detectar preferencia de color del sistema
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDarkMode ? 'dark' : 'light';
        
        set({ theme: initialTheme }, false, 'initializeTheme');
        document.documentElement.setAttribute('data-theme', initialTheme);
        
        // Escuchar cambios en la preferencia del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          const newTheme = e.matches ? 'dark' : 'light';
          set({ theme: newTheme }, false, 'systemThemeChange');
          document.documentElement.setAttribute('data-theme', newTheme);
        });
      }
    }),
    { name: 'theme-store' } // Nombre para DevTools
  )
);

// Inicializar el tema al importar el store
useThemeStore.getState().initializeTheme();

export default useThemeStore;
