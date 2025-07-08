/**
 * Utilidades específicas para solucionar problemas de scroll en iPhone/iOS
 * PROHIBIDO usar en otras plataformas - solo iPhone
 */

/**
 * Detecta si el dispositivo es específicamente un iPhone
 * @returns {boolean} true si es iPhone
 */
export const isIPhone = () => {
  return typeof window !== 'undefined' && /iPhone|iPod/.test(navigator.userAgent);
};

/**
 * Fuerza el scroll en contenedores específicos para iPhone
 * Solo se ejecuta en iPhones
 * @param {string[]} selectors - Array de selectores CSS para forzar scroll
 * @param {number} delay - Delay en ms antes de aplicar los fixes (default: 100)
 */
export const forceScrollOnIPhone = (selectors = [], delay = 100) => {
  if (!isIPhone()) {
    return; // Solo ejecutar en iPhones
  }
  
  console.log('[iPhone ScrollFix] Aplicando fixes de scroll específicos para iPhone');
  
  // Forzar propiedades de scroll en el body
  document.body.style.overflowY = 'auto';
  document.body.style.webkitOverflowScrolling = 'touch';
  
  setTimeout(() => {
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        if (element) {
          element.style.overflowY = 'auto';
          element.style.webkitOverflowScrolling = 'touch';
          
          // Si es un contenedor modal o principal, forzar height también
          if (selector.includes('aria-modal') || selector.includes('role="dialog"')) {
            element.style.height = '100vh';
            element.style.maxHeight = '100vh';
          }
          
          console.log('[iPhone ScrollFix] Aplicado scroll fix a:', selector);
        }
      });
    });
  }, delay);
};

/**
 * Aplica fixes específicos para la vista de detalle en iPhone
 */
export const applyDetailScrollFixForIPhone = () => {
  if (!isIPhone()) return;
  
  console.log('[iPhone ScrollFix] Aplicando fixes para vista de detalle');
  
  const selectors = [
    '[role="dialog"][aria-modal="true"]',
    '[role="dialog"][aria-modal="true"] > .MuiBox-root',
    '.slideInUp',
    '.slideOutDown',
    '.mp-ui-card',
    '.item-detail-mobile-card',
    '.MuiCardContent-root'
  ];
  
  forceScrollOnIPhone(selectors, 150);
};

/**
 * Aplica fixes específicos para la página "Cómo descargar" en iPhone
 */
export const applyHowToDownloadScrollFixForIPhone = () => {
  if (!isIPhone()) return;
  
  console.log('[iPhone ScrollFix] Aplicando fixes para página "Cómo descargar"');
  
  const selectors = [
    '[data-page="howToDownload"]',
    '[data-page="howToDownload"] > .MuiBox-root',
    '[data-page="howToDownload"] .MuiPaper-root'
  ];
  
  forceScrollOnIPhone(selectors, 200);
};

/**
 * Limpia los fixes de scroll aplicados (restore original state)
 */
export const cleanupScrollFixesForIPhone = () => {
  if (!isIPhone()) return;
  
  console.log('[iPhone ScrollFix] Limpiando fixes de scroll');
  
  document.body.style.overflowY = '';
  document.body.style.webkitOverflowScrolling = '';
};
