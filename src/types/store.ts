import type { BaseItem } from './data';
// Tipos para Zustand y el store global
// Ejemplo:
// export interface AppState {
//   language: string;
//   theme: 'light' | 'dark';
// } 

export interface AppState {
  items: BaseItem[];
  currentCategory: string;
  currentSubcategory: string;
  isLoading: boolean;
  error: string | null;
}

export interface NavigationState {
  currentPage: string;
  history: string[];
} 