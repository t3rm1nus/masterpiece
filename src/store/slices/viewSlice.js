export const viewSlice = (set, get) => ({
  // Viewport state
  isMobile: typeof window !== 'undefined' ? window.innerWidth <= 768 : false,
  isTablet: typeof window !== 'undefined' ? window.innerWidth > 768 && window.innerWidth <= 1024 : false,
  isDesktop: typeof window !== 'undefined' ? window.innerWidth > 1024 : true,
  currentView: 'home',

  // Viewport actions
  setViewport: (width) => {
    set({
      isMobile: width <= 768,
      isTablet: width > 768 && width <= 1024,
      isDesktop: width > 1024,
    });
  },

  setCurrentView: (view) => set({ currentView: view }),

  // Navigation actions
  navigateToDetail: (id) => {
    set({ currentView: 'detail', selectedRecommendationId: id });
  },

  navigateToHome: () => {
    set({ currentView: 'home', selectedRecommendationId: null });
  },

  // Responsive styles
  getResponsiveStyles: () => {
    const state = get();
    if (state.isMobile) return state.mobileStyles;
    if (state.isTablet) return state.tabletStyles;
    return state.desktopStyles;
  },

  // Style configurations
  mobileStyles: {
    container: 'px-4 py-2',
    grid: 'grid-cols-1 gap-4',
    card: 'p-4 rounded-lg shadow-md',
    text: 'text-sm',
  },

  tabletStyles: {
    container: 'px-6 py-4',
    grid: 'grid-cols-2 gap-6',
    card: 'p-6 rounded-lg shadow-lg',
    text: 'text-base',
  },

  desktopStyles: {
    container: 'px-8 py-6',
    grid: 'grid-cols-3 gap-8',
    card: 'p-8 rounded-lg shadow-xl',
    text: 'text-lg',
  },

  // Mobile home specific styles
  mobileHomeStyles: {
    container: 'px-4 py-2 min-h-screen',
    grid: 'grid-cols-1 gap-4',
    card: 'p-4 rounded-lg shadow-md bg-white',
    text: 'text-sm',
    header: 'text-xl font-bold mb-4',
    button: 'px-4 py-2 rounded-md text-sm',
  },

  // Get recommendation card classes
  getRecommendationCardClasses: () => {
    const state = get();
    const baseClasses = 'recommendation-card transition-all duration-300 hover:shadow-lg cursor-pointer border border-gray-200 rounded-lg overflow-hidden';
    
    if (state.isMobile) {
      return `${baseClasses} mb-4 mx-2`;
    } else if (state.isTablet) {
      return `${baseClasses} mb-6`;
    } else {
      return `${baseClasses} mb-8 hover:scale-105`;
    }
  },
});