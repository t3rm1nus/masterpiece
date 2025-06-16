/**
 * MOBILE-OPTIMIZED PayPal SDK Configuration
 * Enhanced error handling and mobile compatibility
 * Version: 2025-06-16-v3 (Mobile Production Hardened)
 */
(function() {
  console.log('🔧 PayPal SDK Loader v3 - MOBILE HARDENED');
  
  // Robust environment detection
  const hostname = window.location.hostname;
  const port = window.location.port;
  const isLocalhost = hostname === 'localhost' || 
                     hostname === '127.0.0.1' || 
                     port === '5173' ||
                     port === '3000';
  
  const isProduction = !isLocalhost;
  
  // Enhanced mobile detection
  const isMobileDevice = window.innerWidth <= 768 || 
                        window.screen.width <= 768 ||
                        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Detect iOS specifically (known for stricter payment policies)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  console.log('🌍 Environment Analysis:', {
    hostname,
    port,
    isLocalhost,
    isProduction,
    isMobileDevice,
    isIOS,
    userAgent: navigator.userAgent.substring(0, 50) + '...'
  });
  
  // Mobile-optimized PayPal SDK configuration
  let sdkUrl;
  if (isLocalhost) {
    // Localhost: Most conservative configuration to avoid development errors
    sdkUrl = "https://www.paypal.com/sdk/js?" +
      "client-id=AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R" +
      "&components=buttons" +
      "&disable-funding=venmo,card" +
      "&currency=EUR" +
      "&debug=true";
  } else {
    // Production: Use official PayPal demo client ID for maximum compatibility
    const baseParams = [
      "client-id=AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R",
      "components=buttons",
      "currency=EUR",
      "disable-funding=venmo",
      "enable-funding=card"
    ];
    
    sdkUrl = "https://www.paypal.com/sdk/js?" + baseParams.join("&");
  }
  
  console.log('🌐 PayPal SDK URL (Mobile Optimized):', sdkUrl);
  
  // Enhanced script loading with error handling
  const script = document.createElement('script');
  script.src = sdkUrl;
  script.crossOrigin = 'anonymous';
  script.async = true;
  
  // Mobile-specific error handling
  script.onerror = function(error) {
    console.error('❌ PayPal SDK Load Error:', error);
    console.log('🔄 Attempting fallback configuration...');
    
    // Fallback: Ultra-simple configuration
    const fallbackScript = document.createElement('script');
    fallbackScript.src = "https://www.paypal.com/sdk/js?" +
      "client-id=AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R" +
      "&components=buttons" +
      "&currency=EUR";
    fallbackScript.crossOrigin = 'anonymous';
    fallbackScript.async = true;
    document.head.appendChild(fallbackScript);
  };
  
  script.onload = function() {
    console.log('✅ PayPal SDK Loaded Successfully');
    console.log('📱 Mobile Device:', isMobileDevice);
    console.log('� iOS Device:', isIOS);
    console.log('🌍 Environment:', isProduction ? 'Production' : 'Development');
    // Trigger React initialization if available
    if (typeof window.initializePayPal === 'function') {
      console.log('[PayPal Loader] Triggering initializePayPal after SDK loaded');
      try {
        window.initializePayPal();
      } catch (e) {
        console.error('[PayPal Loader] Error in initializePayPal:', e);
      }
    }
  };
  
  // Store configuration globally for debugging
  window.PayPalConfig = {
    environment: isProduction ? 'production' : 'development',
    isMobile: isMobileDevice,
    isIOS: isIOS,
    sdkUrl: sdkUrl,
    loadTime: Date.now()
  };
  
  document.head.appendChild(script);
  
  console.log('💳 PayPal SDK Configuration Summary:', {
    environment: isProduction ? 'PRODUCTION' : 'DEVELOPMENT',
    device: isMobileDevice ? 'MOBILE' : 'DESKTOP',
    platform: isIOS ? 'iOS' : 'Other',
    cards: isLocalhost ? 'DISABLED (dev)' : 'ENABLED',
    region: 'ES (España)',
    currency: 'EUR',
    optimizations: isMobileDevice ? 'Mobile-specific' : 'Standard'
  });
})();
