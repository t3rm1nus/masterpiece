// =============================================
// Slice de idioma y traducciones para Zustand
// Gestiona el idioma y las traducciones de la app de forma centralizada.
// Soporta multilenguaje, alternancia dinámica y actualización de traducciones en caliente.
// Optimizado para UX y performance, y para facilitar la internacionalización.
// =============================================

import { Language } from '../types';

// Slice de idioma y traducciones para Zustand
export const createLanguageSlice = (set: any, get: any) => ({
  language: 'es' as Language,
  translations: {} as Record<string, any>,
  setLanguage: (language: Language): void => set({ language }),
  toggleLanguage: (): void => set((state: any) => ({
    language: state.language === 'es' ? 'en' : 'es'
  })),
  setTranslations: (translations: Record<string, any>): void => {
    set({ translations });
    // Actualizar título cuando se cargan las traducciones
    const state = get();
    if (state.updateTitleForLanguage) state.updateTitleForLanguage();
  },
  getTranslation: (key: string, fallback?: string): string => {
    const translations = get().translations;
    const language = get().language;
    if (!translations || !language) return fallback || key;
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    return value || fallback || key;
  }
});
