import React from 'react';
import PropTypes from 'prop-types';
import { useAppError } from '../store/useAppStore';

/**
 * ErrorDisplay
 * Muestra un mensaje de error flotante.
 *
 * Props:
 * - message: string (mensaje a mostrar, si no se usa el del store)
 * - type: 'error' | 'warning' | 'info' | 'success' (color del fondo)
 * - position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' (posición)
 * - onClose: función para cerrar el error (por defecto usa clearError del store)
 * - open: boolean (si se fuerza a mostrar)
 * - className: string (clase CSS extra)
 * - style: object (estilos extra)
 */
const ErrorDisplay = ({
  message,
  type = 'error',
  position = 'bottom-right',
  onClose,
  open,
  className = '',
  style = {}
}) => {
  const store = useAppError();
  const hasError = typeof open === 'boolean' ? open : store.hasError;
  const errorMessage = message || store.errorMessage;
  const handleClose = onClose || store.clearError;

  if (!hasError || !errorMessage) return null;

  const bgColors = {
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    success: '#4caf50'
  };
  const positions = {
    'top-left': { top: 20, left: 20, right: 'auto', bottom: 'auto' },
    'top-right': { top: 20, right: 20, left: 'auto', bottom: 'auto' },
    'bottom-left': { bottom: 20, left: 20, right: 'auto', top: 'auto' },
    'bottom-right': { bottom: 20, right: 20, left: 'auto', top: 'auto' }
  };

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        backgroundColor: bgColors[type] || bgColors.error,
        color: 'white',
        padding: '12px 20px',
        borderRadius: '4px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '90%',
        width: '400px',
        fontSize: '1rem',
        ...positions[position],
        ...style
      }}
    >
      <span>{errorMessage}</span>
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
        aria-label="Cerrar error"
      >
        &times;
      </button>
    </div>
  );
};

ErrorDisplay.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  onClose: PropTypes.func,
  open: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object
};

export default ErrorDisplay;
