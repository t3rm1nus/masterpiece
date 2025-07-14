import { useMemo } from 'react';

type AnimationType = 'slide' | 'zoom' | 'fade' | 'grow';

interface MaterialAnimationProps {
  in: boolean;
  timeout: number;
  mountOnEnter: boolean;
  unmountOnExit: boolean;
  appear: boolean;
  enter: boolean;
  exit: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * Hook personalizado para animaciones de Material-UI
 * Proporciona configuración consistente para todas las animaciones de la app
 * 
 * @param {boolean} isClosing - Si el componente está cerrando
 * @param {number} timeout - Duración de la animación en ms (default: 400)
 * @param {string} type - Tipo de animación: 'slide', 'zoom', 'fade', 'grow' (default: 'slide')
 * @returns {object} Props para el componente de animación de Material-UI
 */
export const useMaterialAnimation = (isClosing: boolean, timeout: number = 400, type: AnimationType = 'slide'): MaterialAnimationProps => {
  const animationProps = useMemo(() => {
    const baseProps: MaterialAnimationProps = {
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
          direction: 'up' as const
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
export const usePageAnimation = (isClosing: boolean, timeout: number = 550): MaterialAnimationProps => {
  return useMaterialAnimation(isClosing, timeout, 'zoom');
};

/**
 * Hook específico para animaciones de detalles móviles
 * SIN ANIMACIONES DE SLIDE para evitar parpadeo al volver
 */
export const useMobileDetailAnimation = (isClosing: boolean, timeout: number = 0): MaterialAnimationProps => {
  // Retornar props sin animación para evitar parpadeo
  return {
    in: !isClosing,
    timeout: 0,
    mountOnEnter: true,
    unmountOnExit: true,
    appear: false,
    enter: false, // Sin animación de entrada
    exit: false   // Sin animación de salida
  };
};

/**
 * Hook específico para animaciones de overlays
 */
export const useOverlayAnimation = (isVisible: boolean, timeout: number = 400): MaterialAnimationProps => {
  return useMaterialAnimation(!isVisible, timeout, 'fade');
}; 