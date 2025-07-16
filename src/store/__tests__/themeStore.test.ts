import { create } from 'zustand';
import { createThemeSlice } from '../themeStore';

describe('themeStore', () => {
  let store: any;

  beforeEach(() => {
    store = create(createThemeSlice);
  });

  it('alterna el modo oscuro correctamente', () => {
    store.getState().toggleTheme();
    expect(store.getState().isDarkMode).toBe(true);
    expect(store.getState().theme).toBe('dark');
    store.getState().toggleTheme();
    expect(store.getState().isDarkMode).toBe(false);
    expect(store.getState().theme).toBe('light');
  });

  it('puede establecer el tema explícitamente', () => {
    store.getState().setTheme('dark');
    expect(store.getState().theme).toBe('dark');
    expect(store.getState().isDarkMode).toBe(true);
    store.getState().setTheme('light');
    expect(store.getState().theme).toBe('light');
    expect(store.getState().isDarkMode).toBe(false);
  });

  it('devuelve la configuración del badge de masterpiece', () => {
    const badge = store.getState().getMasterpieceBadgeConfig();
    expect(badge.color).toBe('gold');
    expect(badge.icon).toBe('★');
    expect(badge.svg).toBeDefined();
  });
}); 