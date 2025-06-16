/**
 * Console Filtering for PayPal Warnings and Errors
 * Filters out known PayPal-related warnings and errors to keep console clean
 */
(function() {
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;
  
  // Improved check for PayPal atomics errors
  function isPayPalAtomicsError(args) {
    // Check for the specific pattern: undefined 'atomics_error_getting_devlogger_extension'
    if (args.length >= 2 && 
        args[0] === undefined && 
        typeof args[1] === 'string' && 
        args[1].includes('atomics_error_getting_devlogger_extension')) {
      return true;
    }
    
    // Check for SecurityError related to __ATOMIC_EVENTS_DEV_LOGGER__
    for (let arg of args) {
      if (arg instanceof Error && arg.message) {
        if (arg.message.includes('__ATOMIC_EVENTS_DEV_LOGGER__') ||
            arg.message.includes('atomics_error_getting_devlogger_extension') ||
            (arg.message.includes('Blocked a frame with origin') && 
             arg.message.includes('paypal.com'))) {
          return true;
        }
      }
      
      if (typeof arg === 'string') {
        if (arg.includes('__ATOMIC_EVENTS_DEV_LOGGER__') ||
            arg.includes('atomics_error_getting_devlogger_extension') ||
            (arg.includes('Blocked a frame with origin') && 
             arg.includes('paypal.com'))) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  // Filter PayPal-specific warnings and errors
  console.error = function(...args) {
    // Check for PayPal atomics errors first
    if (isPayPalAtomicsError(args)) {
      return;
    }
    
    const message = args.join(' ');
    
    if (message.includes('ncps_standalone_paylater_ineligible') || 
        message.includes('paypal_js_sdk_v5_unhandled_exception') ||
        message.includes('geolocation is not allowed') ||
        message.includes('DOMESTIC_TRANSACTION_REQUIRED') ||
        message.includes('atomics_error_getting_devlogger_extension') ||
        message.includes('__ATOMIC_EVENTS_DEV_LOGGER__') ||
        (message.includes('Blocked a frame with origin') && message.includes('paypal.com')) ||
        message.includes('Converting circular structure to JSON')) {
      return;
    }
    
    originalError.apply(console, args);
  };
  
  console.warn = function(...args) {
    // Check for PayPal atomics errors first
    if (isPayPalAtomicsError(args)) {
      return;
    }
    
    const message = args.join(' ');
    
    if (message.includes('ncps_standalone_paylater_ineligible') || 
        message.includes('Pay Later ineligible') ||
        message.includes('Symbol.observable as defined by Redux') ||
        message.includes('atomics_error_getting_devlogger_extension') ||
        message.includes('__ATOMIC_EVENTS_DEV_LOGGER__')) {
      return;
    }
    
    originalWarn.apply(console, args);
  };
  
  console.log = function(...args) {
    // Check for PayPal atomics errors first
    if (isPayPalAtomicsError(args)) {
      return;
    }
    
    const message = args.join(' ');
    
    if (message.includes('atomics_error_getting_devlogger_extension') ||
        message.includes('__ATOMIC_EVENTS_DEV_LOGGER__')) {
      return;
    }
    
    originalLog.apply(console, args);
  };
  
  // Error event listeners
  window.addEventListener('error', function(event) {
    if (event.error && event.error.message && 
        (event.error.message.includes('geolocation is not allowed') ||
         event.error.message.includes('DOMESTIC_TRANSACTION_REQUIRED') ||
         event.error.message.includes('atomics_error_getting_devlogger_extension') ||
         event.error.message.includes('__ATOMIC_EVENTS_DEV_LOGGER__') ||
         (event.error.message.includes('Blocked a frame with origin') && 
          event.error.message.includes('paypal.com')) ||
         (event.filename && event.filename.includes('paypal.com')))) {
      event.preventDefault();
      return true;
    }
  });
  
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && 
        (event.reason.message?.includes('geolocation') ||
         event.reason.message?.includes('DOMESTIC_TRANSACTION_REQUIRED') ||
         event.reason.message?.includes('atomics_error_getting_devlogger_extension') ||
         event.reason.message?.includes('__ATOMIC_EVENTS_DEV_LOGGER__') ||
         (event.reason.message?.includes('Blocked a frame with origin') && 
          event.reason.message?.includes('paypal.com')))) {
      event.preventDefault();
      return true;
    }
  });
})();
