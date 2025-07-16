import React from 'react';
import { render } from '@testing-library/react';
import MaterialCategoryButtons from '../ui/MaterialCategoryButtons';

describe('MaterialCategoryButtons', () => {
  it('renderiza sin errores con props mínimos', () => {
    render(<MaterialCategoryButtons categories={[]} value={undefined} onChange={() => {}} />);
  });
}); 