import React, { useState, useEffect } from 'react';
import { safeStorage } from '../utils/safeStorage.js';

// =============================================
// StorageMonitor: Monitor y depurador de almacenamiento local
// Componente para monitorear y depurar el estado del almacenamiento local.
// Optimizado para móviles, robustez ante errores de storage y soporte de limpieza automática.
// =============================================

interface StorageInfo {
  utilization: number;
  currentSize: number;
  maxSize: number;
  available: boolean;
  needsCleanup: boolean;
}

interface StorageMonitorProps {
  enabled?: boolean;
}

export function StorageMonitor({ enabled = false }: StorageMonitorProps): React.JSX.Element | null {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const updateStorageInfo = () => {
      if (safeStorage.getStorageInfo) {
        setStorageInfo(safeStorage.getStorageInfo());
      }
    };

    // Actualizar info cada 5 segundos
    const interval = setInterval(updateStorageInfo, 5000);
    updateStorageInfo(); // Actualizar inmediatamente

    return () => clearInterval(interval);
  }, [enabled]);

  // Mostrar solo en desarrollo o si hay problemas de storage
  const shouldShow = enabled && storageInfo && (
    storageInfo.needsCleanup || 
    storageInfo.utilization > 0.7 || 
    !storageInfo.available
  );

  if (!shouldShow) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: storageInfo.needsCleanup ? '#ff6b6b' : '#4ecdc4',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 10000,
        cursor: 'pointer',
        maxWidth: '200px'
      }}
      onClick={() => setIsVisible(!isVisible)}
    >
      <div>
        📊 Storage: {(storageInfo.utilization * 100).toFixed(1)}%
      </div>
      
      {isVisible && (
        <div style={{ marginTop: '5px', fontSize: '10px' }}>
          <div>Available: {storageInfo.available ? '✅' : '❌'}</div>
          <div>Size: {Math.round(storageInfo.currentSize / 1024)}KB</div>
          <div>Max: {Math.round(storageInfo.maxSize / 1024)}KB</div>
          <div>Needs cleanup: {storageInfo.needsCleanup ? '⚠️' : '✅'}</div>
          {storageInfo.needsCleanup && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (safeStorage.forceCleanup) {
                  safeStorage.forceCleanup();
                  setTimeout(() => setStorageInfo(safeStorage.getStorageInfo()), 1000);
                }
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
              Force Cleanup
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Hook para detectar errores de storage
export function useStorageErrorHandler(): void {
  useEffect(() => {
    const originalError = window.onerror;
    const originalUnhandledRejection = window.onunhandledrejection;

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
        if (safeStorage.forceCleanup) {
          safeStorage.forceCleanup();
        }
      }
      
      if (originalError) {
        return originalError(message, source, lineno, colno, error);
      }
      return false;
    };

    window.onunhandledrejection = function(event: PromiseRejectionEvent) {
      if (event.reason && event.reason.name === 'QuotaExceededError') {
        console.error('QuotaExceededError detectado por unhandledrejection:', event.reason);
        
        // Ejecutar limpieza de emergencia
        if (safeStorage.forceCleanup) {
          safeStorage.forceCleanup();
        }
        
        // Prevenir que el error se propague
        event.preventDefault();
      }
      
      if (originalUnhandledRejection) {
        return originalUnhandledRejection(event);
      }
    };

    return () => {
      window.onerror = originalError;
      window.onunhandledrejection = originalUnhandledRejection;
    };
  }, []);
}