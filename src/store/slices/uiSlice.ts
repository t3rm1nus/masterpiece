import { StateCreator } from 'zustand';

export interface UiSlice {
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  searchResults: any[];
  isSearching: boolean;
  selectedCategories: string[];
  selectedSubcategories: string[];
  selectedTags: string[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setSearchTerm: (term: string) => void;
  performSearch: (term: string, recommendations?: any[]) => Promise<any[]>;
  clearSearch: () => void;
  setSelectedCategories: (categories: string[]) => void;
  setSelectedSubcategories: (subcategories: string[]) => void;
  setSelectedTags: (tags: string[]) => void;
  clearFilters: () => void;
}

export const uiSlice: StateCreator<UiSlice> = (set, get) => ({
  isLoading: false,
  error: null,
  searchTerm: '',
  searchResults: [],
  isSearching: false,
  selectedCategories: [],
  selectedSubcategories: [],
  selectedTags: [],
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  setSearchTerm: (term: string) => set({ searchTerm: term }),
  performSearch: async (term: string, recommendations: any[] = []) => {
    try {
      set({ isSearching: true, error: null });
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
    } catch (error: any) {
      console.error('Search error:', error);
      set({ error: error.message, isSearching: false });
      throw error;
    }
  },
  clearSearch: () => set({ searchTerm: '', searchResults: [], isSearching: false }),
  setSelectedCategories: (categories: string[]) => set({ selectedCategories: categories }),
  setSelectedSubcategories: (subcategories: string[]) => set({ selectedSubcategories: subcategories }),
  setSelectedTags: (tags: string[]) => set({ selectedTags: tags }),
  clearFilters: () => set({
    selectedCategories: [],
    selectedSubcategories: [],
    selectedTags: [],
  }),
}); 