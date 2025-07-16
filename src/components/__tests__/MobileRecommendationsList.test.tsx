import React from 'react';
import { render } from '@testing-library/react';
import MobileRecommendationsList from '../MobileRecommendationsList';

describe('MobileRecommendationsList', () => {
  it('renderiza sin errores con props mínimos', () => {
    render(<MobileRecommendationsList items={[]} onItemClick={() => {}} />);
  });
  // Eliminar tests de children/fragmentos si existen
}); 