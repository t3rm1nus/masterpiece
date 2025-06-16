/**
 * PayPal Button Initialization - Minimal Safe Version
 * Corrige error de sintaxis y asegura funcionamiento básico en producción
 */
document.addEventListener("DOMContentLoaded", function() {
  var container = document.getElementById("paypal-container-MRSQEQV646EPA");
  if (!container || !window.paypal) return;
  try {
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
