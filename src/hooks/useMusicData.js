// Hook React para usar los datos de música chunked
import { useState, useEffect, useMemo } from 'react';
import { MusicDataLoader } from '../utils/musicDataLoader.js';

export const useMusicData = (loadStrategy = 'all') => {
  const [musicData, setMusicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        if (loadStrategy === 'lazy') {
          const lazyLoader = await MusicDataLoader.loadMusicDataLazy();
          data = await lazyLoader.getAllRecommendations();
          setMetadata(lazyLoader.getMetadata());
        } else {
          const result = await MusicDataLoader.loadAllMusicData();
          data = result.recommendations;
          setMetadata(result.metadata);
        }

        setMusicData(data);
      } catch (err) {
        console.error('Error loading music data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [loadStrategy]);

  // Funciones de filtrado y búsqueda memoizadas
  const filteredData = useMemo(() => {
    return {
      bySubcategory: (subcategory) => 
        musicData.filter(item => item.subcategory === subcategory),
      
      byMasterpiece: (isMasterpiece = true) => 
        musicData.filter(item => item.masterpiece === isMasterpiece),
      
      byArtist: (artist) => 
        musicData.filter(item => 
          item.artist?.toLowerCase().includes(artist.toLowerCase())
        ),
      
      search: (query) => 
        musicData.filter(item => {
          const searchText = query.toLowerCase();
          return (
            item.artist?.toLowerCase().includes(searchText) ||
            item.title?.es?.toLowerCase().includes(searchText) ||
            item.title?.en?.toLowerCase().includes(searchText) ||
            item.description?.es?.toLowerCase().includes(searchText) ||
            item.description?.en?.toLowerCase().includes(searchText) ||
            item.tags?.some(tag => tag.toLowerCase().includes(searchText))
          );
        }),

      random: (count = 10) => {
        const shuffled = [...musicData].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      }
    };
  }, [musicData]);

  return {
    musicData,
    loading,
    error,
    metadata,
    filter: filteredData,
    totalItems: musicData.length
  };
};

// Hook para cargar un chunk específico
export const useMusicChunk = (chunkNumber) => {
  const [chunkData, setChunkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChunk = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await MusicDataLoader.loadMusicChunk(chunkNumber);
        setChunkData(data.recommendations);
      } catch (err) {
        console.error(`Error loading chunk ${chunkNumber}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (chunkNumber) {
      loadChunk();
    }
  }, [chunkNumber]);

  return { chunkData, loading, error };
};

// Hook para buscar una recomendación específica por ID
export const useMusicRecommendation = (id) => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecommendation = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const lazyLoader = await MusicDataLoader.loadMusicDataLazy();
        const item = await lazyLoader.getRecommendationById(parseInt(id));
        setRecommendation(item);
      } catch (err) {
        console.error(`Error loading recommendation ${id}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadRecommendation();
    }
  }, [id]);

  return { recommendation, loading, error };
};
