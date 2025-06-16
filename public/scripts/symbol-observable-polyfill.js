/**
 * Ultra-aggressive Symbol.observable Polyfill for Redux DevTools Compatibility
 * Prevents Redux DevTools warnings about Symbol.observable mismatch
 * Version: 2025-06-16-v3 (Maximum compatibility)
 */
(function() {
  console.log('🔧 Symbol.observable Ultra-Polyfill v3 - Initializing...');
  
  // Store any existing Symbol.observable
  const existingObservable = (typeof Symbol !== 'undefined') ? Symbol.observable : undefined;
  
  // Ensure Symbol exists first
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
  }
  
  // Create a consistent observable symbol
  const CONSISTENT_OBSERVABLE = existingObservable || Symbol.for('observable') || '@@observable';
  
  // Multiple strategies to ensure Symbol.observable is consistent
  
  // Strategy 1: Direct assignment
  Symbol.observable = CONSISTENT_OBSERVABLE;
  
  // Strategy 2: Property descriptor override
  try {
    Object.defineProperty(Symbol, 'observable', {
      value: CONSISTENT_OBSERVABLE,
      writable: false,
      configurable: false,
      enumerable: false
    });
    console.log('✅ Symbol.observable locked via defineProperty');
  } catch (e) {
    console.log('⚠️ defineProperty failed, using direct assignment');
  }
  
  // Strategy 3: Global window assignment
  if (typeof window !== 'undefined') {
    window.Symbol = window.Symbol || Symbol;
    if (window.Symbol) {
      window.Symbol.observable = CONSISTENT_OBSERVABLE;
    }
  }
  
  // Strategy 4: Intercept any future Symbol.observable redefinitions
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    if (obj === Symbol && prop === 'observable') {
      console.log('🛡️ Intercepted Symbol.observable redefinition attempt - maintaining consistency');
      descriptor.value = CONSISTENT_OBSERVABLE;
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
  
  // Strategy 5: Periodic verification (for persistent apps)
  let verificationCount = 0;
  const verifyObservable = () => {
    if (verificationCount < 5 && Symbol.observable !== CONSISTENT_OBSERVABLE) {
      console.log('🔄 Correcting Symbol.observable drift');
      Symbol.observable = CONSISTENT_OBSERVABLE;
      verificationCount++;
      setTimeout(verifyObservable, 100);
    }
  };
  setTimeout(verifyObservable, 50);
  
  console.log('🔒 Symbol.observable ultra-protection activated:', CONSISTENT_OBSERVABLE);
  console.log('📊 Final Symbol.observable value:', Symbol.observable);
})();
