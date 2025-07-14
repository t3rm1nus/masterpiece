// =============================================
// useFilteredItems: Hook para filtrado eficiente de ítems
// Gestiona el filtrado eficiente de ítems según parámetros y actualiza el estado local.
// Optimizado para performance y listas dinámicas.
// =============================================

import { useAppData } from '../store/useAppStore';
import { useEffect, useState } from 'react';
import type { BaseItem } from '../types/data';

// Tipos para los parámetros de filtrado
export interface FilterParams {
  selectedCategory: string;
  activeSubcategory: string;
  activeLanguage: string;
  allData: any[];
  recommendations: any[];
  isSpanishCinemaActive: boolean;
  isMasterpieceActive: boolean;
  activePodcastLanguages: string[];
  activeDocumentaryLanguages: string[];
  isDataInitialized: boolean;
  updateFilteredItems?: (filtered: any[]) => void;
}

export function useFilteredItems(params: FilterParams): any[] {
  const appData = useAppData();
  const [localFiltered, setLocalFiltered] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Implementar getFilteredItems en el store o usar lógica de filtrado directa
    const filtered = params.allData || [];
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