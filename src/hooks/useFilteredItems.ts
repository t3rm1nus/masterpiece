// =============================================
// useFilteredItems: Hook para filtrado eficiente de ítems
// Gestiona el filtrado eficiente de ítems según parámetros y actualiza el estado local.
// Optimizado para performance y listas dinámicas.
// =============================================

import { useAppData } from '../store/useAppStore';
import { useEffect, useState } from 'react';
import { Category, Language } from '../types';
import { Item } from '../types/data';

// Tipos para los parámetros de filtrado
type FilterParams = {
  selectedCategory: Category;
  activeSubcategory: string;
  activeLanguage: Language;
  allData: Item[];
  recommendations: Item[];
  isSpanishCinemaActive: boolean;
  isMasterpieceActive: boolean;
  activePodcastLanguages: string[];
  activeDocumentaryLanguages: string[];
  isDataInitialized: boolean;
  updateFilteredItems?: (items: Item[]) => void;
};

export function useFilteredItems(params: FilterParams): Item[] {
  const { getFilteredItems } = useAppData();
  const [localFiltered, setLocalFiltered] = useState<Item[]>([]);

  useEffect(() => {
    const filtered = getFilteredItems(params);
    setLocalFiltered(filtered);
    if (params.updateFilteredItems) {
      params.updateFilteredItems(filtered);
    }
    // eslint-disable-next-line
  }, [
    params.selectedCategory,
    params.activeSubcategory,
    params.activeLanguage,
    params.allData,
    params.recommendations,
    params.isSpanishCinemaActive,
    params.isMasterpieceActive,
    params.activePodcastLanguages,
    params.activeDocumentaryLanguages,
    params.isDataInitialized
  ]);

  return localFiltered;
}
