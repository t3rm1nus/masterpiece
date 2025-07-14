/**
 * Utilidad para logs en desarrollo
 * En producción, los logs se omiten automáticamente
 */

const isDevelopment = (import.meta as any).env?.DEV || false;

interface Logger {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
}

export const logger: Logger = {
  error: (...args: any[]) => {
    // Los errores siempre se muestran
    console.error(...args);
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  }
};

export default logger; 