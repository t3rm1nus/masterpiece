// Utilidad simple para manejar localStorage de forma segura en iOS/Safari
// Previene QuotaExceededError mediante limpieza automática

const safeStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('Error al leer localStorage:', e);
      return null;
    }
  },

  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
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

  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('Error al eliminar de localStorage:', e);
      return false;
    }
  },

  clear() {
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