// =============================================
// Navigation slice para Zustand
// Gestiona el estado y las acciones de navegación de la app de forma centralizada.
// Toda la navegación (home, detalle, donaciones, etc.) se gestiona por store global, no por router tradicional.
// Compatible y optimizado para móviles y desktop, soportando overlays y transiciones modernas.
//
// Estado principal:
// - currentView: vista actual ('home', 'detail', 'coffee', 'howToDownload', etc.)
// - selectedItem: ítem seleccionado para detalle
// Acciones principales:
// - goHome, resetToHome, setView, setSelectedItem, goToDetail, goToHome, goToCoffee, goToHowToDownload
// =============================================

// Navigation slice for Zustand
export const createNavigationSlice = (set, get) => ({
  currentView: 'home',
  selectedItem: null,
  goHome: () => {
    set({ 
      currentView: 'home',
      selectedItem: null
      // NO resetear selectedCategory ni selectedSubcategory para preservar el estado
    });
  },
  resetToHome: () => set({ 
    currentView: 'home', 
    selectedItem: null
    // NO resetear selectedCategory ni selectedSubcategory para preservar el estado
  }),
  setView: (view) => set({ currentView: view }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  goToDetail: (item) => {
    set({ currentView: 'detail', selectedItem: item });
    // Actualizar la URL para que sea navegable
    if (typeof window !== 'undefined' && window.history && item?.id && item?.category) {
      const url = `/detalle/${item.category}/${item.id}`;
      window.history.pushState({ itemId: item.id }, '', url);
    }
  },
  goToHome: () => set({ currentView: 'home', selectedItem: null }),
  goToCoffee: () => {
    set({ currentView: 'coffee' });
    // Actualizar la URL para que sea navegable en desktop
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', '/donaciones');
    }
  },
  goToHowToDownload: () => {
    set({ currentView: 'howToDownload' });
    // Actualizar la URL para que sea navegable en desktop
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', '/como-descargar');
    }
  },
});
