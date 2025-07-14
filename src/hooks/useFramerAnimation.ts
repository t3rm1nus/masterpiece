import { useMemo } from 'react';

type AnimationType = 'fade' | 'slide' | 'scale' | 'zoom';

interface AnimationProps {
  initial: { opacity: number; y?: number; scale?: number };
  animate: { opacity: number; y?: number; scale?: number };
  exit: { opacity: number; y?: number; scale?: number };
  transition: {
    duration: number;
    ease: number[];
  };
}

/**
 * Hook personalizado para animaciones de Framer Motion
 * Proporciona configuración consistente para todas las animaciones de la app
 * 
 * @param {boolean} isClosing - Si el componente está cerrando
 * @param {number} duration - Duración de la animación en segundos (default: 0.4)
 * @param {string} type - Tipo de animación: 'fade', 'slide', 'scale', 'zoom' (default: 'fade')
 * @returns {object} Props para el componente motion de Framer Motion
 */
export const useFramerAnimation = (isClosing: boolean, duration: number = 0.4, type: AnimationType = 'fade'): AnimationProps => {
  const animationProps = useMemo(() => {
    const baseProps: AnimationProps = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: {
        duration,
        ease: [0.4, 0, 0.2, 1] // Curva de ease estándar
      }
    };

    // Props específicos según el tipo de animación
    switch (type) {
      case 'fade':
        return baseProps;
      case 'slide':
        return {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -50 },
          transition: {
            duration,
            ease: [0.4, 0, 0.2, 1]
          }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 },
          transition: {
            duration,
            ease: [0.4, 0, 0.2, 1]
          }
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.1 },
          transition: {
            duration,
            ease: [0.4, 0, 0.2, 1]
          }
        };
      default:
        return baseProps;
    }
  }, [duration, type]);

  return animationProps;
};

/**
 * Hook específico para animaciones de entrada/salida de páginas
 */
export const usePageAnimation = (isClosing: boolean, duration: number = 0.5): AnimationProps => {
  return useFramerAnimation(isClosing, duration, 'zoom');
};

/**
 * Hook específico para animaciones de detalles móviles
 */
export const useMobileDetailAnimation = (isClosing: boolean, duration: number = 0.4): AnimationProps => {
  return useFramerAnimation(isClosing, duration, 'slide');
};

/**
 * Hook específico para animaciones de overlays
 */
export const useOverlayAnimation = (isVisible: boolean, duration: number = 0.4): AnimationProps => {
  return useFramerAnimation(!isVisible, duration, 'fade');
}; 