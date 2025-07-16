import React from 'react';
import { renderHook } from '@testing-library/react';
import { useNavigationActions } from '../useNavigationActions';
import { MemoryRouter } from 'react-router-dom';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('useNavigationActions', () => {
  it('devuelve funciones de navegación', () => {
    const { result } = renderHook(() => useNavigationActions(), { wrapper: Wrapper });
    expect(typeof result.current.goHome).toBe('function');
    expect(typeof result.current.goBackFromDetail).toBe('function');
  });
}); 