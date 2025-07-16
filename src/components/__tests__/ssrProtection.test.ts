const originalWindow = global.window;
const originalDocument = global.document;

describe('SSR protection', () => {
  beforeAll(() => {
    // @ts-ignore
    delete global.window;
    // @ts-ignore
    delete global.document;
  });

  afterAll(() => {
    global.window = originalWindow;
    global.document = originalDocument;
  });

  it('HomePage no rompe en SSR', () => {
    expect(() => {
      require('../HomePage');
    }).not.toThrow();
  });

  it('UnifiedItemDetail no rompe en SSR', () => {
    expect(() => {
      require('../UnifiedItemDetail');
    }).not.toThrow();
  });

  it('MobileItemDetail no rompe en SSR', () => {
    expect(() => {
      require('../shared/MobileItemDetail');
    }).not.toThrow();
  });

  it('SplashDialog no rompe en SSR', () => {
    expect(() => {
      require('../SplashDialog');
    }).not.toThrow();
  });

  it('ThemeToggle no rompe en SSR', () => {
    expect(() => {
      require('../ThemeToggle');
    }).not.toThrow();
  });
}); 