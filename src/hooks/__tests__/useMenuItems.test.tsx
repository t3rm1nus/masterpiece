import { renderHook, act } from '@testing-library/react';
import { useMenuItems } from '../useMenuItems';
import * as LanguageContext from '../../LanguageContext';
import * as AppStore from '../../store/useAppStore';
import { MemoryRouter } from 'react-router-dom';

// Mock de useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('useMenuItems', () => {
  const t = {
    'ui.titles.home_title': 'Nuevas Recomendaciones',
    'ui.navigation.buy_me_coffee': 'Café',
    'ui.navigation.how_to_download': 'Descargar',
    'ui.navigation.about': 'Quiénes somos'
  };
  const getTranslation = (key: string, fallback?: string) => (t as any)[key] || fallback || key;
  beforeEach(() => {
    jest.spyOn(LanguageContext, 'useLanguage').mockReturnValue({
      t,
      lang: 'es',
      getTranslation
    } as any);
    jest.spyOn(AppStore, 'useAppData').mockReturnValue({
      resetAllFilters: jest.fn(),
      generateNewRecommendations: jest.fn()
    } as any);
    // @ts-ignore
    global.window = Object.create(window);
    window.scrollTo = jest.fn();
  });

  function findItem(result: any, label: string) {
    return result.current.find((item: any) => item.label === label);
  }

  it('genera el menú correctamente en desktop', () => {
    window.innerWidth = 1200;
    const { result } = renderHook(() => useMenuItems());
    const labels = result.current.map((item: any) => item.label);
    expect(labels).toEqual(
      expect.arrayContaining([
        'Nuevas Recomendaciones',
        'Café',
        'Descargar',
        'Quiénes somos'
      ])
    );
  });

  it('genera el menú reordenado en móvil', () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useMenuItems());
    const labels = result.current.map((item: any) => item.label);
    expect(labels).toEqual(
      expect.arrayContaining([
        'Nuevas Recomendaciones',
        'Café',
        'Descargar',
        'Quiénes somos'
      ])
    );
  });

  it('ejecuta la acción de nuevas recomendaciones', () => {
    const onOverlayNavigate = jest.fn();
    const { result } = renderHook(() => useMenuItems(undefined, onOverlayNavigate));
    const item = findItem(result, 'Nuevas Recomendaciones');
    act(() => {
      item.action();
    });
    expect(onOverlayNavigate).toHaveBeenCalledWith('/');
  });

  it('ejecuta la acción de café', () => {
    const onOverlayNavigate = jest.fn();
    const { result } = renderHook(() => useMenuItems(undefined, onOverlayNavigate));
    const item = findItem(result, 'Café');
    act(() => {
      item.action();
    });
    expect(onOverlayNavigate).toHaveBeenCalledWith('/donaciones');
  });

  it('ejecuta la acción de cómo descargar', () => {
    const onOverlayNavigate = jest.fn();
    const { result } = renderHook(() => useMenuItems(undefined, onOverlayNavigate));
    const item = findItem(result, 'Descargar');
    act(() => {
      item.action();
    });
    expect(onOverlayNavigate).toHaveBeenCalledWith('/como-descargar');
  });

  it('ejecuta la acción de about con handleSplashOpen', () => {
    window.innerWidth = 500;
    const handleSplashOpen = jest.fn();
    const { result } = renderHook(() => useMenuItems(handleSplashOpen));
    const item = findItem(result, 'Quiénes somos');
    act(() => {
      item.action();
    });
    expect(handleSplashOpen).toHaveBeenCalled();
  });

  it('ciclo de audios del splash', () => {
    window.innerWidth = 500;
    const handleSplashOpen = jest.fn();
    const { result } = renderHook(() => useMenuItems(handleSplashOpen));
    const item = findItem(result, 'Quiénes somos');
    for (let i = 0; i < 7; i++) {
      act(() => {
        item.action();
      });
    }
    expect(handleSplashOpen).toHaveBeenCalled();
  });

  it('cada item tiene path fijo si corresponde', () => {
    const { result } = renderHook(() => useMenuItems());
    const cafe = findItem(result, 'Café');
    const descargar = findItem(result, 'Descargar');
    expect(cafe.path).toBe('/donaciones');
    expect(descargar.path).toBe('/como-descargar');
  });

  it('maneja error en onOverlayNavigate', () => {
    const onOverlayNavigate = jest.fn(() => { throw new Error('fail'); });
    const { result } = renderHook(() => useMenuItems(undefined, onOverlayNavigate));
    const item = findItem(result, 'Descargar');
    expect(() => item.action()).not.toThrow();
  });

  it('funciona sin props opcionales', () => {
    const { result } = renderHook(() => useMenuItems());
    expect(result.current.length).toBeGreaterThan(0);
  });
}); 