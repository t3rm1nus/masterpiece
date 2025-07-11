/**
 * Utilidad para logs en desarrollo
 * En producción, los logs se omiten automáticamente
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  error: (...args) => {
    // Los errores siempre se muestran
    console.error(...args);
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};

export default logger;
