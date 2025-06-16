/**
 * PayPal Button Initialization - Minimal Safe Version + Debug Logs
 * Añade logs para depuración en producción móvil
 */
document.addEventListener("DOMContentLoaded", function() {
  var container = document.getElementById("paypal-container-MRSQEQV646EPA");
  if (!container) {
    console.warn('[PayPal] Contenedor no encontrado: #paypal-container-MRSQEQV646EPA');
    return;
  }
  if (!window.paypal) {
    console.warn('[PayPal] window.paypal no está disponible al inicializar.');
    return;
  }
  try {
    console.log('[PayPal] Inicializando botones en', container, 'window.paypal:', !!window.paypal);
    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay', height: 45, tagline: false },
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{ amount: { value: '5.00', currency_code: 'EUR' }, description: 'Café Virtual - Masterpiece Collection' }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert('¡Gracias por tu apoyo! Transacción completada.');
        });
      },
      onError: function(err) {
        console.log('PayPal error:', err);
      },
      onCancel: function(data) {
        console.log('PayPal payment cancelled');
      }
    }).render('#paypal-container-MRSQEQV646EPA');
  } catch (e) {
    console.log('PayPal init error:', e);
  }
});

// Exponer la función de inicialización globalmente para los componentes React
window.initializePayPal = function() {
  var container = document.getElementById("paypal-container-MRSQEQV646EPA");
  if (!container) {
    console.warn('[PayPal] (global) Contenedor no encontrado: #paypal-container-MRSQEQV646EPA');
    return;
  }
  if (!window.paypal) {
    console.warn('[PayPal] (global) window.paypal no está disponible al inicializar.');
    return;
  }
  try {
    console.log('[PayPal] (global) Inicializando botones en', container, 'window.paypal:', !!window.paypal);
    window.paypal.Buttons({
      style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay', height: 45, tagline: false },
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{ amount: { value: '5.00', currency_code: 'EUR' }, description: 'Café Virtual - Masterpiece Collection' }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert('¡Gracias por tu apoyo! Transacción completada.');
        });
      },
      onError: function(err) {
        console.log('PayPal error:', err);
      },
      onCancel: function(data) {
        console.log('PayPal payment cancelled');
      }
    }).render('#paypal-container-MRSQEQV646EPA');
  } catch (e) {
    console.log('PayPal init error:', e);
  }
};
