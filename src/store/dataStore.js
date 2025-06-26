// Migration helper for persisted state
function migrateDataSliceState(state, version) {
  // Example: migrate from v0 to v1 (add new fields, rename, etc.)
  // if (version === 0) {
  //   return { ...state, newField: defaultValue };
  // }
  return state;
}

// Data slice for Zustand store (NO persist here)
export const createDataSlice = (set, get) => ({
  recommendations: [],
  categories: [],
  filteredItems: [],
  selectedCategory: null,
  activeSubcategory: null,
  title: 'Recomendaciones diarias',
  isDataInitialized: false,
  allData: {},
  updateWithRealData: (realData) => {
    const catSeries = realData.categories?.find(cat => cat.id === 'series');

    // --- CORRECCIÓN: Generar subcategorías únicas de series a partir de los datos reales ---
    let seriesSubcats = [];
    if (realData.allData && Array.isArray(realData.allData.series)) {
      const subcatSet = new Set();
      realData.allData.series.forEach((serie, idx) => {
        if (serie.subcategoria && typeof serie.subcategoria === 'string') {
          serie.subcategoria.split(',').forEach(sub => {
            const cleanSub = sub.trim().toLowerCase();
            if (cleanSub) {
              subcatSet.add(cleanSub);
            }
          });
        }
      });
      seriesSubcats = Array.from(subcatSet).map(sub => ({ sub, label: sub }));
    }
    // --- FIN CORRECCIÓN ---

    // --- CORRECCIÓN: Reemplazar subcategorías de series en las categorías ---
    let categoriesFixed = realData.categories ? realData.categories.map(cat => {
      if (cat.id === 'series') {
        return { ...cat, subcategories: seriesSubcats };
      }
      return cat;
    }) : [];
    // --- FIN CORRECCIÓN ---

    let recommendations14 = realData.recommendations?.slice(0, 14) || [];
    if (recommendations14.length < 14 && realData.allData) {
      const allItems = Object.values(realData.allData).flat();
      const existingIds = new Set(recommendations14.map(item => item.id));
      const candidates = allItems.filter(item => !existingIds.has(item.id));
      for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
      }
      const needed = 14 - recommendations14.length;
      recommendations14 = recommendations14.concat(candidates.slice(0, needed));
    }
    set({
      categories: categoriesFixed,
      recommendations: recommendations14,
      filteredItems: recommendations14,
      allData: realData.allData,
      selectedCategory: null,
      isDataInitialized: true
    });
    const catSeriesAfter = categoriesFixed?.find(cat => cat.id === 'series');
  },
  getRecommendations: () => get().recommendations,
  getCategories: () => {
    const categories = get().categories;
    const translations = get().translations;
    const language = get().language;
    return categories.map(cat => ({
      key: cat.id,
      label: translations?.[language]?.categories?.[cat.id] || cat.name
    }));
  },
  getSubcategoriesForCategory: (categoryId) => {
    const categories = get().categories;
    const category = categories.find(cat => cat.id === categoryId);
    return category?.subcategories || [];
  },
  setCategory: (category) => set({ selectedCategory: category }),
  // Alias de compatibilidad para subcategoría
  activeSubcategory: null,
  setActiveSubcategory: (subcategory) => set({ selectedSubcategory: subcategory, activeSubcategory: subcategory }),
  generateNewRecommendations: () => {
    const { allData } = get();
    if (allData && Object.keys(allData).length > 0) {
      const categories = ['movies', 'books', 'videogames', 'music', 'comics', 'boardgames', 'podcast', 'series', 'documentales'];
      const newRecommendations = [];
      categories.forEach((category, index) => {
        const categoryData = allData[category] || [];
        if (categoryData.length > 0) {
          const itemsToTake = index < 5 ? 2 : 1;
          const selectedItems = categoryData
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.min(itemsToTake, categoryData.length));
          newRecommendations.push(...selectedItems);
        }
      });
      const finalRecommendations = newRecommendations.slice(0, 14);
      set({ 
        recommendations: finalRecommendations,
        filteredItems: finalRecommendations,
        selectedCategory: null,
        selectedSubcategory: null,
        currentView: 'home',
        selectedItem: null
      });
    }
  },
  updateTitleForLanguage: (lang) => {
    const selectedCategory = get().selectedCategory;
    const categories = get().getCategories ? get().getCategories(lang) : [];
    if (selectedCategory && categories.length > 0) {
      const found = categories.find(cat => cat.key === selectedCategory);
      const newTitle = found ? `Masterpiece - ${found.label}` : (get().getDefaultTitle ? get().getDefaultTitle(lang) : 'Masterpiece');
      set({ title: newTitle });
    } else {
      const defaultTitle = get().getDefaultTitle ? get().getDefaultTitle(lang) : 'Masterpiece';
      set({ title: defaultTitle });
    }
  },
  isSpanishCinemaActive: false,
  toggleSpanishCinema: () => set(state => ({ isSpanishCinemaActive: !state.isSpanishCinemaActive })),
  isMasterpieceActive: false,
  toggleMasterpiece: () => set(state => ({ isMasterpieceActive: !state.isMasterpieceActive })),
  activePodcastLanguages: [],
  togglePodcastLanguage: (lang) => set(state => ({
    activePodcastLanguages: state.activePodcastLanguages.includes(lang)
      ? state.activePodcastLanguages.filter(l => l !== lang)
      : [...state.activePodcastLanguages, lang]
  })),
  activeDocumentaryLanguages: [],
  toggleDocumentaryLanguage: (lang) => set(state => ({
    activeDocumentaryLanguages: state.activeDocumentaryLanguages.includes(lang)
      ? state.activeDocumentaryLanguages.filter(l => l !== lang)
      : [...state.activeDocumentaryLanguages, lang]
  })),
  activeLanguage: 'all',
  setActiveLanguage: (lang) => set({ activeLanguage: lang }),
  resetAllFilters: () => set({
    selectedCategory: null,
    activeSubcategory: null,
    selectedSubcategory: null,
    activeLanguage: 'all',
    isSpanishCinemaActive: false,
    isMasterpieceActive: false,
    activePodcastLanguages: [],
    activeDocumentaryLanguages: [],
    searchTerm: '',
    isSearchActive: false,
    filteredItems: [],
    title: 'Recomendaciones diarias',
    selectedItem: null
  }),
  updateFilteredItems: (items) => set({ filteredItems: items }),
});
