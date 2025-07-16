import React from 'react';
import { render } from '@testing-library/react';
import RecommendationsList from '../RecommendationsList';

// Mock de los componentes hijos
jest.mock('../MobileRecommendationsList', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="mobile-list">Mobile {JSON.stringify(props.items)}</div>
}));
jest.mock('../DesktopRecommendationsList', () => ({
  __esModule: true,
  default: (props: any) => <div data-testid="desktop-list">Desktop {JSON.stringify(props.items)}</div>
}));

// Mock de useAppView
jest.mock('../../store/useAppStore', () => ({
  ...jest.requireActual('../../store/useAppStore'),
  useAppView: jest.fn()
}));

import { useAppView } from '../../store/useAppStore';

describe('RecommendationsList', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza MobileRecommendationsList si isMobile es true', () => {
    (useAppView as jest.Mock).mockReturnValue({ isMobile: true });
    const items = [{ id: 1, name: 'Uno' }];
    const { getByTestId } = render(<RecommendationsList items={items} />);
    expect(getByTestId('mobile-list')).toBeInTheDocument();
    expect(getByTestId('mobile-list').textContent).toContain('Uno');
  });

  it('renderiza DesktopRecommendationsList si isMobile es false', () => {
    (useAppView as jest.Mock).mockReturnValue({ isMobile: false });
    const items = [{ id: 2, name: 'Dos' }];
    const { getByTestId } = render(<RecommendationsList items={items} />);
    expect(getByTestId('desktop-list')).toBeInTheDocument();
    expect(getByTestId('desktop-list').textContent).toContain('Dos');
  });
}); 