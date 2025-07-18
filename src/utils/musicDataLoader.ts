// Utilidad para cargar datos de música divididos en chunks

interface MusicRecommendation {
  id: number;
  [key: string]: any;
}

interface MusicChunk {
  recommendations: MusicRecommendation[];
}

interface ChunkInfo {
  fileName: string;
  startId: number;
  endId: number;
}

interface ChunksIndex {
  chunks: ChunkInfo[];
  totalItems: number;
  totalChunks: number;
  chunkSize: number;
}

interface AllMusicData {
  recommendations: MusicRecommendation[];
  metadata: {
    totalItems: number;
    totalChunks: number;
    chunkSize: number;
    loadedAt: string;
  };
}

export class MusicDataLoader {
  static async loadAllMusicData(): Promise<AllMusicData | any> {
    try {
      const indexResponse = await fetch('/data/music-chunks/index.json');
      const indexData: ChunksIndex = await indexResponse.json();
      const chunkPromises = indexData.chunks.map(async (chunkInfo) => {
        const response = await fetch(`/data/music-chunks/${chunkInfo.fileName}`);
        return response.json() as Promise<MusicChunk>;
      });
      const chunks: MusicChunk[] = await Promise.all(chunkPromises);
      const allRecommendations = chunks.reduce<MusicRecommendation[]>((acc, chunk) => {
        return acc.concat(chunk.recommendations);
      }, []);
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
      try {
        console.log('🔄 Attempting to load from original file as fallback...');
        const response = await fetch('/data/datos_music.json');
        const data = await response.json();
        console.log(`⚠️ Loaded ${data.recommendations.length} recommendations from original file`);
        return data;
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        throw new Error('Failed to load music data from both chunked and original sources');
      }
    }
  }

  static async loadMusicChunk(chunkNumber: number): Promise<MusicChunk> {
    try {
      const response = await fetch(`/data/music-chunks/music-chunk-${chunkNumber}.json`);
      const data: MusicChunk = await response.json();
      return data;
    } catch (error) {
      console.error(`❌ Error loading chunk ${chunkNumber}:`, error);
      throw error;
    }
  }

  static async getChunksInfo(): Promise<ChunksIndex> {
    try {
      const response = await fetch('/data/music-chunks/index.json');
      return await response.json();
    } catch (error) {
      console.error('❌ Error loading chunks info:', error);
      throw error;
    }
  }

  static async loadMusicDataLazy() {
    const chunksInfo: ChunksIndex = await this.getChunksInfo();
    return {
      async getAllRecommendations(): Promise<MusicRecommendation[]> {
        return (await MusicDataLoader.loadAllMusicData()).recommendations;
      },
      async getChunk(chunkNumber: number): Promise<MusicChunk> {
        return await MusicDataLoader.loadMusicChunk(chunkNumber);
      },
      async getRecommendationById(id: number): Promise<MusicRecommendation | null> {
        for (const chunkInfo of chunksInfo.chunks) {
          if (id >= chunkInfo.startId && id <= chunkInfo.endId) {
            const chunk = await MusicDataLoader.loadMusicChunk(
              chunksInfo.chunks.indexOf(chunkInfo) + 1
            );
            return chunk.recommendations.find(item => item.id === id) || null;
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

export const loadAllMusicData = MusicDataLoader.loadAllMusicData;
export const loadMusicChunk = MusicDataLoader.loadMusicChunk;
export const loadMusicDataLazy = MusicDataLoader.loadMusicDataLazy; 