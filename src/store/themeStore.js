// =============================================
// Slice de tema para Zustand
// Contiene estado y acciones relacionadas con el tema visual de la app.
// - isDarkMode: booleano para modo oscuro
// - theme: 'light' | 'dark'
// - toggleTheme: alterna entre modos
// - setTheme: establece el tema
// - getMasterpieceBadgeConfig: configuración SVG para badge de obra maestra
// =============================================

export const createThemeSlice = (set, get) => ({
  isDarkMode: false,
  theme: 'light',
  toggleTheme: () => set(state => ({
    isDarkMode: !state.isDarkMode,
    theme: state.isDarkMode ? 'light' : 'dark'
  })),
  setTheme: (theme) => set({ theme, isDarkMode: theme === 'dark' }),
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
