// =============================================
// Navigation slice para Zustand
// Contiene estado y acciones para la navegación de vistas y selección de ítems.
// - currentView: vista actual ('home', 'detail', etc.)
// - selectedItem: ítem seleccionado
// - goHome, resetToHome, setView, setSelectedItem, goToDetail, goToHome, goToCoffee, goToHowToDownload: acciones de navegación
// =============================================

// Navigation slice for Zustand
export const createNavigationSlice = (set, get) => ({
  currentView: 'home',
  selectedItem: null,
  goHome: () => {
    set({ 
      currentView: 'home',
      selectedItem: null,
      selectedCategory: null, // CRÍTICO: null para mostrar todas las recomendaciones
      selectedSubcategory: null
    });
  },
  resetToHome: () => set({ 
    currentView: 'home', 
    selectedItem: null, 
    selectedCategory: null, // CRÍTICO: null para mostrar todas las recomendaciones
    selectedSubcategory: null
  }),
  setView: (view) => set({ currentView: view }),
  setSelectedItem: (item) => set({ selectedItem: item }),
  goToDetail: (item) => {
    console.log('[DEBUG][navigationStore] goToDetail llamado con item:', item);
    set({ currentView: 'detail', selectedItem: item });
    setTimeout(() => {
      console.log('[DEBUG][navigationStore] Estado tras goToDetail:', get());
    }, 0);
  },
  goToHome: () => set({ currentView: 'home', selectedItem: null }),
  goToCoffee: () => set({ currentView: 'coffee' }),
  goToHowToDownload: () => {
    console.log('goToHowToDownload ejecutado');
    set({ currentView: 'howToDownload' });
  },
});
