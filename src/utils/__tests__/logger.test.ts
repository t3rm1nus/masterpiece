import { logger } from '../logger';

describe('logger', () => {
  let originalEnv: any;
  beforeAll(() => {
    // Mockear import.meta.env para evitar error en Jest
    // @ts-ignore
    originalEnv = globalThis.import ? globalThis.import.meta.env : undefined;
    // @ts-ignore
    globalThis.import = { meta: { env: { DEV: true } } };
  });
  afterAll(() => {
    // Restaurar el valor original
    if (originalEnv) {
      // @ts-ignore
      globalThis.import.meta.env = originalEnv;
    }
  });
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('error llama a console.error', () => {
    logger.error('test');
    expect(console.error).toHaveBeenCalledWith('test');
  });
  test('warn llama a console.warn', () => {
    logger.warn('test');
    expect(console.warn).toHaveBeenCalledWith('test');
  });
  test('info llama a console.info', () => {
    logger.info('test');
    expect(console.info).toHaveBeenCalledWith('test');
  });
}); 