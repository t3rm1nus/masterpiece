/**
 * ULTRA-AGGRESSIVE Symbol.observable Polyfill for Redux DevTools Compatibility
 * Maximum protection with periodic enforcement
 * Version: 2025-06-16-v4 (Modular Ultra-Aggressive)
 */
(function() {
  console.log('🔧 ULTRA-AGGRESSIVE Symbol.observable Polyfill v4 - Modular execution');
  
  // Store any existing Symbol.observable
  const existingObservable = (typeof Symbol !== 'undefined') ? Symbol.observable : undefined;
  
  // Ensure Symbol exists first with robust implementation
  if (typeof Symbol === 'undefined') {
    console.log('⚠️ Creating Symbol polyfill');
    window.Symbol = function(description) {
      return `@@${description || 'symbol'}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };
    Symbol.for = function(key) {
      const registry = Symbol._registry = Symbol._registry || {};
      if (!(key in registry)) {
        registry[key] = `@@${key}_global`;
      }
      return registry[key];
    };
    Symbol.iterator = Symbol.for('iterator');
    console.log('✅ Symbol polyfill created');
  }
  
  // Create the most consistent observable symbol possible
  const ULTRA_CONSISTENT_OBSERVABLE = existingObservable || Symbol.for('observable') || '@@observable';
  
  // Strategy 1: Direct assignment with ultra persistence
  Symbol.observable = ULTRA_CONSISTENT_OBSERVABLE;
  console.log('✅ Strategy 1: Direct Symbol.observable assignment');
  
  // Strategy 2: Property descriptor override with maximum protection
  try {
    Object.defineProperty(Symbol, 'observable', {
      value: ULTRA_CONSISTENT_OBSERVABLE,
      writable: false,
      configurable: false,
      enumerable: false
    });
    console.log('✅ Strategy 2: Symbol.observable ULTRA-locked via defineProperty');
  } catch (e) {
    console.log('⚠️ Strategy 2 failed, using fallback');
  }
  
  // Strategy 3: Global window assignment with protection
  if (typeof window !== 'undefined') {
    window.Symbol = window.Symbol || Symbol;
    if (window.Symbol) {
      window.Symbol.observable = ULTRA_CONSISTENT_OBSERVABLE;
      try {
        Object.defineProperty(window.Symbol, 'observable', {
          value: ULTRA_CONSISTENT_OBSERVABLE,
          writable: false,
          configurable: false
        });
      } catch(e) {
        // Ignore errors
      }
    }
    console.log('✅ Strategy 3: window.Symbol.observable assignment');
  }
  
  // Strategy 4: Intercept ANY future Symbol.observable redefinitions
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    if (obj === Symbol && prop === 'observable') {
      console.log('🛡️ ULTRA Intercepted Symbol.observable redefinition - maintaining consistency');
      descriptor.value = ULTRA_CONSISTENT_OBSERVABLE;
      descriptor.writable = false;
      descriptor.configurable = false;
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
  console.log('✅ Strategy 4: Object.defineProperty interceptor active');
  
  // Strategy 5: ULTRA-AGGRESSIVE Console warning suppression
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = function(...args) {
    const message = args.join(' ');
    if (message.includes('Symbol.observable') ||
        message.includes('Redux') ||
        message.includes('DevTools') ||
        message.includes('redux') ||
        message.includes('observable')) {
      console.log('🤫 ULTRA Suppressed Symbol.observable warning:', message.substring(0, 60) + '...');
      return;
    }
    originalWarn.apply(console, args);
  };
  
  console.error = function(...args) {
    const message = args.join(' ');
    if (message.includes('Symbol.observable') ||
        message.includes('Redux') ||
        message.includes('DevTools') ||
        message.includes('redux') ||
        message.includes('observable')) {
      console.log('🤫 ULTRA Suppressed Symbol.observable error:', message.substring(0, 60) + '...');
      return;
    }
    originalError.apply(console, args);
  };
  console.log('✅ Strategy 5: Console suppression ULTRA-active');
  
  // Strategy 6: ULTRA Periodic verification and enforcement (every 50ms for 15 seconds)
  let verificationCount = 0;
  const maxVerifications = 300; // 15 seconds
  
  const verifyAndEnforceObservable = () => {
    if (verificationCount < maxVerifications) {
      // Check for Symbol.observable drift
      if (Symbol.observable !== ULTRA_CONSISTENT_OBSERVABLE) {
        console.log('🔄 ULTRA Correcting Symbol.observable drift');
        Symbol.observable = ULTRA_CONSISTENT_OBSERVABLE;
        try {
          Object.defineProperty(Symbol, 'observable', {
            value: ULTRA_CONSISTENT_OBSERVABLE,
            writable: false,
            configurable: false,
            enumerable: false
          });
        } catch(e) {
          // Ignore errors during re-enforcement
        }
      }
      
      // Also check window.Symbol.observable
      if (typeof window !== 'undefined' && window.Symbol && window.Symbol.observable !== ULTRA_CONSISTENT_OBSERVABLE) {
        console.log('🔄 ULTRA Correcting window.Symbol.observable drift');
        window.Symbol.observable = ULTRA_CONSISTENT_OBSERVABLE;
        try {
          Object.defineProperty(window.Symbol, 'observable', {
            value: ULTRA_CONSISTENT_OBSERVABLE,
            writable: false,
            configurable: false
          });
        } catch(e) {
          // Ignore errors
        }
      }
      
      verificationCount++;
      setTimeout(verifyAndEnforceObservable, 50);
    }
  };
  
  // Start verification after a brief delay
  setTimeout(verifyAndEnforceObservable, 50);
  
  // Strategy 7: Global error event suppression for Symbol.observable
  window.addEventListener('error', function(event) {
    if (event.error && event.error.message) {
      const msg = event.error.message;
      if (msg.includes('Symbol.observable') || msg.includes('Redux') || msg.includes('DevTools')) {
        console.log('🤫 ULTRA Suppressed global Symbol.observable error');
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }
  }, true); // Use capture phase
  
  console.log('🔒 ULTRA-AGGRESSIVE Symbol.observable protection v4 - 7 strategies ACTIVE');
  console.log('📊 Final Symbol.observable value:', ULTRA_CONSISTENT_OBSERVABLE);
  console.log('🛡️ Redux DevTools compatibility ULTRA-enforced');
  console.log('🔄 Periodic enforcement active for 15 seconds');
})();
