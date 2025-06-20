/**
 * Language Slice - Gestión de idioma  
 * Consolidación del languageStore anterior
 */

export const languageSlice = (set, get) => ({
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
   * Cambiar idioma de la aplicación - VERSIÓN SEGURA SIN get()
   */
  setLanguage: (newLang) => {
    const supportedLanguages = ['es', 'en']; // Valores fijos para evitar get()
    
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
   * Toggle entre español e inglés - VERSIÓN SEGURA SIN get()
   */
  toggleLanguage: () => {
    set((state) => ({
      lang: state.lang === 'es' ? 'en' : 'es'
    }));
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
   * ELIMINADAS: getDateFormat con get() - CAUSABA INFINITE LOOPS
   * Los formatos se pueden calcular en los componentes usando el valor lang del selector
   */
  /**
   * ELIMINADAS: getNumberFormat con get() - CAUSABA INFINITE LOOPS
   * Los formatos se pueden calcular en los componentes usando el valor lang del selector
   */

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
