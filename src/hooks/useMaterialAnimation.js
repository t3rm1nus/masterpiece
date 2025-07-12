import { useMemo } from 'react';

/**
 * Hook personalizado para animaciones de Material-UI
 * Proporciona configuración consistente para todas las animaciones de la app
 * 
 * @param {boolean} isClosing - Si el componente está cerrando
 * @param {number} timeout - Duración de la animación en ms (default: 400)
 * @param {string} type - Tipo de animación: 'slide', 'zoom', 'fade', 'grow' (default: 'slide')
 * @returns {object} Props para el componente de animación de Material-UI
 */
export const useMaterialAnimation = (isClosing, timeout = 400, type = 'slide') => {
  const animationProps = useMemo(() => {
    const baseProps = {
      in: !isClosing,
      timeout,
      easing: { 
        enter: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        exit: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }
    };

    // Props específicos según el tipo de animación
    switch (type) {
      case 'slide':
        return {
          ...baseProps,
          direction: 'up',
          mountOnEnter: true,
          unmountOnExit: true
        };
      case 'zoom':
        return {
          ...baseProps,
          mountOnEnter: true,
          unmountOnExit: true
        };
      case 'fade':
        return {
          ...baseProps,
          mountOnEnter: true,
          unmountOnExit: true
        };
      case 'grow':
        return {
          ...baseProps,
          mountOnEnter: true,
          unmountOnExit: true
        };
      default:
        return baseProps;
    }
  }, [isClosing, timeout, type]);

  return animationProps;
};

/**
 * Hook específico para animaciones de entrada/salida de páginas
 */
export const usePageAnimation = (isClosing, timeout = 550) => {
  return useMaterialAnimation(isClosing, timeout, 'zoom');
};

/**
 * Hook específico para animaciones de detalles móviles
 */
export const useMobileDetailAnimation = (isClosing, timeout = 400) => {
  return useMaterialAnimation(isClosing, timeout, 'slide');
};

/**
 * Hook específico para animaciones de overlays
 */
export const useOverlayAnimation = (isVisible, timeout = 400) => {
  return useMaterialAnimation(!isVisible, timeout, 'fade');
}; 