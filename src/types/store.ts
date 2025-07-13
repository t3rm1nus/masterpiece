// Tipos para stores de Zustand
import { Item } from './data';
import { Category, Language, Theme } from './index';

// Estado de la aplicación
export interface AppState {
  items: Item[];
  currentCategory: Category;
  currentSubcategory: string;
  isLoading: boolean;
  error: string | null;
  setItems: (items: Item[]) => void;
  setCurrentCategory: (category: Category) => void;
  setCurrentSubcategory: (subcategory: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Estado de navegación
export interface NavigationState {
  currentPage: string;
  history: string[];
  goBack: () => void;
  navigateTo: (page: string) => void;
}

// Estado de idioma
export interface LanguageState {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Estado de tema
export interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Estado de vista
export interface ViewState {
  isMobileMenuOpen: boolean;
  isItemDetailOpen: boolean;
  selectedItem: Item | null;
  toggleMobileMenu: () => void;
  toggleItemDetail: () => void;
  setSelectedItem: (item: Item | null) => void;
}