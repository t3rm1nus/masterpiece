/**
 * Error Slice - Gestión de errores
 * Consolidación del errorStore anterior
 */

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
