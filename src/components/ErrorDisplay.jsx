import React from 'react';
import useErrorStore from '../store/errorStore';

/**
 * Componente para mostrar errores de la aplicación
 * 
 * Este componente muestra un mensaje de error cuando el store de errores
 * tiene un error activo. Puede ser incluido en cualquier parte de la aplicación.
 */
export default function ErrorDisplay() {
  const { hasError, errorMessage, clearError } = useErrorStore();
  
  if (!hasError) return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#f44336',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '90%',
        width: '400px'
      }}
    >
      <span>{errorMessage}</span>
      <button
        onClick={clearError}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
      >
        &times;
      </button>
    </div>
  );
}
