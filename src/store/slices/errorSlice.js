/**
 * ERROR SLICE OFICIAL
 * Centraliza la gestión de errores globales de la app.
 * - Todos los estados y funciones de error deben declararse aquí, no en el store principal.
 * - Usar siempre 'error' como nombre de campo global para errores.
 * - Si se agregan nuevos campos globales de error, documentar aquí y en el store principal.
 */

/**
 * Error Slice - Gestión de errores
 * Consolidación del errorStore anterior
 */

// =============================================
// SLICE DE ERRORES PRINCIPAL
// Este slice contiene la lógica y estados relacionados con la gestión de errores globales.
//
// CONVENCIONES:
// - Todos los estados y funciones de error deben declararse aquí, no en el store principal.
// - Usar siempre 'error' como nombre de campo global para errores.
// - Si se agregan nuevos campos globales de error, documentar aquí y en el store principal.
// =============================================

export const errorSlice = (set, get) => ({
  // ==========================================
  // ESTADO DE ERRORES
  // ==========================================
  
  // Estado del error
  hasError: false,
  errorMessage: '',
  errorSource: null,
  
  // ==========================================
  // ACCIONES DE ERRORES
  // ==========================================
  
  /**
   * Establecer un error
   */
  setError: (message, source = null) => {
    console.error('[ErrorSlice] Error set:', { message, source });
    set({ 
      hasError: true,
      errorMessage: message,
      errorSource: source
    });
  },
  
  /**
   * Limpiar error actual
   */
  clearError: () => {
    console.log('[ErrorSlice] Error cleared');
    set({ 
      hasError: false,
      errorMessage: '',
      errorSource: null
    });
  },
    /**
   * ELIMINADO: getErrorStatus con get() - CAUSABA INFINITE LOOPS
   * Los valores se exponen directamente en el selector
   */
  
  // ==========================================
  // RESETEAR ESTADO
  // ==========================================
  
  /**
   * Resetear slice de errores
   */
  resetError: () => {
    console.log('[ErrorSlice] Resetting error state');
    set({ 
      hasError: false,
      errorMessage: '',
      errorSource: null
    });
  }
});
