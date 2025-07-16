import { processTitle, processDescription, randomNotFoundImage } from '../utils';
describe('utils del store', () => {
  it('procesa títulos correctamente', () => {
    expect(processTitle('Título', 'es')).toBe('Título');
    expect(processTitle({ es: 'Español', en: 'Inglés' }, 'es')).toBe('Español');
    expect(processTitle({ es: 'Español', en: 'Inglés' }, 'en')).toBe('Inglés');
    expect(processTitle(null, 'es')).toBe('Sin título');
  });

  it('procesa descripciones correctamente', () => {
    expect(processDescription('Descripción', 'es')).toBe('Descripción');
    expect(processDescription({ es: 'Español', en: 'Inglés' }, 'es')).toBe('Español');
    expect(processDescription({ es: 'Español', en: 'Inglés' }, 'en')).toBe('Inglés');
    expect(processDescription(null, 'es')).toBe('Sin descripción');
  });

  it('devuelve una imagen aleatoria de not found', () => {
    const img = randomNotFoundImage();
    expect(img).toMatch(/\/imagenes\/notfound\/notfound\d*\.webp/);
  });
}); 