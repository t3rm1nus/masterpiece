import { forceScrollOnIPhone } from '../iPhoneScrollFix';
describe('forceScrollOnIPhone', () => {
  it('se ejecuta sin errores', () => {
    expect(() => forceScrollOnIPhone()).not.toThrow();
  });
}); 