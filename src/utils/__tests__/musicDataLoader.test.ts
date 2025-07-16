import * as musicDataLoader from '../musicDataLoader';
describe('musicDataLoader', () => {
  it('exporta funciones', () => {
    expect(typeof musicDataLoader).toBe('object');
    expect(musicDataLoader).toHaveProperty('loadAllMusicData');
    expect(musicDataLoader).toHaveProperty('loadMusicDataLazy');
    expect(musicDataLoader).toHaveProperty('loadMusicChunk');
  });
}); 