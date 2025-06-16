/**
 * Movie Data Modularizer - Simple CommonJS version
 * Splits large movies JSON into modular subcategory files
 */

const fs = require('fs');
const path = require('path');

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
    
    console.log('🎉 Movies data modularization completed!');
    console.log(`📈 Reduced from 1 large file (221KB) to ${Object.keys(subcategoryGroups).length} modular files`);
    
    return moduleManifest;
    
  } catch (error) {
    console.error('❌ Error during modularization:', error);
    throw error;
  }
}

// Run the modularization
modularizeMoviesData().catch(console.error);
