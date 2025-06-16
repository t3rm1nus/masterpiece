/**
 * ULTRA-AGGRESSIVE Geolocation Override for Spain
 * Maximum suppression with periodic enforcement
 * Version: 2025-06-16-v4 (Modular Ultra-Aggressive)
 */
(function() {
  console.log('🔒 ULTRA-AGGRESSIVE Geolocation Override v4 - Modular execution');
  
  // Mock coordinates for Madrid, Spain
  const madridCoords = {
    latitude: 40.4168,
    longitude: -3.7038,
    altitude: 650,
    accuracy: 10,
    altitudeAccuracy: 5,
    heading: null,
    speed: null
  };
  
  const mockPosition = {
    coords: madridCoords,
    timestamp: Date.now()
  };
  
  const mockGeo = {
    getCurrentPosition: function(success, error, options) {
      console.log('🇪🇸 ULTRA Mock v4: Madrid, Spain');
      if (success) {
        setTimeout(() => success(mockPosition), 1);
      }
      return;
    },
    watchPosition: function(success, error, options) {
      console.log('🔄 ULTRA Watch v4: Madrid, Spain');
      if (success) {
        setTimeout(() => success(mockPosition), 1);
      }
      return Math.floor(Math.random() * 1000);
    },
    clearWatch: function() {
      console.log('🛑 ULTRA clearWatch v4');
    }
  };
  
  // Strategy 1: Immediate navigator override with ultra protection
  try {
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeo,
      writable: false,
      configurable: false,
      enumerable: true
    });
    console.log('✅ Strategy 1: navigator.geolocation ULTRA-locked');
  } catch(e) {
    navigator.geolocation = mockGeo;
    console.log('✅ Strategy 1 fallback: Direct assignment');
  }
  
  // Strategy 2: Window-level override with ultra protection
  try {
    Object.defineProperty(window.navigator, 'geolocation', {
      value: mockGeo,
      writable: false,
      configurable: false,
      enumerable: true
    });
    console.log('✅ Strategy 2: window.navigator.geolocation ULTRA-locked');
  } catch(e) {
    window.navigator.geolocation = mockGeo;
    console.log('✅ Strategy 2 fallback: Direct assignment');
  }
  
  // Strategy 3: ULTRA-AGGRESSIVE Console warning suppression
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = function(...args) {
    const message = args.join(' ');
    if (message.includes('geolocation') || 
        message.includes('Potential permissions policy violation') ||
        message.includes('permissions policy')) {
      console.log('🤫 ULTRA Suppressed geolocation warning:', message.substring(0, 50) + '...');
      return;
    }
    originalWarn.apply(console, args);
  };
  
  console.error = function(...args) {
    const message = args.join(' ');
    if (message.includes('geolocation') || 
        message.includes('permissions policy') ||
        message.includes('Potential permissions policy violation')) {
      console.log('🤫 ULTRA Suppressed geolocation error:', message.substring(0, 50) + '...');
      return;
    }
    originalError.apply(console, args);
  };
  
  // Strategy 4: Global error event suppression with ultra capture
  window.addEventListener('error', function(event) {
    if (event.error && event.error.message) {
      const msg = event.error.message;
      if (msg.includes('geolocation') || msg.includes('permissions policy')) {
        console.log('🤫 ULTRA Suppressed global geolocation error');
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    }
  }, true); // Use capture phase for maximum interception
  
  // Strategy 5: Permissions API override (ultra prevention)
  if (navigator.permissions && navigator.permissions.query) {
    const originalQuery = navigator.permissions.query;
    navigator.permissions.query = function(permissionDesc) {
      if (permissionDesc.name === 'geolocation') {
        console.log('🛡️ ULTRA Intercepted geolocation permission query - returning granted');
        return Promise.resolve({ state: 'granted', name: 'geolocation' });
      }
      return originalQuery.call(this, permissionDesc);
    };
    console.log('✅ Strategy 5: Permissions API ULTRA-intercepted');
  }
  
  // Strategy 6: ULTRA Periodic enforcement (every 100ms for 10 seconds)
  let enforcementCount = 0;
  const maxEnforcements = 100; // 10 seconds
  
  const enforceGeolocation = () => {
    if (enforcementCount < maxEnforcements) {
      // Check if geolocation has been overridden
      if (navigator.geolocation !== mockGeo) {
        console.log('🔄 ULTRA Re-enforcing geolocation override');
        try {
          Object.defineProperty(navigator, 'geolocation', {
            value: mockGeo,
            writable: false,
            configurable: false,
            enumerable: true
          });
        } catch(e) {
          navigator.geolocation = mockGeo;
        }
      }
      
      // Also check window.navigator
      if (window.navigator.geolocation !== mockGeo) {
        console.log('🔄 ULTRA Re-enforcing window.navigator.geolocation override');
        try {
          Object.defineProperty(window.navigator, 'geolocation', {
            value: mockGeo,
            writable: false,
            configurable: false,
            enumerable: true
          });
        } catch(e) {
          window.navigator.geolocation = mockGeo;
        }
      }
      
      enforcementCount++;
      setTimeout(enforceGeolocation, 100);
    }
  };
  
  // Start enforcement after a brief delay
  setTimeout(enforceGeolocation, 100);
  
  console.log('🔒 ULTRA-AGGRESSIVE Geolocation Override v4 - 6 strategies ACTIVE');
  console.log('🇪🇸 All geolocation requests locked to Madrid, Spain coordinates');
  console.log('🤫 Geolocation warnings and errors ULTRA-suppressed');
  console.log('🔄 Periodic enforcement active for 10 seconds');
})();
