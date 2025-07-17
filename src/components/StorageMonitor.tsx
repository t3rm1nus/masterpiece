import React, { useState, useEffect } from 'react';
import { safeStorage } from '../utils/safeStorage';
import useIsomorphicLayoutEffect from '../hooks/useIsomorphicLayoutEffect';

// =============================================
// StorageMonitor: Monitor y depurador de almacenamiento local
// Componente para monitorear y depurar el estado del almacenamiento local.
// Optimizado para móviles, robustez ante errores de storage y soporte de limpieza automática.
// =============================================

interface StorageInfo {
  utilization: number;
  available: boolean;
  currentSize: number;
  maxSize: number;
  needsCleanup: boolean;
}

interface StorageMonitorProps {
  enabled?: boolean;
}

export function StorageMonitor({ enabled = false }: StorageMonitorProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Mostrar solo en desarrollo
  if (!enabled) return null;

  // Detectar si es móvil (SSR-safe)
  const [isMobile, setIsMobile] = useState(false);
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 900);
    }
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: isMobile ? '16px' : '10px',
        left: isMobile ? '50%' : 'auto',
        right: isMobile ? 'auto' : '10px',
        transform: isMobile ? 'translateX(-50%)' : 'none',
        backgroundColor: '#4ecdc4',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 10000,
        cursor: 'pointer',
        maxWidth: '200px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
      }}
      onClick={() => setIsVisible(!isVisible)}
    >
      <div>
        📊 Storage Monitor
      </div>
      
      {isVisible && (
        <div style={{ marginTop: '5px', fontSize: '10px' }}>
          <div>Status: ✅ Active</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              safeStorage.clear();
            }}
            style={{
              marginTop: '5px',
              padding: '2px 6px',
              fontSize: '10px',
              backgroundColor: '#ff4757',
              color: 'white',
              border: 'none',
              borderRadius: '2px',
              cursor: 'pointer'
            }}
          >
            Clear Storage
          </button>
        </div>
      )}
    </div>
  );
}

// Hook para detectar errores de storage
export function useStorageErrorHandler(): void {
  useIsomorphicLayoutEffect(() => {
    const originalError = typeof window !== 'undefined' ? window.onerror : null;
    const originalUnhandledRejection = typeof window !== 'undefined' ? window.onunhandledrejection : null;
    if (typeof window !== 'undefined') {
      window.onerror = function(message: string | Event, source?: string, lineno?: number, colno?: number, error?: Error): boolean | undefined {
        if (typeof message === 'string' && message.includes('QuotaExceededError')) {
          console.error('QuotaExceededError detectado por window.onerror:', {
            message,
            source,
            lineno,
            colno,
            error
          });
          // Ejecutar limpieza de emergencia
          safeStorage.clear();
        }
        if (originalError) {
          return originalError(message, source, lineno, colno, error);
        }
        return false;
      };
      window.onunhandledrejection = function(event: PromiseRejectionEvent): void {
        if (event.reason && (event.reason as any).name === 'QuotaExceededError') {
          console.error('QuotaExceededError detectado por unhandledrejection:', event.reason);
          // Ejecutar limpieza de emergencia
          safeStorage.clear();
          // Prevenir que el error se propague
          event.preventDefault();
        }
        if (originalUnhandledRejection) {
          originalUnhandledRejection.call(window, event);
        }
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.onerror = originalError;
        window.onunhandledrejection = originalUnhandledRejection;
      }
    };
  }, []);
} 