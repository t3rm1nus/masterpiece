/**
 * Utilidades específicas para solucionar problemas de scroll en iPhone/iOS
 * PROHIBIDO usar en otras plataformas - solo iPhone
 */

/**
 * Detecta si el dispositivo es específicamente un iPhone
 * @returns true si es iPhone
 */
export const isIPhone = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof navigator !== 'undefined' && 
         /iPhone|iPod/.test(navigator.userAgent);
};

/**
 * Fuerza el scroll en contenedores específicos para iPhone
 * Solo se ejecuta en iPhones
 * @param selectors - Array de selectores CSS para forzar scroll
 * @param delay - Delay en ms antes de aplicar los fixes (default: 100)
 */
export const forceScrollOnIPhone = (selectors: string[] = [], delay: number = 100): void => {
  if (!isIPhone()) {
    return; // Solo ejecutar en iPhones
  }

  // Forzar propiedades de scroll en el body
  document.body.style.overflowY = 'auto';
  (document.body.style as any).webkitOverflowScrolling = 'touch';

  setTimeout(() => {
    selectors.forEach(selector => {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach(element => {
        if (element) {
          element.style.overflowY = 'auto';
          (element.style as any).webkitOverflowScrolling = 'touch';

          // Si es un contenedor modal o principal, forzar height también
          if (selector.includes('aria-modal') || selector.includes('role="dialog"')) {
            element.style.height = '100vh';
            element.style.maxHeight = '100vh';
          }
        }
      });
    });
  }, delay);
};

/**
 * Aplica fixes específicos para la vista de detalle en iPhone
 */
export const applyDetailScrollFixForIPhone = (): void => {
  if (!isIPhone()) return;

  const selectors: string[] = [
    // '[role="dialog"][aria-modal="true"]', // Eliminado: solo para Dialogs de MUI
    // '[role="dialog"][aria-modal="true"] > .MuiBox-root', // Eliminado
    '.mp-detail-overlay',
    '.mp-ui-card',
    '.item-detail-mobile-card',
    '.slideInUp',
    '.slideOutDown',
    '.MuiCardContent-root'
  ];

  forceScrollOnIPhone(selectors, 150);
};

/**
 * Aplica fixes específicos para la página "Cómo descargar" en iPhone
 */
export const applyHowToDownloadScrollFixForIPhone = (): void => {
  if (!isIPhone()) return;

  const selectors: string[] = [
    '[data-page="howToDownload"]',
    '[data-page="howToDownload"] > .MuiBox-root',
    '[data-page="howToDownload"] .MuiPaper-root'
  ];

  forceScrollOnIPhone(selectors, 200);
};

/**
 * Limpia los fixes de scroll aplicados (restore original state)
 */
export const cleanupScrollFixesForIPhone = (): void => {
  if (!isIPhone()) return;

  document.body.style.overflowY = '';
  (document.body.style as any).webkitOverflowScrolling = '';
}; 