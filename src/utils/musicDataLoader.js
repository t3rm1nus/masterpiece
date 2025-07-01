// Utilidad para cargar datos de música divididos en chunks
export class MusicDataLoader {
  static async loadAllMusicData() {
    try {
      // Primero cargar el índice para saber qué chunks cargar
      const indexResponse = await fetch('/src/data/music-chunks/index.json');
      const indexData = await indexResponse.json();
      
      // Cargar todos los chunks en paralelo
      const chunkPromises = indexData.chunks.map(async (chunkInfo) => {
        const response = await fetch(`/src/data/music-chunks/${chunkInfo.fileName}`);
        return response.json();
      });
      
      const chunks = await Promise.all(chunkPromises);
      
      // Combinar todos los chunks en un solo array
      const allRecommendations = chunks.reduce((acc, chunk) => {
        return acc.concat(chunk.recommendations);
      }, []);
      
      console.log(`✅ Loaded ${allRecommendations.length} music recommendations from ${chunks.length} chunks`);
      
      return {
        recommendations: allRecommendations,
        metadata: {
          totalItems: indexData.totalItems,
          totalChunks: indexData.totalChunks,
          chunkSize: indexData.chunkSize,
          loadedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Error loading music data:', error);
      
      // Fallback: intentar cargar el archivo original
      try {
        console.log('🔄 Attempting to load from original file as fallback...');
        const response = await fetch('/src/data/datos_music.json');
        const data = await response.json();
        console.log(`⚠️ Loaded ${data.recommendations.length} recommendations from original file`);
        return data;
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        throw new Error('Failed to load music data from both chunked and original sources');
      }
    }
  }
  
  // Método para cargar un chunk específico
  static async loadMusicChunk(chunkNumber) {
    try {
      const response = await fetch(`/src/data/music-chunks/music-chunk-${chunkNumber}.json`);
      const data = await response.json();
      console.log(`✅ Loaded chunk ${chunkNumber} with ${data.recommendations.length} items`);
      return data;
    } catch (error) {
      console.error(`❌ Error loading chunk ${chunkNumber}:`, error);
      throw error;
    }
  }
  
  // Método para obtener información de los chunks
  static async getChunksInfo() {
    try {
      const response = await fetch('/src/data/music-chunks/index.json');
      return await response.json();
    } catch (error) {
      console.error('❌ Error loading chunks info:', error);
      throw error;
    }
  }
  
  // Método para cargar chunks de forma lazy (bajo demanda)
  static async loadMusicDataLazy() {
    const chunksInfo = await this.getChunksInfo();
    
    return {
      async getAllRecommendations() {
        return (await MusicDataLoader.loadAllMusicData()).recommendations;
      },
      
      async getChunk(chunkNumber) {
        return await MusicDataLoader.loadMusicChunk(chunkNumber);
      },
      
      async getRecommendationById(id) {
        // Buscar en qué chunk está el ID
        for (const chunkInfo of chunksInfo.chunks) {
          if (id >= chunkInfo.startId && id <= chunkInfo.endId) {
            const chunk = await MusicDataLoader.loadMusicChunk(
              chunksInfo.chunks.indexOf(chunkInfo) + 1
            );
            return chunk.recommendations.find(item => item.id === id);
          }
        }
        return null;
      },
      
      getMetadata() {
        return {
          totalItems: chunksInfo.totalItems,
          totalChunks: chunksInfo.totalChunks,
          chunkSize: chunksInfo.chunkSize,
          chunks: chunksInfo.chunks
        };
      }
    };
  }
}
