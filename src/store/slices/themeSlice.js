// Static theme configurations - defined outside to prevent infinite loops
const THEME_COLORS = {
  default: {
    light: {
      primary: '#1976d2',
      secondary: '#dc004e',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
    },
    dark: {
      primary: '#90caf9',
      secondary: '#f48fb1',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
    }
  },
  coffee: {
    light: {
      primary: '#6f4e37',
      secondary: '#8b4513',
      background: '#fff8e1',
      surface: '#f3e5ab',
      text: '#3e2723',
    },
    dark: {
      primary: '#d7ccc8',
      secondary: '#bcaaa4',
      background: '#3e2723',
      surface: '#5d4037',
      text: '#ffffff',
    }
  }
};

const MASTERPIECE_BADGE_CONFIG = {
  backgroundColor: '#FFD700',
  color: '#000000', 
  borderColor: '#FFA500',
  svg: {
    width: '16',
    height: '16',
    viewBox: '0 0 16 16',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg'
  },
  circle: {
    cx: '8',
    cy: '8',
    r: '8',
    fill: '#FFD700'
  },
  star: {
    d: 'M8 2l1.5 3h3l-2.5 2 1 3-3-2-3 2 1-3-2.5-2h3z',
    fill: '#000000'
  }
};

export const themeSlice = (set, get) => ({
  theme: 'light',
  isDarkMode: false,
  
  // Cache static values to prevent infinite loops
  _themeColors: THEME_COLORS,
  _masterpieceBadgeConfig: MASTERPIECE_BADGE_CONFIG,  toggleTheme: () => {
    set((state) => {
      const newIsDarkMode = !state.isDarkMode;
      return {
        isDarkMode: newIsDarkMode,
        theme: newIsDarkMode ? 'dark' : 'light'
      };
    });
  },

  setTheme: (newTheme) => {
    set({ theme: newTheme });
  },

  getThemeColors: () => THEME_COLORS,
  
  getMasterpieceBadgeConfig: () => MASTERPIECE_BADGE_CONFIG,

  getSpecialButtonLabel: (category, isActive) => {
    const labels = {
      peliculas: isActive ? 'Solo Español' : 'Español & Internacional',
      podcast: isActive ? 'Solo Español' : 'Español & Inglés',
      documentales: isActive ? 'Solo Español' : 'Español & Inglés',
    };
    return labels[category] || 'Toggle';
  },
});