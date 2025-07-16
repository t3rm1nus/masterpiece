import React from 'react';
import { render } from '@testing-library/react';
import MaterialSubcategoryChips from '../MaterialSubcategoryChips';

describe('MaterialSubcategoryChips', () => {
  it('renderiza sin errores con props mínimos', () => {
    render(<MaterialSubcategoryChips subcategories={[]} activeKey={null} onSelect={() => {}} />);
  });
}); 