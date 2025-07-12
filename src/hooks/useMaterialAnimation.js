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
      // Configuración mínima para evitar errores
      mountOnEnter: true,
      unmountOnExit: true,
      // Agregar configuración para evitar re-renderizados innecesarios
      appear: false,
      enter: true,
      exit: true
    };

    // Props específicos según el tipo de animación
    switch (type) {
      case 'slide':
        return {
          ...baseProps,
          direction: 'up'
        };
      case 'zoom':
        return baseProps;
      case 'fade':
        return baseProps;
      case 'grow':
        return baseProps;
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