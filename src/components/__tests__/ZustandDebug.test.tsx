import React from 'react';
import { render } from '@testing-library/react';
import ZustandDebug from '../ZustandDebug';

jest.mock('../../store/useAppStore', () => ({
  __esModule: true,
  default: jest.fn()
}));
const useAppStore = require('../../store/useAppStore').default;

describe('ZustandDebug', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el estado seleccionado como string si existe', () => {
    useAppStore.mockImplementation((cb: any) => cb({ selectedItem: { id: 1, name: 'Test' } }));
    const { getByText } = render(<ZustandDebug />);
    expect(getByText(/Zustand selectedItem: {"id":1,"name":"Test"}/)).toBeInTheDocument();
  });

  it('muestra null si no hay selectedItem', () => {
    useAppStore.mockImplementation((cb: any) => cb({ selectedItem: null }));
    const { getByText } = render(<ZustandDebug />);
    expect(getByText(/Zustand selectedItem: null/)).toBeInTheDocument();
  });
}); 