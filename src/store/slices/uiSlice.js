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

  performSearch: async (term) => {
    try {
      set({ isSearching: true, error: null });
      
      const state = get();
      const recommendations = state.recommendations || [];
      
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

  // Get filtered recommendations
  getFilteredRecommendations: () => {
    const state = get();
    const { recommendations, selectedCategories, selectedSubcategories, selectedTags } = state;

    if (!recommendations || recommendations.length === 0) {
      return [];
    }

    return recommendations.filter(rec => {
      if (selectedCategories.length > 0) {
        const recCategory = typeof rec.category === 'object' ? rec.category.key : rec.category;
        if (!selectedCategories.includes(recCategory)) return false;
      }

      if (selectedSubcategories.length > 0) {
        const recSubcategory = typeof rec.subcategory === 'object' ? rec.subcategory.key : rec.subcategory;
        if (!selectedSubcategories.includes(recSubcategory)) return false;
      }

      if (selectedTags.length > 0) {
        const recTags = Array.isArray(rec.tags) ? rec.tags.map(tag => typeof tag === 'object' ? tag.key : tag) : [];
        if (!selectedTags.some(tag => recTags.includes(tag))) return false;
      }

      return true;
    });
  },
});