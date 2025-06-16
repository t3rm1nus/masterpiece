/**
 * Movie Data Modularizer - Splits large movies JSON into modular subcategory files
 * Inspired by the index.html modularization approach for maintainability
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const sourceFile = path.join(__dirname, '..', 'datos_movies.json');
const outputDir = path.join(__dirname, '..', 'data', 'movies');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function modularizeMoviesData() {
  try {
    console.log('🎬 Starting movies data modularization...');
    
    // Read the large movies file
    const moviesData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
    const recommendations = moviesData.recommendations;
    
    console.log(`📊 Total movies found: ${recommendations.length}`);
    
    // Group by subcategory
    const subcategoryGroups = {};
    const subcategoryCounts = {};
    
    recommendations.forEach(movie => {
      const subcategory = movie.subcategory;
      
      if (!subcategoryGroups[subcategory]) {
        subcategoryGroups[subcategory] = [];
        subcategoryCounts[subcategory] = 0;
      }
      
      subcategoryGroups[subcategory].push(movie);
      subcategoryCounts[subcategory]++;
    });
    
    console.log('📂 Subcategories found:');
    Object.entries(subcategoryCounts).forEach(([sub, count]) => {
      console.log(`  - ${sub}: ${count} movies`);
    });
    
    // Create modular files for each subcategory
    const moduleManifest = {
      info: {
        generatedAt: new Date().toISOString(),
        totalMovies: recommendations.length,
        subcategories: Object.keys(subcategoryGroups).sort()
      },
      modules: {}
    };
    
    for (const [subcategory, movies] of Object.entries(subcategoryGroups)) {
      const moduleData = {
        subcategory,
        count: movies.length,
        recommendations: movies
      };
      
      const moduleFileName = `movies-${subcategory}.json`;
      const moduleFilePath = path.join(outputDir, moduleFileName);
      
      fs.writeFileSync(moduleFilePath, JSON.stringify(moduleData, null, 2));
      
      moduleManifest.modules[subcategory] = {
        file: moduleFileName,
        count: movies.length,
        size: fs.statSync(moduleFilePath).size
      };
      
      console.log(`✅ Created: ${moduleFileName} (${movies.length} movies)`);
    }
    
    // Create manifest file
    const manifestPath = path.join(outputDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(moduleManifest, null, 2));
    console.log('📋 Created: manifest.json');
    
    // Create the modular loader
    const loaderContent = createModularLoader(moduleManifest);
    const loaderPath = path.join(__dirname, '..', 'data', 'moviesLoader.js');
    fs.writeFileSync(loaderPath, loaderContent);
    console.log('🔄 Created: moviesLoader.js');
    
    console.log('🎉 Movies data modularization completed!');
    console.log(`📈 Reduced from 1 large file (221KB) to ${Object.keys(subcategoryGroups).length} modular files`);
    
    return moduleManifest;
    
  } catch (error) {
    console.error('❌ Error during modularization:', error);
    throw error;
  }
}

function createModularLoader(manifest) {
  return `/**
 * Modular Movies Data Loader
 * Dynamic loader for movie subcategories - loads only what's needed
 * Inspired by the ultra-modular approach used in index.html scripts
 * 
 * Generated on: ${manifest.info.generatedAt}
 * Total movies: ${manifest.info.totalMovies}
 * Subcategories: ${manifest.info.subcategories.length}
 */

class MoviesDataLoader {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
    this.manifest = ${JSON.stringify(manifest, null, 4)};
    
    console.log('🎬 MoviesDataLoader initialized');
    console.log(\`📊 Available subcategories: \${this.manifest.info.subcategories.join(', ')}\`);
  }

  /**
   * Load a specific subcategory (lazy loading)
   */
  async loadSubcategory(subcategory) {
    // Return cached data if available
    if (this.cache.has(subcategory)) {
      console.log(\`🎯 Using cached data for: \${subcategory}\`);
      return this.cache.get(subcategory);
    }

    // Return existing promise if already loading
    if (this.loading.has(subcategory)) {
      console.log(\`⏳ Already loading: \${subcategory}\`);
      return this.loading.get(subcategory);
    }

    // Validate subcategory exists
    if (!this.manifest.modules[subcategory]) {
      throw new Error(\`❌ Subcategory '\${subcategory}' not found. Available: \${this.manifest.info.subcategories.join(', ')}\`);
    }

    // Load the module
    const loadPromise = this._loadModule(subcategory);
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
    
    console.log(\`🎬 Loaded \${combined.count} movies from \${subcategories.length} subcategories\`);
    return combined;
  }

  /**
   * Load all movies (fallback to original behavior)
   */
  async loadAll() {
    console.log('🎬 Loading ALL movie subcategories...');
    return this.loadSubcategories(this.manifest.info.subcategories);
  }

  /**
   * Get available subcategories
   */
  getAvailableSubcategories() {
    return [...this.manifest.info.subcategories];
  }

  /**
   * Get manifest info
   */
  getManifest() {
    return { ...this.manifest };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    console.log('🧹 Movies cache cleared');
  }

  /**
   * Private: Load module from file
   */
  async _loadModule(subcategory) {
    const moduleInfo = this.manifest.modules[subcategory];
    const modulePath = \`/src/data/movies/\${moduleInfo.file}\`;
    
    console.log(\`📥 Loading: \${subcategory} from \${modulePath}\`);
    
    try {
      const response = await fetch(modulePath);
      
      if (!response.ok) {
        throw new Error(\`Failed to load \${modulePath}: \${response.status} \${response.statusText}\`);
      }
      
      const data = await response.json();
      console.log(\`✅ Loaded: \${subcategory} (\${data.count} movies)\`);
      
      return data;
    } catch (error) {
      console.error(\`❌ Error loading \${subcategory}:\`, error);
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
`;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  modularizeMoviesData().catch(console.error);
}

export { modularizeMoviesData };
