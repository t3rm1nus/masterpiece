// Utilidad simple para manejar localStorage de forma segura en iOS/Safari
// Previene QuotaExceededError mediante limpieza automática

interface SafeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): boolean;
  removeItem(key: string): boolean;
  clear(): boolean;
}

const safeStorage: SafeStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('Error al leer localStorage:', e);
      return null;
    }
  },

  setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e: any) {
      if (e.name === 'QuotaExceededError') {
        console.warn('QuotaExceededError - Limpiando storage y reintentando');
        try {
          // Limpiar localStorage y reintentar
          localStorage.clear();
          localStorage.setItem(key, value);
          return true;
        } catch (e2) {
          console.error('No se pudo guardar tras limpiar:', e2);
          return false;
        }
      }
      console.warn('Error al escribir localStorage:', e);
      return false;
    }
  },

  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('Error al eliminar de localStorage:', e);
      return false;
    }
  },

  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.warn('Error al limpiar localStorage:', e);
      return false;
    }
  }
};

export { safeStorage }; 