import { useState, useEffect, useMemo } from 'react';
import { MusicDataLoader } from '../utils/musicDataLoader';

interface MusicItem {
  id: number;
  title: string | { [lang: string]: string };
  description?: string | { [lang: string]: string };
  artist?: string;
  subcategory?: string;
  masterpiece?: boolean;
  tags?: string[];
  [key: string]: any;
}

interface MusicMetadata {
  [key: string]: any;
}

interface UseMusicDataReturn {
  musicData: MusicItem[];
  loading: boolean;
  error: string | null;
  metadata: MusicMetadata | null;
  filter: {
    bySubcategory: (subcategory: string) => MusicItem[];
    byMasterpiece: (isMasterpiece?: boolean) => MusicItem[];
    byArtist: (artist: string) => MusicItem[];
    search: (query: string) => MusicItem[];
    random: (count?: number) => MusicItem[];
  };
  totalItems: number;
}

export const useMusicData = (loadStrategy: 'all' | 'lazy' = 'all'): UseMusicDataReturn => {
  const [musicData, setMusicData] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<MusicMetadata | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        let data: MusicItem[];
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
      } catch (err: any) {
        console.error('Error loading music data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [loadStrategy]);

  const filteredData = useMemo(() => {
    return {
      bySubcategory: (subcategory: string) => 
        musicData.filter(item => item.subcategory === subcategory),
      byMasterpiece: (isMasterpiece: boolean = true) => 
        musicData.filter(item => item.masterpiece === isMasterpiece),
      byArtist: (artist: string) => 
        musicData.filter(item => 
          item.artist?.toLowerCase().includes(artist.toLowerCase())
        ),
      search: (query: string) => 
        musicData.filter(item => {
          const searchText = query.toLowerCase();
          return (
            item.artist?.toLowerCase().includes(searchText) ||
            (typeof item.title === 'object' && (item.title.es?.toLowerCase().includes(searchText) || item.title.en?.toLowerCase().includes(searchText))) ||
            (typeof item.description === 'object' && (item.description.es?.toLowerCase().includes(searchText) || item.description.en?.toLowerCase().includes(searchText))) ||
            item.tags?.some(tag => tag.toLowerCase().includes(searchText))
          );
        }),
      random: (count: number = 10) => {
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

export const useMusicChunk = (chunkNumber: number) => {
  const [chunkData, setChunkData] = useState<MusicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChunk = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await MusicDataLoader.loadMusicChunk(chunkNumber);
        setChunkData(data.recommendations);
      } catch (err: any) {
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

export const useMusicRecommendation = (id: number) => {
  const [recommendation, setRecommendation] = useState<MusicItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecommendation = async () => {
      try {
        setLoading(true);
        setError(null);
        const lazyLoader = await MusicDataLoader.loadMusicDataLazy();
        const item = await lazyLoader.getRecommendationById(Number(id));
        setRecommendation(item);
      } catch (err: any) {
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