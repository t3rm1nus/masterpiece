/**
 * Modular Movies Data Loader
 * Dynamic loader for movie subcategories - loads only what's needed
 * Inspired by the ultra-modular approach used in index.html scripts
 * 
 * This replaces the large datos_movies.json with a smart modular system
 */

class MoviesDataLoader {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
    this.manifestCache = null;
    
    console.log('🎬 MoviesDataLoader initialized');
  }

  /**
   * Load manifest (contains info about all available modules)
   */
  async loadManifest() {
    if (this.manifestCache) {
      return this.manifestCache;
    }

    try {
      const response = await fetch('/src/data/movies/manifest.json');
      if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.status}`);
      }
      
      this.manifestCache = await response.json();
      console.log(`📊 Manifest loaded: ${this.manifestCache.info.totalMovies} total movies`);
      console.log(`📂 Available subcategories: ${this.manifestCache.info.subcategories.join(', ')}`);
      
      return this.manifestCache;
    } catch (error) {
      console.error('❌ Error loading manifest:', error);
      throw error;
    }
  }

  /**
   * Load a specific subcategory (lazy loading)
   */
  async loadSubcategory(subcategory) {
    // Ensure manifest is loaded
    const manifest = await this.loadManifest();

    // Return cached data if available
    if (this.cache.has(subcategory)) {
      console.log(`🎯 Using cached data for: ${subcategory}`);
      return this.cache.get(subcategory);
    }

    // Return existing promise if already loading
    if (this.loading.has(subcategory)) {
      console.log(`⏳ Already loading: ${subcategory}`);
      return this.loading.get(subcategory);
    }

    // Validate subcategory exists
    if (!manifest.modules[subcategory]) {
      throw new Error(`❌ Subcategory '${subcategory}' not found. Available: ${manifest.info.subcategories.join(', ')}`);
    }

    // Load the module
    const loadPromise = this._loadModule(subcategory, manifest.modules[subcategory]);
    this.loading.set(subcategory, loadPromise);

    try {
      const data = await loadPromise;
      this.cache.set(subcategory, data);
      this.loading.delete(subcategory);
      return data;
    } catch (error) {
      this.loading.delete(subcategory);
      throw error;
    }
  }

  /**
   * Load multiple subcategories
   */
  async loadSubcategories(subcategories) {
    const promises = subcategories.map(sub => this.loadSubcategory(sub));
    const results = await Promise.all(promises);
    
    // Combine all recommendations
    const combined = {
      subcategories,
      count: 0,
      recommendations: []
    };
    
    results.forEach(result => {
      combined.count += result.count;
      combined.recommendations.push(...result.recommendations);
    });
    
    console.log(`🎬 Loaded ${combined.count} movies from ${subcategories.length} subcategories`);
    return combined;
  }

  /**
   * Load all movies (backward compatibility with original datos_movies.json format)
   */
  async loadAll() {
    console.log('🎬 Loading ALL movie subcategories...');
    const manifest = await this.loadManifest();
    const result = await this.loadSubcategories(manifest.info.subcategories);
    
    // Return in original format for backward compatibility
    return {
      recommendations: result.recommendations
    };
  }

  /**
   * Search movies by criteria (works with loaded subcategories)
   */
  async searchMovies(criteria) {
    const { subcategory, year, director, masterpiece } = criteria;
    
    let subcategoriesToLoad = [];
    
    if (subcategory) {
      subcategoriesToLoad = [subcategory];
    } else {
      const manifest = await this.loadManifest();
      subcategoriesToLoad = manifest.info.subcategories;
    }
    
    const data = await this.loadSubcategories(subcategoriesToLoad);
    let results = data.recommendations;
    
    // Apply filters
    if (year) {
      results = results.filter(movie => movie.year === year);
    }
    
    if (director) {
      results = results.filter(movie => 
        movie.director.toLowerCase().includes(director.toLowerCase())
      );
    }
    
    if (masterpiece !== undefined) {
      results = results.filter(movie => movie.masterpiece === masterpiece);
    }
    
    console.log(`🔍 Search found ${results.length} movies matching criteria`);
    return { recommendations: results };
  }

  /**
   * Get available subcategories
   */
  async getAvailableSubcategories() {
    const manifest = await this.loadManifest();
    return [...manifest.info.subcategories];
  }

  /**
   * Get manifest info
   */
  async getManifest() {
    const manifest = await this.loadManifest();
    return { ...manifest };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    this.manifestCache = null;
    console.log('🧹 Movies cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cachedSubcategories: Array.from(this.cache.keys()),
      loadingSubcategories: Array.from(this.loading.keys()),
      totalCached: this.cache.size
    };
  }

  /**
   * Private: Load module from file
   */
  async _loadModule(subcategory, moduleInfo) {
    const modulePath = `/src/data/movies/${moduleInfo.file}`;
    
    console.log(`📥 Loading: ${subcategory} from ${modulePath} (${moduleInfo.count} movies)`);
    
    try {
      const response = await fetch(modulePath);
      
      if (!response.ok) {
        throw new Error(`Failed to load ${modulePath}: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Loaded: ${subcategory} (${data.count} movies, ${Math.round(moduleInfo.size/1024)}KB)`);
      
      return data;
    } catch (error) {
      console.error(`❌ Error loading ${subcategory}:`, error);
      throw error;
    }
  }
}

// Create singleton instance
export const moviesLoader = new MoviesDataLoader();

// Export class for custom instances if needed
export { MoviesDataLoader };

// Default export for backward compatibility
export default moviesLoader;
