/**
 * Language Slice - Gestión de idioma
 * Consolidación del languageStore anterior
 */

export const createLanguageSlice = (set, get) => ({
  // ==========================================
  // ESTADO DE IDIOMA
  // ==========================================
  
  // Idioma actual
  lang: 'es', // 'es' | 'en'
  
  // Idiomas disponibles
  supportedLanguages: ['es', 'en'],
  
  // ==========================================
  // ACCIONES DE IDIOMA
  // ==========================================
  
  /**
   * Cambiar idioma de la aplicación
   */
  setLanguage: (newLang) => {
    const { supportedLanguages } = get();
    
    if (!supportedLanguages.includes(newLang)) {
      console.warn('[LanguageSlice] Unsupported language:', newLang);
      return;
    }
    
    console.log('[LanguageSlice] Changing language to:', newLang);
    set({ lang: newLang });
    
    // Actualizar título de la página si es necesario
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
    }
  },

  /**
   * Toggle entre español e inglés
   */
  toggleLanguage: () => {
    const { lang } = get();
    const newLang = lang === 'es' ? 'en' : 'es';
    get().setLanguage(newLang);
  },

  // ==========================================
  // UTILIDADES DE TRADUCCIONES
  // ==========================================
  
  /**
   * Obtener traducción para una clave específica
   * Esta función será usada cuando se integre con el contexto de idioma
   */
  getTranslation: (key, fallback = '') => {
    // Por ahora retorna el fallback, se integrará con LanguageContext
    return fallback;
  },

  /**
   * Obtener dirección de texto (LTR/RTL)
   */
  getTextDirection: () => {
    // Todos los idiomas soportados actualmente son LTR
    return 'ltr';
  },

  /**
   * Obtener configuración de formato de fecha por idioma
   */
  getDateFormat: () => {
    const { lang } = get();
    
    const formats = {
      es: {
        short: 'DD/MM/YYYY',
        long: 'DD de MMMM de YYYY',
        locale: 'es-ES'
      },
      en: {
        short: 'MM/DD/YYYY',
        long: 'MMMM DD, YYYY',
        locale: 'en-US'
      }
    };

    return formats[lang] || formats.es;
  },

  /**
   * Obtener configuración de números por idioma
   */
  getNumberFormat: () => {
    const { lang } = get();
    
    const formats = {
      es: {
        decimal: ',',
        thousands: '.',
        locale: 'es-ES'
      },
      en: {
        decimal: '.',
        thousands: ',',
        locale: 'en-US'
      }
    };

    return formats[lang] || formats.es;
  },

  // ==========================================
  // RESETEAR ESTADO
  // ==========================================
  
  /**
   * Resetear slice de idioma al español
   */
  resetLanguage: () => {
    console.log('[LanguageSlice] Resetting language to Spanish');
    set({ lang: 'es' });
  }
});
