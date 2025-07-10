// =============================================
// Slice de idioma y traducciones para Zustand
// Gestiona el idioma y las traducciones de la app de forma centralizada.
// Soporta multilenguaje, alternancia dinámica y actualización de traducciones en caliente.
// Optimizado para UX y performance, y para facilitar la internacionalización.
// =============================================

// Slice de idioma y traducciones para Zustand
export const createLanguageSlice = (set, get) => ({
  language: 'es',
  translations: {},
  setLanguage: (language) => set({ language }),
  toggleLanguage: () => set(state => ({
    language: state.language === 'es' ? 'en' : 'es'
  })),
  setTranslations: (translations) => {
    set({ translations });
    // Actualizar título cuando se cargan las traducciones
    const state = get();
    if (state.updateTitleForLanguage) state.updateTitleForLanguage();
  },
  getTranslation: (key, fallback) => {
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
