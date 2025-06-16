/**
 * Minimal Console Filter - Safe Version (ULTRA-AGGRESSIVE)
 * Elimina mensajes de Symbol.observable, Redux, DevTools, geolocation y permisos en cualquier momento.
 */
(function() {
  var patterns = [
    'symbol.observable', 'redux', 'devtools', 'geolocation', 'paypal', 'permissions policy violation'
  ];
  function filterConsole(origFn) {
    return function() {
      var msg = Array.from(arguments).join(' ').toLowerCase();
      if (patterns.some(p => msg.includes(p))) return;
      return origFn.apply(console, arguments);
    };
  }
  console.warn = filterConsole(console.warn);
  console.error = filterConsole(console.error);
  // Reaplicar cada 2 segundos para scripts que sobrescriben console
  setInterval(function() {
    console.warn = filterConsole(console.warn);
    console.error = filterConsole(console.error);
  }, 2000);
})();
