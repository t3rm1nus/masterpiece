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

import type { BaseItem } from '../types/data';

// Tipos para el slice de navegación
export type ViewType = 'home' | 'detail' | 'coffee' | 'howToDownload';

export interface NavigationSlice {
  // Estados
  currentView: ViewType;
  selectedItem: any | null;
  
  // Acciones
  goHome: () => void;
  resetToHome: () => void;
  setView: (view: ViewType) => void;
  setSelectedItem: (item: any | null) => void;
  goToDetail: (item: any) => void;
  goToHome: () => void;
  goToCoffee: () => void;
  goToHowToDownload: () => void;
}

// Navigation slice for Zustand
export const createNavigationSlice = (set: any, get: any): NavigationSlice => ({
  currentView: 'home',
  selectedItem: null,
  goHome: () => {
    set((state: any) => {
      if (state.currentView === 'home' && state.selectedItem === null) {
        return state;
      }
      return { 
        currentView: 'home',
        selectedItem: null
      };
    });
  },
  resetToHome: () => set({ 
    currentView: 'home', 
    selectedItem: null
    // NO resetear selectedCategory ni selectedSubcategory para preservar el estado
  }),
  setView: (view: ViewType) => {
    set((state: any) => {
      if (state.currentView === view) {
        return state;
      }
      return { currentView: view };
    });
  },
  setSelectedItem: (item: any | null) => {
    set((state: any) => {
      if (state.selectedItem === item) {
        return state;
      }
      return { selectedItem: item };
    });
  },
  goToDetail: (item: any) => {
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
      const currentState = get();
      const fromDetail = currentState.currentView === 'detail';
      window.history.pushState({ 
        fromDetail,
        previousPath: window.location.pathname
      }, '', '/donaciones');
    }
  },
  goToHowToDownload: () => {
    set({ currentView: 'howToDownload' });
    // Actualizar la URL para que sea navegable en desktop
    if (typeof window !== 'undefined' && window.history) {
      const currentState = get();
      const fromDetail = currentState.currentView === 'detail';
      window.history.pushState({ 
        fromDetail,
        previousPath: window.location.pathname
      }, '', '/como-descargar');
    }
  },
}); 