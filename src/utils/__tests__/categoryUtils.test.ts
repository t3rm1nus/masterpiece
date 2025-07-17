import { normalizeSubcategoryInternal, normalizeSubcategory, filterItemsBySubcategory, getUniqueSubcategories, getCategoryGradient } from '../categoryUtils';

test('normalizeSubcategoryInternal normaliza y traduce correctamente', () => {
  expect(normalizeSubcategoryInternal('Acción')).toBe('action');
  expect(normalizeSubcategoryInternal('comedia')).toBe('comedy');
  expect(normalizeSubcategoryInternal('')).toBe('');
});

// Tests específicos para las subcategorías problemáticas reportadas
test('normalizeSubcategoryInternal maneja subcategorías problemáticas correctamente', () => {
  // Música - "otros"
  expect(normalizeSubcategoryInternal('otros')).toBe('others');
  expect(normalizeSubcategoryInternal('Others')).toBe('others');
  
  // Videojuegos - "terror"
  expect(normalizeSubcategoryInternal('terror')).toBe('horror');
  expect(normalizeSubcategoryInternal('Terror')).toBe('horror');
  expect(normalizeSubcategoryInternal('horror')).toBe('horror');
  
  // Juegos de Mesa - todas las subcategorías
  expect(normalizeSubcategoryInternal('familiar')).toBe('family');
  expect(normalizeSubcategoryInternal('abstracto')).toBe('abstract');
  expect(normalizeSubcategoryInternal('cooperativo')).toBe('cooperative');
  expect(normalizeSubcategoryInternal('dados')).toBe('dice');
  expect(normalizeSubcategoryInternal('cartas')).toBe('cards');
  expect(normalizeSubcategoryInternal('civilización')).toBe('civilization');
  expect(normalizeSubcategoryInternal('fiesta')).toBe('party');
  expect(normalizeSubcategoryInternal('deducción')).toBe('deduction');
  expect(normalizeSubcategoryInternal('solitario')).toBe('solo');
  expect(normalizeSubcategoryInternal('económico')).toBe('economic');
  expect(normalizeSubcategoryInternal('temático')).toBe('thematic');
  
  // Otras subcategorías importantes
  expect(normalizeSubcategoryInternal('estrategia')).toBe('strategy');
  expect(normalizeSubcategoryInternal('disparos')).toBe('shooter');
  expect(normalizeSubcategoryInternal('mundo abierto')).toBe('sandbox');
  expect(normalizeSubcategoryInternal('plataformas')).toBe('platformer');
  expect(normalizeSubcategoryInternal('independiente')).toBe('indie');
});

test('normalizeSubcategory traduce correctamente las subcategorías problemáticas', () => {
  // Español
  expect(normalizeSubcategory('others', 'es')).toBe('otros');
  expect(normalizeSubcategory('horror', 'es')).toBe('terror');
  expect(normalizeSubcategory('family', 'es')).toBe('familiar');
  expect(normalizeSubcategory('abstract', 'es')).toBe('abstracto');
  expect(normalizeSubcategory('cooperative', 'es')).toBe('cooperativo');
  expect(normalizeSubcategory('dice', 'es')).toBe('dados');
  expect(normalizeSubcategory('cards', 'es')).toBe('cartas');
  expect(normalizeSubcategory('civilization', 'es')).toBe('civilización');
  expect(normalizeSubcategory('party', 'es')).toBe('fiesta');
  expect(normalizeSubcategory('deduction', 'es')).toBe('deducción');
  expect(normalizeSubcategory('solo', 'es')).toBe('solitario');
  expect(normalizeSubcategory('economic', 'es')).toBe('económico');
  expect(normalizeSubcategory('thematic', 'es')).toBe('temático');
  
  // Inglés
  expect(normalizeSubcategory('otros', 'en')).toBe('others');
  expect(normalizeSubcategory('terror', 'en')).toBe('horror');
  expect(normalizeSubcategory('familiar', 'en')).toBe('family');
  expect(normalizeSubcategory('abstracto', 'en')).toBe('abstract');
  expect(normalizeSubcategory('cooperativo', 'en')).toBe('cooperative');
  expect(normalizeSubcategory('dados', 'en')).toBe('dice');
  expect(normalizeSubcategory('cartas', 'en')).toBe('cards');
  expect(normalizeSubcategory('civilización', 'en')).toBe('civilization');
  expect(normalizeSubcategory('fiesta', 'en')).toBe('party');
  expect(normalizeSubcategory('deducción', 'en')).toBe('deduction');
  expect(normalizeSubcategory('solitario', 'en')).toBe('solo');
  expect(normalizeSubcategory('económico', 'en')).toBe('economic');
  expect(normalizeSubcategory('temático', 'en')).toBe('thematic');
});

test('filterItemsBySubcategory funciona con subcategorías problemáticas', () => {
  const items = [
    { subcategory: 'otros' },
    { subcategory: 'terror' },
    { subcategory: 'familiar' },
    { subcategory: 'abstracto' },
    { subcategory: 'cooperative' },
    { subcategory: 'dados' },
    { subcategory: 'cartas' },
    { subcategory: 'civilización' },
    { subcategory: 'fiesta' },
    { subcategory: 'deducción' },
    { subcategory: 'solitario' },
    { subcategory: 'económico' },
    { subcategory: 'temático' }
  ];
  
  // Filtrar por "otros"
  const otrosItems = filterItemsBySubcategory(items, 'otros', 'es');
  expect(otrosItems).toHaveLength(1);
  expect(otrosItems[0].subcategory).toBe('otros');
  
  // Filtrar por "terror"
  const terrorItems = filterItemsBySubcategory(items, 'terror', 'es');
  expect(terrorItems).toHaveLength(1);
  expect(terrorItems[0].subcategory).toBe('terror');
  
  // Filtrar por "familiar"
  const familiarItems = filterItemsBySubcategory(items, 'familiar', 'es');
  expect(familiarItems).toHaveLength(1);
  expect(familiarItems[0].subcategory).toBe('familiar');
  
  // Filtrar por "abstracto"
  const abstractoItems = filterItemsBySubcategory(items, 'abstracto', 'es');
  expect(abstractoItems).toHaveLength(1);
  expect(abstractoItems[0].subcategory).toBe('abstracto');
});

test('getUniqueSubcategories obtiene todas las subcategorías únicas correctamente', () => {
  const items = [
    { subcategory: 'otros' },
    { subcategory: 'terror' },
    { subcategory: 'familiar' },
    { subcategory: 'abstracto' },
    { subcategory: 'cooperative' },
    { subcategory: 'dados' },
    { subcategory: 'cartas' },
    { subcategory: 'civilización' },
    { subcategory: 'fiesta' },
    { subcategory: 'deducción' },
    { subcategory: 'solitario' },
    { subcategory: 'económico' },
    { subcategory: 'temático' }
  ];
  
  const uniqueSubcategories = getUniqueSubcategories(items, 'es');
  expect(uniqueSubcategories).toContain('others');
  expect(uniqueSubcategories).toContain('horror');
  expect(uniqueSubcategories).toContain('family');
  expect(uniqueSubcategories).toContain('abstract');
  expect(uniqueSubcategories).toContain('cooperative');
  expect(uniqueSubcategories).toContain('dice');
  expect(uniqueSubcategories).toContain('cards');
  expect(uniqueSubcategories).toContain('civilization');
  expect(uniqueSubcategories).toContain('party');
  expect(uniqueSubcategories).toContain('deduction');
  expect(uniqueSubcategories).toContain('solo');
  expect(uniqueSubcategories).toContain('economic');
  expect(uniqueSubcategories).toContain('thematic');
  expect(uniqueSubcategories).toHaveLength(13);
});

test('getCategoryGradient retorna un string', () => {
  expect(typeof getCategoryGradient('movies')).toBe('string');
}); 