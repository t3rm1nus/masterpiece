// =============================================
// Slice de idioma y traducciones para Zustand
// Gestiona el idioma y las traducciones de la app de forma centralizada.
// Soporta multilenguaje, alternancia dinámica y actualización de traducciones en caliente.
// Optimizado para UX y performance, y para facilitar la internacionalización.
// =============================================

// Tipos para el slice de idioma
export type LanguageType = 'es' | 'en';

export interface LanguageSlice {
  // Nota: language, translations, setLanguage, toggleLanguage, setTranslations, getTranslation
  // están definidos en el store principal para evitar duplicaciones
  // Este slice solo contiene lógica específica de idioma si es necesaria
}

// Slice de idioma y traducciones para Zustand
export const createLanguageSlice = (set: any, get: any): LanguageSlice => ({
  // Los campos de idioma están definidos en el store principal
  // para evitar duplicaciones y conflictos
}); 