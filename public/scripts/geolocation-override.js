/**
 * Geolocation Override for Spain - v2
 * Forces geolocation to Madrid coordinates to prevent policy violations
 */
(function() {
  console.log('🔒 Overriding geolocation API immediately v2...');
  
  const mockGeo = {
    getCurrentPosition: function(success, error, options) {
      console.log('🇪🇸 FORCED Mock v2: Madrid, Spain');
      if (success) {
        const position = {
          coords: {
            latitude: 40.4168,
            longitude: -3.7038,
            altitude: 650,
            accuracy: 10,
            altitudeAccuracy: 5,
            heading: null,
            speed: null
          },
          timestamp: Date.now()
        };
        setTimeout(() => success(position), 5); // Faster response
      }
    },
    watchPosition: function(success, error, options) {
      this.getCurrentPosition(success, error, options);
      return Math.floor(Math.random() * 1000);
    },
    clearWatch: function() {}
  };
  
  // AGGRESSIVE override - multiple approaches
  
  // Approach 1: Direct override
  if (navigator && navigator.geolocation) {
    try {
      Object.defineProperty(navigator, 'geolocation', {
        value: mockGeo,
        writable: false,
        configurable: false
      });
    } catch(e) {
      navigator.geolocation = mockGeo;
    }
  }
  
  // Approach 2: Window navigator override
  if (window.navigator) {
    try {
      Object.defineProperty(window.navigator, 'geolocation', {
        value: mockGeo,
        writable: false,
        configurable: false
      });
    } catch(e) {
      window.navigator.geolocation = mockGeo;
    }
  }
  
  // Approach 3: Prevent future overrides
  if (typeof navigator === 'undefined') {
    window.navigator = { geolocation: mockGeo };
  }
  
  // Approach 4: Global fallback
  window.geolocation = mockGeo;
  
  console.log('✅ Geolocation FORCED override v2 active');
})();
