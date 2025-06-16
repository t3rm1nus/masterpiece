/**
 * Geolocation Override for Spain
 * Forces geolocation to Madrid coordinates to prevent policy violations
 */
(function() {
  console.log('🔒 Overriding geolocation API immediately...');
  
  const mockGeo = {
    getCurrentPosition: function(success, error, options) {
      console.log('🇪🇸 FORCED Mock: Madrid, Spain');
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
        setTimeout(() => success(position), 10);
      }
    },
    watchPosition: function(success, error, options) {
      this.getCurrentPosition(success, error, options);
      return Math.floor(Math.random() * 1000);
    },
    clearWatch: function() {}
  };
  
  // Force override navigator.geolocation
  try {
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeo,
      writable: false,
      configurable: false
    });
  } catch(e) {
    navigator.geolocation = mockGeo;
  }
  
  // Also override window.navigator.geolocation
  try {
    Object.defineProperty(window.navigator, 'geolocation', {
      value: mockGeo,
      writable: false,
      configurable: false
    });
  } catch(e) {
    window.navigator.geolocation = mockGeo;
  }
  
  console.log('✅ Geolocation FORCED override active');
})();
