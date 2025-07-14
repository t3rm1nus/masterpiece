import { useEffect } from 'react';

// Extender la interfaz Window para incluir gtag
declare global {
  interface Window {
    gtag?: (command: string, targetId: string, config?: Record<string, any>) => void;
  }
}

interface TrackEventParameters {
  [key: string]: any;
  timestamp?: string;
}

interface UseGoogleAnalyticsReturn {
  trackEvent: (eventName: string, parameters?: TrackEventParameters) => void;
  trackPageView: (pageTitle: string, pagePath?: string) => void;
  trackCategorySelection: (category: string, source?: string) => void;
  trackSubcategorySelection: (category: string, subcategory: string, source?: string) => void;
  trackFilterUsage: (filterType: string, filterValue: string, category?: string | null) => void;
  trackItemDetailView: (itemId: string, itemTitle: string, category: string, source?: string) => void;
  trackSpecialPageView: (pageType: string, additionalData?: Record<string, any>) => void;
  trackPopupView: (popupType: string, additionalData?: Record<string, any>) => void;
}

/**
 * Hook personalizado para Google Analytics
 * Proporciona funciones para hacer tracking de eventos y páginas
 */
export const useGoogleAnalytics = (): UseGoogleAnalyticsReturn => {
  
  // Función para hacer tracking de eventos
  const trackEvent = (eventName: string, parameters: TrackEventParameters = {}) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        // Añadir timestamp para mejor tracking
        timestamp: new Date().toISOString()
      });
    }
  };

  // Función para hacer tracking de vistas de página
  const trackPageView = (pageTitle: string, pagePath?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-0R9KMBFRWX', {
        page_title: pageTitle,
        page_location: window.location.href,
        page_path: pagePath || window.location.pathname
      });
    }
  };

  // Tracking específico de categorías
  const trackCategorySelection = (category: string, source: string = 'unknown') => {
    trackEvent('category_selected', {
      category_name: category,
      source: source,
      event_category: 'navigation'
    });
  };

  // Tracking específico de subcategorías
  const trackSubcategorySelection = (category: string, subcategory: string, source: string = 'unknown') => {
    trackEvent('subcategory_selected', {
      category_name: category,
      subcategory_name: subcategory,
      source: source,
      event_category: 'navigation'
    });
  };

  // Tracking específico de filtros
  const trackFilterUsage = (filterType: string, filterValue: string, category: string | null = null) => {
    trackEvent('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue,
      category_context: category,
      event_category: 'interaction'
    });
  };

  // Tracking específico de detalles de items
  const trackItemDetailView = (itemId: string, itemTitle: string, category: string, source: string = 'unknown') => {
    trackEvent('item_detail_view', {
      item_id: itemId,
      item_title: itemTitle,
      item_category: category,
      source: source,
      event_category: 'content'
    });
  };

  // Tracking específico de páginas especiales
  const trackSpecialPageView = (pageType: string, additionalData: Record<string, any> = {}) => {
    trackEvent('special_page_view', {
      page_type: pageType,
      ...additionalData,
      event_category: 'special_pages'
    });
  };

  // Tracking específico de popups
  const trackPopupView = (popupType: string, additionalData: Record<string, any> = {}) => {
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