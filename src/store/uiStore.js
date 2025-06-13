import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Store para el estado de UI de la aplicación
const useUIStore = create(
  devtools(
    (set, get) => ({      // Estado inicial
      isMobile: false,
      mobileMenuOpen: false,
      currentView: 'home', // Vista actual (home, detail, coffee, etc.)
      lastCategory: null, // Última categoría visitada
      
      // Estado para la vista de detalle
      selectedItem: null, // Item seleccionado para mostrar detalles
      previousView: 'home', // Vista anterior para poder volver
      
      // Acciones
      setMobile: (isMobile) => set(
        { isMobile },
        false,
        'setMobile'
      ),
      
      openMobileMenu: () => set(
        { mobileMenuOpen: true },
        false,
        'openMobileMenu'
      ),
      
      closeMobileMenu: () => set(
        { mobileMenuOpen: false },
        false,
        'closeMobileMenu'
      ),
      
      toggleMobileMenu: () => set(
        (state) => ({ mobileMenuOpen: !state.mobileMenuOpen }),
        false,
        'toggleMobileMenu'
      ),
      
      // Navegar a una vista
      navigate: (view) => set(
        { currentView: view },
        false,
        'navigate'
      ),
      
      // Establecer la última categoría visitada
      setLastCategory: (category) => set(
        { lastCategory: category },
        false,
        'setLastCategory'
      ),
      
      // Volver a la vista anterior
      goBack: () => {
        const { lastCategory } = get();
        if (lastCategory) {
          set({ currentView: 'category', lastCategory: null }, false, 'goBack');
        } else {
          set({ currentView: 'home' }, false, 'goBack');
        }
      },
      
      // Navegar a la vista de detalle de un item
      navigateToDetail: (item) => {
        const currentView = get().currentView;
        set(
          { 
            selectedItem: item,
            previousView: currentView,
            currentView: 'detail'
          },
          false,
          'navigateToDetail'
        );
      },
      
      // Volver de la vista de detalle
      goBackFromDetail: () => {
        const previousView = get().previousView;
        set(
          {
            selectedItem: null,
            currentView: previousView,
            previousView: 'home'
          },
          false,
          'goBackFromDetail'
        );
      },
      
      // Navegar a la página de donación
      navigateToCoffee: () => {
        const currentView = get().currentView;
        set(
          {
            previousView: currentView,
            currentView: 'coffee'
          },
          false,
          'navigateToCoffee'
        );
      },
      
      // Volver de la página de donación
      goBackFromCoffee: () => {
        const previousView = get().previousView;
        set(
          {
            currentView: previousView,
            previousView: 'home'
          },
          false,
          'goBackFromCoffee'
        );
      },
    }),
    { name: 'ui-store' } // Nombre para DevTools
  )
);

export default useUIStore;
