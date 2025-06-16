/**
 * Enhanced Symbol.observable polyfill for Redux compatibility
 * Ensures consistent Symbol.observable across Redux and DevTools
 */
(function() {
  console.log('🔧 Setting up Symbol.observable polyfill...');
  
  // Check if Symbol exists
  if (typeof Symbol === 'undefined') {
    console.log('⚠️ Symbol not found, creating basic implementation');
    window.Symbol = function(description) {
      return '@@' + (description || 'symbol') + Math.random();
    };
    Symbol.for = function(key) {
      return '@@' + key;
    };
  }
  
  // Define the observable symbol consistently
  const observableSymbol = typeof Symbol === 'function' && Symbol.observable || '@@observable';
  
  // Ensure Symbol.observable is set consistently
  if (!Symbol.observable) {
    if (typeof Symbol.for === 'function') {
      Symbol.observable = Symbol.for('observable');
    } else {
      Symbol.observable = observableSymbol;
    }
  }
  
  // Ensure it's the same reference for Redux compatibility
  if (typeof Symbol.observable === 'string' && typeof Symbol.for === 'function') {
    Symbol.observable = Symbol.for('observable');
  }
  
  console.log('✅ Symbol.observable configured consistently:', Symbol.observable);
  
  // Also set on window for compatibility
  window.Symbol = window.Symbol || Symbol;
  if (window.Symbol && !window.Symbol.observable) {
    window.Symbol.observable = Symbol.observable;
  }
})();
