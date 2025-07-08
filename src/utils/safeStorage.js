// Utilidad para manejar localStorage de forma segura en iOS/Safari
// Implementa limpieza automática y manejo de errores de QuotaExceededError

const STORAGE_KEY = 'masterpiece-data';
const MAX_STORAGE_SIZE = 2 * 1024 * 1024; // 2MB límite para iOS
const CRITICAL_FIELDS = ['language', 'isDarkMode', 'selectedCategory', 'selectedSubcategory'];

class SafeStorage {
  constructor() {
    this.isAvailable = this.checkStorageAvailability();
  }

  checkStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage no disponible:', e);
      return false;
    }
  }

  getStorageSize() {
    if (!this.isAvailable) return 0;
    
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  cleanupStorage() {
    if (!this.isAvailable) return;

    try {
      // Eliminar datos no críticos primero
      const data = this.getState();
      if (data && data.state) {
        // Eliminar campos grandes no esenciales
        delete data.state.allRecommendations;
        delete data.state.filteredRecommendations;
        delete data.state.scrollPosition;
        delete data.state.mobileHomeStyles;
        delete data.state.desktopStyles;
        delete data.state.translations;
        
        // Mantener solo campos críticos
        const cleanState = {};
        CRITICAL_FIELDS.forEach(field => {
          if (data.state[field] !== undefined) {
            cleanState[field] = data.state[field];
          }
        });
        
        data.state = cleanState;
        this.setState(data);
      }
    } catch (e) {
      console.warn('Error durante limpieza de storage:', e);
      // Si falla la limpieza, limpiar completamente
      this.clearAll();
    }
  }

  getState() {
    if (!this.isAvailable) return null;
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Error al leer localStorage:', e);
      return null;
    }
  }

  setState(data) {
    if (!this.isAvailable) return false;

    try {
      // Verificar utilización actual antes de guardar
      const currentSize = this.getStorageSize();
      const utilizationRatio = currentSize / MAX_STORAGE_SIZE;
      
      if (utilizationRatio > 0.7) {
        console.warn(`Storage utilization: ${(utilizationRatio * 100).toFixed(1)}%, ejecutando limpieza preventiva`);
        this.cleanupStorage();
      }

      const serialized = JSON.stringify(data);
      
      // Verificar si los nuevos datos exceden el límite
      if (serialized.length > MAX_STORAGE_SIZE) {
        console.warn('Datos exceden límite, ejecutando limpieza de emergencia');
        this.emergencyCleanup();
        
        // Intentar guardar solo datos críticos
        const minimalData = {
          state: {},
          version: data.version || 0
        };
        
        CRITICAL_FIELDS.forEach(field => {
          if (data.state && data.state[field] !== undefined) {
            minimalData.state[field] = data.state[field];
          }
        });
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalData));
        return true;
      }

      localStorage.setItem(STORAGE_KEY, serialized);
      return true;
    } catch (e) {
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.warn('Cuota de almacenamiento excedida, ejecutando limpieza de emergencia');
        
        // Intentar limpieza de emergencia
        const cleanupSuccess = this.emergencyCleanup();
        
        if (cleanupSuccess) {
          // Intentar guardar solo datos críticos después de la limpieza
          try {
            const minimalData = {
              state: {},
              version: data.version || 0
            };
            
            CRITICAL_FIELDS.forEach(field => {
              if (data.state && data.state[field] !== undefined) {
                minimalData.state[field] = data.state[field];
              }
            });
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalData));
            return true;
          } catch (retryError) {
            console.error('Error crítico de storage tras limpieza:', retryError);
            this.clearAll();
            return false;
          }
        } else {
          console.error('No se pudo ejecutar limpieza de emergencia');
          this.clearAll();
          return false;
        }
      } else {
        console.error('Error inesperado al guardar en localStorage:', e);
        return false;
      }
    }
  }

  clearAll() {
    if (!this.isAvailable) return;
    
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Error al limpiar localStorage:', e);
    }
  }

  // Método para obtener información de depuración
  getDebugInfo() {
    return {
      isAvailable: this.isAvailable,
      storageSize: this.getStorageSize(),
      maxSize: MAX_STORAGE_SIZE,
      usage: (this.getStorageSize() / MAX_STORAGE_SIZE * 100).toFixed(2) + '%'
    };
  }

  // Método para obtener información del estado del storage
  getStorageInfo() {
    return {
      available: this.isAvailable,
      currentSize: this.getStorageSize(),
      maxSize: MAX_STORAGE_SIZE,
      utilization: this.getStorageSize() / MAX_STORAGE_SIZE,
      needsCleanup: this.getStorageSize() > MAX_STORAGE_SIZE * 0.7
    };
  }

  // Limpieza de emergencia más agresiva
  emergencyCleanup() {
    if (!this.isAvailable) return false;
    
    try {
      console.warn('Ejecutando limpieza de emergencia del localStorage');
      
      // Guardar solo los datos más críticos
      const currentData = this.getState();
      const criticalData = {};
      
      if (currentData && currentData.state) {
        CRITICAL_FIELDS.forEach(field => {
          if (currentData.state[field] !== undefined) {
            criticalData[field] = currentData.state[field];
          }
        });
      }
      
      // Limpiar completamente el localStorage
      localStorage.clear();
      
      // Restaurar solo datos críticos si los hay
      if (Object.keys(criticalData).length > 0) {
        this.setState({ state: criticalData });
        console.log('Limpieza completada, datos críticos preservados:', Object.keys(criticalData));
      }
      
      return true;
    } catch (e) {
      console.error('Error durante limpieza de emergencia:', e);
      try {
        localStorage.clear();
        return true;
      } catch (clearError) {
        console.error('No se pudo limpiar localStorage:', clearError);
        return false;
      }
    }
  }
}

export const safeStorage = new SafeStorage();

// Configuración personalizada para Zustand persist
export const createPersistConfig = (name = STORAGE_KEY) => ({
  name,
  storage: {
    getItem: (name) => {
      const data = safeStorage.getState();
      return data ? JSON.stringify(data) : null;
    },
    setItem: (name, value) => {
      try {
        const data = JSON.parse(value);
        safeStorage.setState(data);
      } catch (e) {
        console.error('Error al parsear datos para storage:', e);
      }
    },
    removeItem: (name) => {
      safeStorage.clearAll();
    }
  },
  partialize: (state) => {
    // Solo persistir campos críticos para reducir el tamaño
    const persistedState = {};
    
    CRITICAL_FIELDS.forEach(field => {
      if (state[field] !== undefined) {
        persistedState[field] = state[field];
      }
    });
    
    return persistedState;
  },
  onRehydrateStorage: (state) => {
    return (state, error) => {
      if (error) {
        console.error('Error al rehidratar storage:', error);
        safeStorage.clearAll();
      } else {
        console.log('Storage rehidratado exitosamente');
        
        // Log información de depuración en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.log('Storage Debug Info:', safeStorage.getDebugInfo());
        }
      }
    };
  }
});
