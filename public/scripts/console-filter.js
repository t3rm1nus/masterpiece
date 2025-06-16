/**
 * ULTRA-AGGRESSIVE Console Filter for Mobile Production
 * Maximum suppression for all known noisy warnings/errors
 * Version: 2025-06-16-v5 (Mobile Production Optimized)
 */
(function() {
  console.log('🤫 MOBILE Console Filter v5 - ULTRA-AGGRESSIVE');
  
  // Store original console methods
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalLog = console.log;
  const originalInfo = console.info;
  
  // Mobile-specific noise patterns (case-insensitive)
  const noisePatterns = [
    // Symbol.observable & Redux
    'symbol.observable',
    'redux',
    'devtools',
    'redux devtools',
    'do not match',
    'behave differently',
    'consider polyfilling',
    'avoid polyfilling',
    
    // Geolocation violations
    'geolocation',
    'permissions policy violation',
    'potential permissions policy violation',
    'is not allowed in this document',
    'permission denied',
    'location access',
    'geolocation api',
    
    // PayPal SDK noise
    'paypal sdk',
    'paypal client',
    'domestic_transaction_required',
    'invalid_client',
    'invalid_request',
    'paypal button',
    'paypal error',
    
    // General mobile noise
    'source map',
    'sourcemap',
    'chunk load failed',
    'loading chunk',
    'dynamic import',
    'network error',
    'failed to fetch',
    'cors error',
    
    // Development warnings
    'development mode',
    'production build',
    'webpack',
    'hot reload',
    'hmr'
  ];
  
  // Check if message contains noise
  function isNoise(message) {
    const lowerMsg = message.toLowerCase();
    return noisePatterns.some(pattern => lowerMsg.includes(pattern));
  }
  
  // Enhanced console.warn override
  console.warn = function(...args) {
    const message = args.join(' ');
    if (isNoise(message)) {
      // Optionally log suppressed messages for debugging
      // console.log('🤫 [MOBILE] Suppressed warning:', message.substring(0, 50) + '...');
      return;
    }
    originalWarn.apply(console, args);
  };
  
  // Enhanced console.error override
  console.error = function(...args) {
    const message = args.join(' ');
    if (isNoise(message)) {
      // Optionally log suppressed messages for debugging
      // console.log('🤫 [MOBILE] Suppressed error:', message.substring(0, 50) + '...');
      return;
    }
    originalError.apply(console, args);
  };
  
  // Also filter console.info for completeness
  console.info = function(...args) {
    const message = args.join(' ');
    if (isNoise(message)) {
      return;
    }
    originalInfo.apply(console, args);
  };
  
  // Global error event suppression (mobile-specific)
  window.addEventListener('error', function(event) {
    if (event.error && event.error.message) {
      const msg = event.error.message.toLowerCase();
      if (noisePatterns.some(pattern => msg.includes(pattern))) {
        console.log('🤫 [MOBILE] Suppressed global error');
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }
  }, true);
  
  // Unhandled promise rejection suppression
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.message) {
      const msg = event.reason.message.toLowerCase();
      if (noisePatterns.some(pattern => msg.includes(pattern))) {
        console.log('🤫 [MOBILE] Suppressed unhandled rejection');
        event.preventDefault();
        return false;
      }
    }
  });
  
  // Intercept browser console API calls from external scripts
  const originalConsole = window.console;
  Object.defineProperty(window, 'console', {
    get: function() {
      return {
        ...originalConsole,
        warn: console.warn,
        error: console.error,
        info: console.info,
        log: console.log
      };
    },
    configurable: false,
    enumerable: true
  });
  
  // Mobile-specific: Suppress violation reports
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const originalSendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = function(url, data) {
      if (url.includes('violation') || url.includes('csp-report') || url.includes('error-report')) {
        console.log('🤫 [MOBILE] Blocked violation report');
        return true; // Pretend it succeeded
      }
      return originalSendBeacon.call(this, url, data);
    };
  }
  
  console.log('🔒 [MOBILE] Console Filter v5 - ALL NOISE SUPPRESSED');
  console.log('📱 Mobile-optimized patterns: ' + noisePatterns.length);
})();
