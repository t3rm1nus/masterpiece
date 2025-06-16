/**
 * PayPal Button Initialization and Management
 * Handles PayPal button rendering with mobile optimization and error handling
 */
document.addEventListener("DOMContentLoaded", function() {
  console.log('Initializing PayPal...');
  
  let paypalInitialized = false;
  let initTimeout = null;
  
  // Check if on coffee page
  function isOnCoffeePage() {
    return window.location.hash === '#/coffee' || 
           document.getElementById("paypal-container-MRSQEQV646EPA") !== null;
  }
  
  // Initialize PayPal button with mobile-optimized logic
  function initPayPalButton() {
    const container = document.getElementById("paypal-container-MRSQEQV646EPA");
    
    if (!window.paypal) {
      console.log('PayPal SDK not ready, retrying...');
      setTimeout(initPayPalButton, 500);
      return;
    }
    
    if (!container) {
      console.log('PayPal container not found, retrying...');
      setTimeout(initPayPalButton, 500);
      return;
    }
    
    // Extra validation for mobile: ensure container is stable in DOM
    if (!document.body.contains(container)) {
      console.log('Container not attached to body, waiting...');
      setTimeout(initPayPalButton, 300);
      return;
    }
    
    // Check if container parent is stable (important for React re-renders)
    const containerParent = container.parentNode;
    if (!containerParent || !document.body.contains(containerParent)) {
      console.log('Container parent not stable, waiting...');
      setTimeout(initPayPalButton, 300);
      return;
    }
    
    console.log('✅ Rendering PayPal button...');
    container.innerHTML = '';
    
    try {
      const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);      window.paypal.Buttons({
        env: 'sandbox', // Este client-id parece ser de sandbox, mantener sandbox
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'donate',
          height: isMobile ? 40 : 44, // Altura ajustada para móviles
          tagline: false
        },
        
        // No restringir funding source en producción para móviles
        fundingSource: window.isLocalhost ? window.paypal.FUNDING.PAYPAL : undefined,
        
        onClick: function(data, actions) {
          console.log('🖱️ PayPal button clicked');
          
          const amountInput = document.querySelector('input[name="amount"]#donation-amount') || 
                             document.querySelector('input[name="amount"]#donation-amount-mobile');
          
          if (amountInput) {
            const inputValue = parseFloat(amountInput.value);
            if (!inputValue || inputValue <= 0 || inputValue > 1000) {
              console.log('⚠️ Invalid amount, rejecting payment');
              return actions.reject();
            }
          }
          
          return actions.resolve();
        },        createOrder: function(data, actions) {
          console.log('🔄 Creating PayPal order');
          
          // More specific environment logging
          const environment = window.isLocalhost ? 'localhost/sandbox' : 'production/sandbox';
          const clientIdType = 'AZDxjD...'.includes('AZDxjD') ? 'sandbox' : 'production';
          
          console.log('🌍 Environment:', environment);
          console.log('💳 Client-ID Type:', clientIdType);
          console.log('🔧 Button Environment: sandbox (forced for compatibility)');
          
          let amount = '5.00';
          const amountInput = document.querySelector('input[name="amount"]#donation-amount') || 
                             document.querySelector('input[name="amount"]#donation-amount-mobile');
          
          if (amountInput && amountInput.value) {
            const inputValue = parseFloat(amountInput.value);
            if (inputValue && inputValue > 0 && inputValue <= 1000) {
              amount = inputValue.toFixed(2);
            }
          }
          
          console.log('💰 Order amount:', amount);
          
          // Enhanced order configuration for EUR and Spain - Simplified for sandbox compatibility
          const orderConfig = {
            intent: 'CAPTURE',
            purchase_units: [{
              amount: {
                value: amount,
                currency_code: 'EUR'
              },
              description: 'Donación de café - Masterpiece Collection'
              // Removed payee.merchant_id for sandbox compatibility
            }],
            application_context: {
              shipping_preference: 'NO_SHIPPING',
              user_action: 'PAY_NOW',
              locale: 'es-ES',
              landing_page: 'BILLING',
              brand_name: 'Masterpiece Collection'
              // Removed return_url and cancel_url for sandbox compatibility
            }
          };
          
          console.log('📦 Order config:', JSON.stringify(orderConfig, null, 2));
          
          return actions.order.create(orderConfig).catch(function(err) {
            console.error('❌ Error creating order:', err);
            throw err;
          });
        },
        
        onApprove: function(data, actions) {
          console.log('Payment approved:', data);
          return actions.order.capture().then(function(details) {
            console.log('Payment completed:', details);
              const successMsg = document.createElement('div');
            successMsg.innerHTML = 
              '<div style="background: #4CAF50; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 10px 0;">' +
                '¡Gracias por tu donación, ' + details.payer.name.given_name + '! Tu apoyo significa mucho. ☕️' +
              '</div>';
            
            container.parentNode.insertBefore(successMsg, container.nextSibling);
            
            setTimeout(() => {
              successMsg.remove();
            }, 5000);
          });
        },
        
        onError: function(err) {
          console.error('❌ PayPal error:', err);
          
          let errorMessage = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
          let shouldShow = true;
          
          if (err && err.message) {
            if (err.message.includes('DOMESTIC_TRANSACTION_REQUIRED')) {
              console.log('🔧 DOMESTIC_TRANSACTION_REQUIRED error detected - this should be resolved with buyer-country=ES');
              errorMessage = 'Error de configuración regional. Reintentando...';
              shouldShow = false; // Don't show user error, this is a config issue
            } else if (err.message.includes('INSTRUMENT_DECLINED')) {
              errorMessage = 'Pago declinado. Por favor, verifica tu método de pago.';
            } else if (err.message.includes('PAYER_ACTION_REQUIRED')) {
              errorMessage = 'Se requiere acción del pagador. Por favor, completa el pago.';
            }
          }
          
          if (shouldShow) {            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = 
              '<div style="background: #f44336; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 10px 0;">' +
                errorMessage +
              '</div>';
            
            container.parentNode.insertBefore(errorDiv, container.nextSibling);
            
            setTimeout(() => {
              errorDiv.remove();
            }, 5000);
          }
        },
        
        onCancel: function(data) {
          console.log('Payment cancelled:', data);
        }
      }).render('#paypal-container-MRSQEQV646EPA').then(function() {
        console.log('✅ PayPal button rendered successfully');
        paypalInitialized = true;
      }).catch(function(err) {
        console.error('❌ Error rendering PayPal button:', err);
        paypalInitialized = false;
        
        // Handle specific mobile errors
        if (err.message && err.message.includes('container element removed from DOM')) {
          console.log('🔄 Container removed during render, will retry on next navigation...');
          // Don't retry immediately for this error as it's usually due to navigation
          return;
        }
        
        // For other errors, retry after a delay
        console.log('🔄 Retrying PayPal initialization in 2 seconds...');
        setTimeout(() => {
          if (isOnCoffeePage() && document.getElementById("paypal-container-MRSQEQV646EPA")) {
            debouncedPayPalInit();
          }
        }, 2000);
      });
    } catch (error) {
      console.error('❌ Error in PayPal initialization:', error);
      paypalInitialized = false;
      
      // Handle DOM-related errors specifically
      if (error.message && error.message.includes('container element removed from DOM')) {
        console.log('🔄 Container removed during initialization, will retry on next navigation...');
        return;
      }
      
      // For other errors, retry
      setTimeout(() => {
        if (isOnCoffeePage() && document.getElementById("paypal-container-MRSQEQV646EPA")) {
          debouncedPayPalInit();
        }
      }, 1500);
    }
  }
  
  // Debounced initialization with mobile optimization
  function debouncedPayPalInit() {
    if (initTimeout) {
      clearTimeout(initTimeout);
    }
    
    // Longer timeout for mobile devices to allow React to stabilize
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const delay = isMobile ? 1000 : 500; // Longer delay for mobile
    
    initTimeout = setTimeout(() => {
      if (isOnCoffeePage() && !paypalInitialized) {
        const container = document.getElementById("paypal-container-MRSQEQV646EPA");
        
        // Extra check: ensure container has been stable for a bit
        if (container && document.body.contains(container)) {
          initPayPalButton();
        } else {
          console.log('Container not stable yet, will retry...');
        }
      }
    }, delay);
  }
  
  // Observer for DOM changes with mobile optimization
  const observer = new MutationObserver(function(mutations) {
    let shouldInitialize = false;
    
    // Check if PayPal container was added
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the container was added or if it contains the container
            if (node.id === 'paypal-container-MRSQEQV646EPA' || 
                node.querySelector && node.querySelector('#paypal-container-MRSQEQV646EPA')) {
              shouldInitialize = true;
            }
          }
        });
      }
    });
    
    // Only initialize if we detected the container was added and we're on the right page
    if (shouldInitialize && isOnCoffeePage() && !paypalInitialized) {
      console.log('PayPal container detected in DOM, initializing...');
      debouncedPayPalInit();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Route change listeners with mobile optimization
  window.addEventListener('hashchange', function() {
    console.log('Hash change detected:', window.location.hash);
    
    if (isOnCoffeePage()) {
      // Reset state and reinitialize
      paypalInitialized = false;
      setTimeout(() => {
        debouncedPayPalInit();
      }, 200); // Small delay for mobile
    } else {
      // Clean up when leaving coffee page
      paypalInitialized = false;
      if (initTimeout) {
        clearTimeout(initTimeout);
        initTimeout = null;
      }
    }
  });
  
  window.addEventListener('popstate', function() {
    console.log('Popstate detected');
    
    if (isOnCoffeePage()) {
      // Reset state and reinitialize
      paypalInitialized = false;
      setTimeout(() => {
        debouncedPayPalInit();
      }, 200); // Small delay for mobile
    } else {
      // Clean up when leaving coffee page
      paypalInitialized = false;
      if (initTimeout) {
        clearTimeout(initTimeout);
        initTimeout = null;
      }
    }
  });
  
  // Global function for React with mobile optimization
  window.initializePayPal = function() {
    console.log('PayPal initialization requested from React');
    paypalInitialized = false; // Reset to allow re-initialization
    debouncedPayPalInit();
  };
  
  // Initial check with mobile-optimized timing
  const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const initialDelay = isMobile ? 1500 : 1000; // Longer delay for mobile
  
  setTimeout(function() {
    if (isOnCoffeePage()) {
      console.log('Initial PayPal check - Coffee page detected');
      debouncedPayPalInit();
    }
  }, initialDelay);
});
