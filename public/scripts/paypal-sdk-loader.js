/**
 * Environment Detection and PayPal SDK Configuration
 * Loads PayPal SDK with optimal settings for development and production
 */
(function() {
  // Detect environment
  window.isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' || 
                      window.location.port === '5173' ||
                      window.location.port === '3000';
  
  window.isProduction = !window.isLocalhost;
  
  console.log('🌍 Environment:', {
    hostname: window.location.hostname,
    isLocalhost: window.isLocalhost,
    isProduction: window.isProduction
  });
  
  // Detect mobile device
  const isMobileDevice = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Load PayPal SDK with mobile-optimized configuration
  let sdkUrl;
  if (window.isLocalhost) {
    // En localhost, deshabilitar tarjetas para evitar errores de desarrollo
    sdkUrl = "https://www.paypal.com/sdk/js?client-id=AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R&components=buttons&disable-funding=venmo,card&currency=EUR&debug=true";
  } else {
    // En producción, configuración europea específica para evitar DOMESTIC_TRANSACTION_REQUIRED
    if (isMobileDevice) {
      // Configuración móvil optimizada para Europa/España
      sdkUrl = "https://www.paypal.com/sdk/js?client-id=AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R&components=buttons&currency=EUR&locale=es_ES&disable-funding=venmo&intent=capture&buyer-country=ES&merchant-id=AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R";
    } else {
      // Configuración desktop para Europa/España
      sdkUrl = "https://www.paypal.com/sdk/js?client-id=AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R&components=buttons&currency=EUR&locale=es_ES&disable-funding=venmo&buyer-country=ES&merchant-id=AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R";
    }
  }
  
  const script = document.createElement('script');
  script.src = sdkUrl;
  script.crossOrigin = 'anonymous';
  script.async = true;
  document.head.appendChild(script);
  
  console.log('💳 PayPal SDK loaded for:', {
    environment: window.isLocalhost ? 'localhost' : 'production',
    device: isMobileDevice ? 'móvil' : 'desktop',
    cards: window.isLocalhost ? 'deshabilitadas (desarrollo)' : 'habilitadas',
    region: window.isLocalhost ? 'debug' : 'ES (España)',
    currency: 'EUR',
    funding: 'PayPal + tarjetas (venmo deshabilitado)'
  });
})();
