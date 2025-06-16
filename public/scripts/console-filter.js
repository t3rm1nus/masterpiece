/**
 * Minimal Console Filter - Safe Version
 * Elimina solo mensajes de Symbol.observable, Redux, geolocation y PayPal sin recursión.
 */
(function() {
  var patterns = [
    'symbol.observable', 'redux', 'devtools', 'geolocation', 'paypal', 'permissions policy violation'
  ];
  var origWarn = console.warn;
  var origError = console.error;
  console.warn = function() {
    var msg = Array.from(arguments).join(' ').toLowerCase();
    if (patterns.some(p => msg.includes(p))) return;
    origWarn.apply(console, arguments);
  };
  console.error = function() {
    var msg = Array.from(arguments).join(' ').toLowerCase();
    if (patterns.some(p => msg.includes(p))) return;
    origError.apply(console, arguments);
  };
})();
