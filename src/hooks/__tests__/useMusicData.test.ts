import { renderHook, act, waitFor } from '@testing-library/react';
import { useMusicData, useMusicChunk, useMusicRecommendation } from '../useMusicData';

// Mock de MusicDataLoader
jest.mock('../../utils/musicDataLoader', () => ({
  MusicDataLoader: {
    loadAllMusicData: jest.fn().mockResolvedValue({
      recommendations: [
        { id: 1, title: { es: 'Canción Uno', en: 'Song One' }, artist: 'Artista', subcategory: 'pop', masterpiece: true, tags: ['pop', '2020'] },
        { id: 2, title: { es: 'Canción Dos', en: 'Song Two' }, artist: 'Otro', subcategory: 'rock', masterpiece: false, tags: ['rock'] }
      ],
      metadata: { total: 2 }
    }),
    loadMusicDataLazy: jest.fn().mockResolvedValue({
      getAllRecommendations: jest.fn().mockResolvedValue([
        { id: 1, title: { es: 'Canción Uno', en: 'Song One' }, artist: 'Artista', subcategory: 'pop', masterpiece: true, tags: ['pop', '2020'] }
      ]),
      getMetadata: jest.fn().mockReturnValue({ total: 1 }),
      getRecommendationById: jest.fn().mockResolvedValue({ id: 1, title: { es: 'Canción Uno', en: 'Song One' }, artist: 'Artista' })
    }),
    loadMusicChunk: jest.fn().mockResolvedValue({ recommendations: [{ id: 3, title: 'Chunk Song', artist: 'Chunky' }] })
  }
}));

describe('useMusicData', () => {
  it('devuelve estado inicial correcto', async () => {
    const { result } = renderHook(() => useMusicData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.musicData.length).toBe(2);
    expect(result.current.error).toBeNull();
    expect(result.current.metadata).toEqual({ total: 2 });
  });

  it('filtra por subcategoría', async () => {
    const { result } = renderHook(() => useMusicData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const pop = result.current.filter.bySubcategory('pop');
    expect(pop.length).toBe(1);
    expect(pop[0].subcategory).toBe('pop');
  });

  it('filtra por masterpiece', async () => {
    const { result } = renderHook(() => useMusicData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const masterpieces = result.current.filter.byMasterpiece(true);
    expect(masterpieces.length).toBe(1);
    expect(masterpieces[0].masterpiece).toBe(true);
  });

  it('filtra por artista', async () => {
    const { result } = renderHook(() => useMusicData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const artista = result.current.filter.byArtist('Artista');
    expect(artista.length).toBe(1);
    expect(artista[0].artist).toBe('Artista');
  });

  it('busca por texto', async () => {
    const { result } = renderHook(() => useMusicData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const found = result.current.filter.search('uno');
    expect(found.length).toBe(1);
    expect(found[0].id).toBe(1);
  });

  it('devuelve items aleatorios', async () => {
    const { result } = renderHook(() => useMusicData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const random = result.current.filter.random(1);
    expect(random.length).toBe(1);
  });

  it('maneja errores de carga', async () => {
    const { MusicDataLoader } = require('../../utils/musicDataLoader');
    MusicDataLoader.loadAllMusicData.mockRejectedValueOnce(new Error('Error de carga'));
    const { result } = renderHook(() => useMusicData());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Error de carga');
  });
});

describe('useMusicChunk', () => {
  it('carga un chunk de música', async () => {
    const { result } = renderHook(() => useMusicChunk(1));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.chunkData.length).toBe(1);
    expect(result.current.chunkData[0].title).toBe('Chunk Song');
    expect(result.current.loading).toBe(false);
  });
});

describe('useMusicRecommendation', () => {
  it('carga una recomendación por id', async () => {
    const { result } = renderHook(() => useMusicRecommendation(1));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.recommendation).toBeTruthy();
    expect(result.current.recommendation?.id).toBe(1);
    expect(result.current.loading).toBe(false);
  });
}); 