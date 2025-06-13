import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Store para el estado de UI de la aplicación
const useUIStore = create(
  devtools(
    (set, get) => ({
      // Estado inicial
      isMobile: false,
      mobileMenuOpen: false,
      currentView: 'home', // Vista actual (home, etc.)
      lastCategory: null, // Última categoría visitada
      
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
      }
    }),
    { name: 'ui-store' } // Nombre para DevTools
  )
);

export default useUIStore;
