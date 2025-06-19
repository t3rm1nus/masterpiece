/**
 * Error Slice - Gestión de errores
 * Consolidación del errorStore anterior
 */

export const createErrorSlice = (set, get) => ({
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
   * Verificar si hay error activo
   */
  getErrorStatus: () => {
    const { hasError, errorMessage, errorSource } = get();
    return { hasError, errorMessage, errorSource };
  },
  
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
