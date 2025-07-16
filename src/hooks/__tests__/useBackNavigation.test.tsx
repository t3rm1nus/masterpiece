import React from 'react';
import { renderHook, act } from '@testing-library/react';
import useBackNavigation from '../useBackNavigation';
import { MemoryRouter, useLocation } from 'react-router-dom';

// Mock de useAppView
jest.mock('../../store/useAppStore', () => ({
  useAppView: jest.fn()
}));
const mockUseAppView = require('../../store/useAppStore').useAppView;

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: jest.fn()
  };
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={["/detalle/123"]}>{children}</MemoryRouter>
);

describe('useBackNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devuelve la función de back', () => {
    mockUseAppView.mockReturnValue({ currentView: 'detail', goHome: jest.fn() });
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/detalle/123' });
    const { result } = renderHook(() => useBackNavigation(), { wrapper: Wrapper });
    expect(typeof result.current.handleBack).toBe('function');
  });

  it('navega instantáneo a home si es coffee', () => {
    mockUseAppView.mockReturnValue({ currentView: 'coffee', goHome: jest.fn() });
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/donaciones' });
    const { result } = renderHook(() => useBackNavigation(), { wrapper: Wrapper });
    act(() => { result.current.handleBack(); });
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('navega instantáneo a home si es howToDownload', () => {
    mockUseAppView.mockReturnValue({ currentView: 'howToDownload', goHome: jest.fn() });
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/como-descargar' });
    const { result } = renderHook(() => useBackNavigation(), { wrapper: Wrapper });
    act(() => { result.current.handleBack(); });
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('lanza animación y navega a home si es detail', () => {
    jest.useFakeTimers();
    mockUseAppView.mockReturnValue({ currentView: 'detail', goHome: jest.fn() });
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/detalle/123' });
    const { result } = renderHook(() => useBackNavigation(), { wrapper: Wrapper });
    act(() => { result.current.handleBack(); });
    expect(result.current.isAnimating).toBe(true);
    act(() => { jest.runAllTimers(); });
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    jest.useRealTimers();
  });

  it('navega atrás si es home', () => {
    mockUseAppView.mockReturnValue({ currentView: 'home', goHome: jest.fn() });
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/' });
    const { result } = renderHook(() => useBackNavigation(), { wrapper: Wrapper });
    act(() => { result.current.handleBack(); });
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
}); 