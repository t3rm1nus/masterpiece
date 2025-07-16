import { render } from '@testing-library/react';
import SplashDialog from '../SplashDialog';

describe('SplashDialog', () => {
  it('renderiza sin errores', () => {
    render(<SplashDialog open={true} />);
  });
}); 