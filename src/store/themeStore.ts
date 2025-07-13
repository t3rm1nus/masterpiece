// =============================================
// Slice de tema visual para Zustand
// Gestiona el tema visual (claro/oscuro) de la app de forma centralizada.
// Permite alternancia dinámica de tema y está optimizado para móviles y desktop.
// Incluye helpers para configuración visual avanzada (badges, SVG, etc.).
// =============================================

import { Theme } from '../types';

type MasterpieceBadgeConfig = {
  color: string;
  icon: string;
  svg: {
    width: number;
    height: number;
    viewBox: string;
    fill: string;
    xmlns: string;
  };
  circle: {
    cx: number;
    cy: number;
    r: number;
    fill: string;
  };
  star: {
    d: string;
    fill: string;
  };
};

export const createThemeSlice = (set: any, get: any) => ({
  isDarkMode: false,
  theme: 'light' as Theme,
  toggleTheme: (): void => set((state: any) => ({
    isDarkMode: !state.isDarkMode,
    theme: state.isDarkMode ? 'light' : 'dark'
  })),
  setTheme: (theme: Theme): void => set({ theme, isDarkMode: theme === 'dark' }),
  getMasterpieceBadgeConfig: (): MasterpieceBadgeConfig => ({
    color: 'gold',
    icon: '★',
    svg: {
      width: 20,
      height: 20,
      viewBox: "0 0 20 20",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    },
    circle: {
      cx: 10,
      cy: 10,
      r: 10,
      fill: "#FFD700"
    },
    star: {
      d: "M10 15l-5.5 3 1.5-6L0 7l6-.5L10 1l4 5.5L20 7l-6 5 1.5 6z",
      fill: "#FFA500"
    }
  })
});
