import * as helpers from '../homePageHelpers';
describe('homePageHelpers', () => {
  it('exporta funciones', () => {
    expect(typeof helpers).toBe('object');
    Object.values(helpers).forEach(fn => {
      if (typeof fn === 'function') {
        expect(() => fn()).not.toThrow();
      }
    });
  });
}); 