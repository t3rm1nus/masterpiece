/**
 * UI SLICE OFICIAL
 * Centraliza la gestión de la interfaz de usuario (búsqueda, vistas, estados de carga, etc).
 * - Todos los estados y funciones de UI deben declararse aquí, no en el store principal.
 * - Usar nombres claros y consistentes para los campos de UI.
 * - Si se agregan nuevos campos globales de UI, documentar aquí y en el store principal.
 */

// =============================================
// SLICE DE UI PRINCIPAL
// Este slice contiene la lógica y estados relacionados con la interfaz de usuario (búsqueda, vistas, etc).
//
// CONVENCIONES:
// - Todos los estados y funciones de UI deben declararse aquí, no en el store principal.
// - Usar nombres claros y consistentes para los campos de UI.
// - Si se agregan nuevos campos globales de UI, documentar aquí y en el store principal.
// =============================================

export const uiSlice = (set, get) => ({
  // Loading state
  isLoading: false,
  error: null,

  // Search state
  searchTerm: '',
  searchResults: [],
  isSearching: false,

  // Filter state
  selectedCategories: [],
  selectedSubcategories: [],
  selectedTags: [],

  // UI actions
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),

  // Search actions
  setSearchTerm: (term) => set({ searchTerm: term }),
  performSearch: async (term, recommendations = []) => {
    try {
      set({ isSearching: true, error: null });
      
      // ARREGLADO: recibir recommendations como parámetro en lugar de usar get()
      
      if (!term.trim()) {
        set({ searchResults: [], isSearching: false });
        return [];
      }

      const results = recommendations.filter(rec => {
        const title = typeof rec.title === 'object' ? rec.title.es || rec.title.en || '' : rec.title || '';
        const description = typeof rec.description === 'object' ? rec.description.es || rec.description.en || '' : rec.description || '';
        
        return (
          title.toLowerCase().includes(term.toLowerCase()) ||
          description.toLowerCase().includes(term.toLowerCase())
        );
      });

      set({ searchResults: results, isSearching: false });
      return results;
    } catch (error) {
      console.error('Search error:', error);
      set({ error: error.message, isSearching: false });
      throw error;
    }
  },

  clearSearch: () => set({ searchTerm: '', searchResults: [], isSearching: false }),

  // Filter actions
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  
  setSelectedSubcategories: (subcategories) => set({ selectedSubcategories: subcategories }),
  
  setSelectedTags: (tags) => set({ selectedTags: tags }),
  
  clearFilters: () => set({
    selectedCategories: [],
    selectedSubcategories: [],
    selectedTags: [],
  }),
  // ELIMINADA: getFilteredRecommendations con get() - CAUSABA INFINITE LOOPS
  // Los filtros se pueden aplicar en los componentes usando los valores del selector
});