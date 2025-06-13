import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Store para la gestión de errores en la aplicación
const useErrorStore = create(
  devtools(
    (set) => ({
      // Estado inicial
      hasError: false,
      errorMessage: '',
      errorSource: null,
      
      // Acciones
      setError: (message, source = null) => set(
        { 
          hasError: true,
          errorMessage: message,
          errorSource: source
        },
        false,
        'setError'
      ),
      
      clearError: () => set(
        { 
          hasError: false,
          errorMessage: '',
          errorSource: null
        },
        false,
        'clearError'
      )
    }),
    { name: 'error-store' } // Nombre para DevTools
  )
);

export default useErrorStore;
