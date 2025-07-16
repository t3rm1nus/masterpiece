import { act } from '@testing-library/react';
import useAppStore from '../useAppStore';

describe('useAppStore', () => {
  it('permite cambiar la categoría seleccionada', () => {
    act(() => {
      useAppStore.getState().setCategory('movies');
    });
    expect(useAppStore.getState().selectedCategory).toBe('movies');
  });
}); 