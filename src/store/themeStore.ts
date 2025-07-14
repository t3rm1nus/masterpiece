// =============================================
// Slice de tema visual para Zustand
// Gestiona el tema visual (claro/oscuro) de la app de forma centralizada.
// Permite alternancia dinámica de tema y está optimizado para móviles y desktop.
// Incluye helpers para configuración visual avanzada (badges, SVG, etc.).
// =============================================

// Tipos para el slice de tema
export type ThemeType = 'light' | 'dark';

export interface MasterpieceBadgeConfig {
  color: string;
  icon: string;
  svg: React.SVGProps<SVGSVGElement>;
  circle: React.SVGProps<SVGCircleElement>;
  star: React.SVGProps<SVGPathElement>;
}

export interface ThemeSlice {
  // Estados
  isDarkMode: boolean;
  theme: ThemeType;
  
  // Acciones
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  getMasterpieceBadgeConfig: () => MasterpieceBadgeConfig;
}

export const createThemeSlice = (set: any, get: any): ThemeSlice => ({
  isDarkMode: false,
  theme: 'light',
  toggleTheme: () => set((state: any) => ({
    isDarkMode: !state.isDarkMode,
    theme: state.isDarkMode ? 'light' : 'dark'
  })),
  setTheme: (theme: ThemeType) => set({ theme, isDarkMode: theme === 'dark' }),
  getMasterpieceBadgeConfig: () => ({
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