// =============================================
// Data slice para Zustand
// Gestiona todos los datos principales de la app (recomendaciones, categorías, filtros, etc.)
// Integra datos chunked (por ejemplo, música) para optimizar performance y evitar cuellos de botella en móviles.
// Es la única fuente de datos global y está optimizada para performance y experiencia móvil.
// Incluye helpers para migración, filtrado y actualización dinámica de datos.
// =============================================

import { processTitle, processDescription, randomNotFoundImage } from './utils';
import { Category, Language } from '../types';
import { Item } from '../types/data';

// Migration helper for persisted state
function migrateDataSliceState(state: any, version: number): any {
  // Example: migrate from v0 to v1 (add new fields, rename, etc.)
  // if (version === 0) {
  //   return { ...state, newField: defaultValue };
  // }
  return state;
}

// Data slice for Zustand store (NO persist here)
export const createDataSlice = (set: any, get: any) => ({
  recommendations: [] as Item[],
  categories: [] as any[],
  filteredItems: [] as Item[],
  selectedCategory: null as Category | null,
  activeSubcategory: null as string | null,
  title: 'Recomendaciones diarias',
  isDataInitialized: false,
  allData: {} as Record<string, Item[]>,
  updateWithRealData: (realData: any) => {
    const catSeries = realData.categories?.find(cat => cat.id === 'series');

    // --- CORRECCIÓN: Generar subcategorías únicas de series a partir de los datos reales ---
    let seriesSubcats = [];
    if (realData.allData && Array.isArray(realData.allData.series)) {
      const subcatSet = new Set();
      realData.allData.series.forEach((serie, idx) => {
        if (serie.subcategory && typeof serie.subcategory === 'string') {
          serie.subcategory.split(',').forEach(sub => {
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
  getRecommendations: (): Item[] => get().recommendations,
  getCategories: (): any[] => {
    const categories = get().categories;
    const translations = get().translations;
    const language = get().language;
    return categories.map((cat: any) => ({
      key: cat.id,
      label: translations?.[language]?.categories?.[cat.id] || cat.name
    }));
  },
  getSubcategoriesForCategory: (categoryId: string): any[] => {
    const categories = get().categories;
    const category = categories.find(cat => cat.id === categoryId);
    return category?.subcategories || [];
  },
  setCategory: (category: Category) => set({ selectedCategory: category }),
  // Alias de compatibilidad para subcategoría
  activeSubcategory: null as string | null,
  setActiveSubcategory: (subcategory: string) => set({ selectedSubcategory: subcategory, activeSubcategory: subcategory }),
  generateNewRecommendations: (): void => {
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
        currentView: 'home',
        selectedItem: null
        // NO resetear selectedCategory ni selectedSubcategory para preservar el estado
      });
    }
  },
  updateTitleForLanguage: (lang: Language) => {
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
  toggleSpanishCinema: () => set((state: any) => ({ isSpanishCinemaActive: !state.isSpanishCinemaActive })),
  isMasterpieceActive: false,
  toggleMasterpiece: () => set((state: any) => ({ isMasterpieceActive: !state.isMasterpieceActive })),
  activePodcastLanguages: [] as string[],
  togglePodcastLanguage: (lang: string) => set((state: any) => ({
    activePodcastLanguages: state.activePodcastLanguages.includes(lang)
      ? state.activePodcastLanguages.filter((l: string) => l !== lang)
      : [...state.activePodcastLanguages, lang]
  })),
  activeDocumentaryLanguages: [] as string[],
  toggleDocumentaryLanguage: (lang: string) => set((state: any) => ({
    activeDocumentaryLanguages: state.activeDocumentaryLanguages.includes(lang)
      ? state.activeDocumentaryLanguages.filter((l: string) => l !== lang)
      : [...state.activeDocumentaryLanguages, lang]
  })),
  activeLanguage: 'all' as string,
  setActiveLanguage: (lang: string) => set({ activeLanguage: lang }),
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
  updateFilteredItems: (items: Item[]) => set({ filteredItems: items }),
});
