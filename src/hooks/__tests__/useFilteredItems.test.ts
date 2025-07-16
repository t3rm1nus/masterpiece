import { renderHook } from '@testing-library/react';
import { useFilteredItems } from '../useFilteredItems';

describe('useFilteredItems', () => {
  it('filtra los items correctamente', () => {
    const params = {
      selectedCategory: '',
      activeSubcategory: '',
      activeLanguage: '',
      allData: [
        { id: 1, category: 'a' },
        { id: 2, category: 'b' }
      ],
      recommendations: [],
      isSpanishCinemaActive: false,
      isMasterpieceActive: false,
      activePodcastLanguages: [],
      activeDocumentaryLanguages: [],
      isDataInitialized: true
    };
    const { result } = renderHook(() => useFilteredItems(params));
    expect(result.current).toEqual(params.allData);
  });
}); 