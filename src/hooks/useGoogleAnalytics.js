import { useEffect } from 'react';

/**
 * Hook personalizado para Google Analytics
 * Proporciona funciones para hacer tracking de eventos y páginas
 */
export const useGoogleAnalytics = () => {
  
  // Función para hacer tracking de eventos
  const trackEvent = (eventName, parameters = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        // Añadir timestamp para mejor tracking
        timestamp: new Date().toISOString()
      });
    }
  };

  // Función para hacer tracking de vistas de página
  const trackPageView = (pageTitle, pagePath) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-0R9KMBFRWX', {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: pagePath || window.location.pathname
      });
    }
  };

  // Tracking específico de categorías
  const trackCategorySelection = (category, source = 'unknown') => {
    trackEvent('category_selected', {
      category_name: category,
      source: source,
      event_category: 'navigation'
    });
  };

  // Tracking específico de subcategorías
  const trackSubcategorySelection = (category, subcategory, source = 'unknown') => {
    trackEvent('subcategory_selected', {
      category_name: category,
      subcategory_name: subcategory,
      source: source,
      event_category: 'navigation'
    });
  };

  // Tracking específico de filtros
  const trackFilterUsage = (filterType, filterValue, category = null) => {
    trackEvent('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue,
      category_context: category,
      event_category: 'interaction'
    });
  };

  // Tracking específico de detalles de items
  const trackItemDetailView = (itemId, itemTitle, category, source = 'unknown') => {
    trackEvent('item_detail_view', {
      item_id: itemId,
      item_title: itemTitle,
      item_category: category,
      source: source,
      event_category: 'content'
    });
  };

  // Tracking específico de páginas especiales
  const trackSpecialPageView = (pageType, additionalData = {}) => {
    trackEvent('special_page_view', {
      page_type: pageType,
      ...additionalData,
      event_category: 'special_pages'
    });
  };

  // Tracking específico de popups
  const trackPopupView = (popupType, additionalData = {}) => {
    trackEvent('popup_view', {
      popup_type: popupType,
      ...additionalData,
      event_category: 'ui_interaction'
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackCategorySelection,
    trackSubcategorySelection,
    trackFilterUsage,
    trackItemDetailView,
    trackSpecialPageView,
    trackPopupView
  };
};

export default useGoogleAnalytics;
