// =============================================
// Data slice para Zustand
// Gestiona todos los datos principales de la app (recomendaciones, categorías, filtros, etc.)
// Integra datos chunked (por ejemplo, música) para optimizar performance y evitar cuellos de botella en móviles.
// Es la única fuente de datos global y está optimizada para performance y experiencia móvil.
// Incluye helpers para migración, filtrado y actualización dinámica de datos.
// =============================================

import { processTitle, processDescription, randomNotFoundImage } from './utils';
import type { BaseItem } from '../types/data';

// Tipos para el slice de datos
export interface Category {
  id: string;
  name: string;
  subcategories?: Array<{ sub: string; label: string }>;
}

export interface CategoryWithLabel {
  key: string;
  label: string;
}

export interface RealData {
  categories?: Category[];
  recommendations?: any[];
  allData?: Record<string, any[]>;
}

export interface DataSlice {
  // Estados
  recommendations: any[];
  categories: Category[];
  filteredItems: any[];
  selectedCategory: string | null;
  activeSubcategory: string | null;
  selectedSubcategory?: string | null;
  title: string;
  isDataInitialized: boolean;
  allData: Record<string, any[]>;
  mobilePage: number;
  desktopPage: number;
  
  // Funciones
  updateWithRealData: (realData: RealData) => void;
  getRecommendations: () => any[];
  getCategories: () => CategoryWithLabel[];
  getSubcategoriesForCategory: (categoryId: string) => Array<{ sub: string; label: string }>;
  setCategory: (category: string) => void;
  setActiveSubcategory: (subcategory: string) => void;
  generateNewRecommendations: () => void;
  getDefaultTitle: (lang: string) => string;
  updateTitleForLanguage: (lang: string) => void;
  
  // Filtros especiales
  isSpanishCinemaActive: boolean;
  toggleSpanishCinema: () => void;
  setSpanishCinemaActive: (active: boolean) => void;
  isSpanishSeriesActive: boolean;
  toggleSpanishSeries: () => void;
  setSpanishSeriesActive: (active: boolean) => void;
  isMasterpieceActive: boolean;
  toggleMasterpiece: () => void;
  setMasterpieceActive: (active: boolean) => void;
  activePodcastLanguages: string[];
  togglePodcastLanguage: (lang: string) => void;
  activeDocumentaryLanguages: string[];
  toggleDocumentaryLanguage: (lang: string) => void;
  activeLanguage: string;
  setActiveLanguage: (lang: string) => void;
  resetAllFilters: () => void;
  updateFilteredItems: (items: any[]) => void;
  resetPagination: () => void;
  setMobilePage: (page: number) => void;
  setDesktopPage: (page: number) => void;
}

// Migration helper for persisted state
function migrateDataSliceState(state: any, version: number) {
  // Example: migrate from v0 to v1 (add new fields, rename, etc.)
  // if (version === 0) {
  //   return { ...state, newField: defaultValue };
  // }
  return state;
}

// Data slice for Zustand store (NO persist here)
export const createDataSlice = (set: any, get: any): DataSlice => ({
  recommendations: [],
  categories: [],
  filteredItems: [],
  selectedCategory: null,
  activeSubcategory: null,
  selectedSubcategory: null,
  title: 'Recomendaciones diarias',
  isDataInitialized: false,
  allData: {},
  mobilePage: 1,
  desktopPage: 1,
  updateWithRealData: (realData: RealData) => {
    const catSeries = realData.categories?.find((cat: any) => cat.id === 'series');

    // --- CORRECCIÓN: Generar subcategorías únicas de series a partir de los datos reales ---
    let seriesSubcats: Array<{ sub: string; label: string }> = [];
    if (realData.allData && Array.isArray(realData.allData.series)) {
      const subcatSet = new Set<string>();
      realData.allData.series.forEach((serie: any, idx: number) => {
        if (serie.subcategory && typeof serie.subcategory === 'string') {
          serie.subcategory.split(',').forEach((sub: string) => {
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
    let categoriesFixed: Category[] = realData.categories ? realData.categories.map((cat: any) => {
      if (cat.id === 'series') {
        return { ...cat, subcategories: seriesSubcats };
      }
      return cat;
    }) : [];
    // --- FIN CORRECCIÓN ---

    let recommendations14 = realData.recommendations?.slice(0, 14) || [];
    if (recommendations14.length < 14 && realData.allData) {
      const allItems = Object.values(realData.allData).flat();
      const existingIds = new Set(recommendations14.map((item: any) => item.id));
      const candidates = allItems.filter((item: any) => !existingIds.has(item.id));
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
    const catSeriesAfter = categoriesFixed?.find((cat: any) => cat.id === 'series');
  },
  getRecommendations: () => get().recommendations,
  getCategories: () => {
    const categories = get().categories;
    const translations = get().translations;
    const language = get().language;
    return categories.map((cat: Category) => ({
      key: cat.id,
      label: translations?.[language]?.categories?.[cat.id] || cat.name
    }));
  },
  getSubcategoriesForCategory: (categoryId: string) => {
    const categories = get().categories;
    const category = categories.find((cat: any) => cat.id === categoryId);
    return category?.subcategories || [];
  },
  setCategory: (category: string) => set({ selectedCategory: category }),
  // Alias de compatibilidad para subcategoría - eliminado duplicado
  setActiveSubcategory: (subcategory: string) => set({ selectedSubcategory: subcategory, activeSubcategory: subcategory }),
  generateNewRecommendations: () => {
    const { allData } = get();
    if (allData && Object.keys(allData).length > 0) {
      const categories = ['movies', 'books', 'videogames', 'music', 'comics', 'boardgames', 'podcast', 'series', 'documentales'];
      const newRecommendations: any[] = [];
      categories.forEach((category: string, index: number) => {
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
  getDefaultTitle: (lang: string) => {
    const translations = get().translations;
    if (translations && translations[lang]) {
      return translations[lang].app?.title || 'Masterpiece';
    }
    return 'Masterpiece';
  },
  updateTitleForLanguage: (lang: string) => {
    const selectedCategory = get().selectedCategory;
    const categories = get().getCategories ? get().getCategories() : [];
    if (selectedCategory && categories.length > 0) {
      const found = categories.find((cat: CategoryWithLabel) => cat.key === selectedCategory);
      const newTitle = found ? `Masterpiece - ${found.label}` : get().getDefaultTitle(lang);
      set({ title: newTitle });
    } else {
      const defaultTitle = get().getDefaultTitle(lang);
      set({ title: defaultTitle });
    }
  },
  isSpanishCinemaActive: false,
  toggleSpanishCinema: () => set((state: any) => ({ isSpanishCinemaActive: !state.isSpanishCinemaActive })),
  setSpanishCinemaActive: (active: boolean) => set({ isSpanishCinemaActive: active }),
  isSpanishSeriesActive: false,
  toggleSpanishSeries: () => set((state: any) => ({ isSpanishSeriesActive: !state.isSpanishSeriesActive })),
  setSpanishSeriesActive: (active: boolean) => set({ isSpanishSeriesActive: active }),
  isMasterpieceActive: false,
  toggleMasterpiece: () => set((state: any) => ({ isMasterpieceActive: !state.isMasterpieceActive })),
  setMasterpieceActive: (active: boolean) => set({ isMasterpieceActive: active }),
  activePodcastLanguages: [],
  togglePodcastLanguage: (lang: string) => set((state: any) => ({
    activePodcastLanguages: state.activePodcastLanguages.includes(lang)
      ? state.activePodcastLanguages.filter((l: string) => l !== lang)
      : [...state.activePodcastLanguages, lang]
  })),
  activeDocumentaryLanguages: [],
  toggleDocumentaryLanguage: (lang: string) => set((state: any) => ({
    activeDocumentaryLanguages: state.activeDocumentaryLanguages.includes(lang)
      ? state.activeDocumentaryLanguages.filter((l: string) => l !== lang)
      : [...state.activeDocumentaryLanguages, lang]
  })),
  activeLanguage: 'all',
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
  updateFilteredItems: (items: any[]) => set({ filteredItems: items }),
  resetPagination: () => set({
    mobilePage: 1,
    desktopPage: 1,
  }),
  setMobilePage: (page: number) => set({ mobilePage: page }),
  setDesktopPage: (page: number) => set({ desktopPage: page }),
}); 