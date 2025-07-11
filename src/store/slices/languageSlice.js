/**
 * LANGUAGE SLICE OFICIAL
 * Centraliza la gestión de idioma global y traducciones.
 * - Todos los estados y funciones de idioma deben declararse aquí, no en el store principal.
 * - Usar siempre 'language' como nombre de campo global.
 * - Si se agregan nuevos campos globales de idioma, documentar aquí y en el store principal.
 */

/**
 * Language Slice - Gestión de idioma  
 * Consolidación del languageStore anterior
 */

// =============================================
// SLICE DE IDIOMA PRINCIPAL
// Este slice contiene la lógica y estados relacionados con el idioma y las traducciones.
//
// CONVENCIONES:
// - Todos los estados y funciones de idioma deben declararse aquí, no en el store principal.
// - Usar siempre 'language' como nombre de campo para el idioma global.
// - Si se agregan nuevos campos globales de idioma, documentar aquí y en el store principal.
// =============================================

export const languageSlice = (set, get) => ({
  // ==========================================
  // ESTADO DE IDIOMA
  // ==========================================
  
  // Idioma actual
  language: 'es', // 'es' | 'en'
  
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
      return;
    }
    
    set({ language: newLang });
    
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
      language: state.language === 'es' ? 'en' : 'es'
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
    set({ language: 'es' });
  }
});
