import React from 'react';
import { render } from '@testing-library/react';
import MaterialRecommendationCard from '../MaterialRecommendationCard';

describe('MaterialRecommendationCard', () => {
  const recommendation = {
    title: 'Título',
    description: 'Descripción',
    category: 'movies',
    id: 1
  };
  it('renderiza correctamente con props mínimos', () => {
    const { getByText } = render(<MaterialRecommendationCard recommendation={recommendation} />);
    expect(getByText('Título')).toBeInTheDocument();
    expect(getByText('Descripción')).toBeInTheDocument();
  });
  // Eliminar tests de children/fragmentos si existen
}); 