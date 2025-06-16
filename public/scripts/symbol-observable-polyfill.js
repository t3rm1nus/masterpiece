/**
 * Enhanced Symbol.observable polyfill for Redux compatibility - v2
 * Ensures consistent Symbol.observable across Redux and DevTools
 */
(function() {
  console.log('🔧 Setting up Symbol.observable polyfill v2...');
  
  // Early override to prevent Redux DevTools mismatch
  if (typeof window !== 'undefined') {
    // Store original if exists
    const originalSymbol = window.Symbol;
    
    // Create consistent Symbol implementation
    if (typeof Symbol === 'undefined') {
      console.log('⚠️ Symbol not found, creating implementation');
      window.Symbol = function(description) {
        return '@@' + (description || 'symbol') + Math.random();
      };
      Symbol.for = function(key) {
        return '@@' + key;
      };
    }
    
    // Force consistent observable symbol - BEFORE any other scripts
    const OBSERVABLE_SYMBOL = '@@observable';
    
    // Override Symbol.observable consistently
    if (typeof Symbol.for === 'function') {
      Symbol.observable = Symbol.for('observable');
    } else {
      Symbol.observable = OBSERVABLE_SYMBOL;
    }
    
    // Also set on window for global access
    window.Symbol = window.Symbol || Symbol;
    if (window.Symbol) {
      window.Symbol.observable = Symbol.observable;
    }
    
    // Prevent any future changes
    try {
      Object.defineProperty(Symbol, 'observable', {
        value: Symbol.observable,
        writable: false,
        configurable: false
      });
    } catch(e) {
      // Fallback if defineProperty fails
      Symbol.observable = Symbol.observable;
    }
    
    console.log('✅ Symbol.observable v2 locked:', Symbol.observable);
  }
})();
