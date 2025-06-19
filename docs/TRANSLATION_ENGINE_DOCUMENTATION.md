# Motor de Traducciones - Documentación Técnica

## Descripción General

El motor de traducciones ha sido completamente refactorizado para ser **estable como una roca** (como Debian). Proporciona un sistema robusto, eficiente y mantenible para el manejo de traducciones en la aplicación.

## Arquitectura

### Componentes Principales

1. **`languageStore.js`** - Store principal con Zustand
2. **`LanguageContext.jsx`** - Contexto React para distribución del estado
3. **`translationUtils.js`** - Utilidades avanzadas para casos especiales
4. **`texts.json`** - Archivo de traducciones estructurado

## Características del Sistema

### ✅ Robustez y Estabilidad

- **Validación completa**: Todos los parámetros son validados antes del procesamiento
- **Fallbacks seguros**: Sistema de fallbacks en cascada que evita crashes
- **Manejo de errores**: Captura y manejo elegante de errores
- **Inmutabilidad**: No se modifican los datos originales
- **Thread-safe**: Operaciones seguras para concurrencia

### ✅ Búsquedas Case-Insensitive

- Todas las búsquedas son insensibles a mayúsculas/minúsculas
- Normalización automática de claves
- Búsqueda inteligente en subcategorías por categoría

### ✅ Sistema de Subcategorías Inteligente

- **Búsqueda contextual**: Busca primero en la categoría específica
- **Fallback general**: Si no encuentra, busca en todas las categorías
- **Sin hardcoding**: Eliminados todos los fallbacks hardcodeados
- **Estructura aprovechada**: Usa la estructura jerárquica de `texts.json`

### ✅ Compatibilidad hacia Atrás

- Mantiene todas las APIs existentes
- Funciones de conveniencia adicionales
- No rompe código existente

## API del Store (languageStore.js)

### Estado

```javascript
{
  lang: string,              // Idioma actual
  translations: object,      // Traducciones del idioma actual
  availableLanguages: array  // Lista de idiomas disponibles
}
```

### Métodos Principales

#### `setLanguage(lang)`
```javascript
// Cambia el idioma de forma segura
setLanguage('en');
setLanguage('ES'); // Case-insensitive
```

#### `getTranslation(key, fallback)`
```javascript
// Obtiene traducciones con dot notation
getTranslation('ui.navigation.home');
getTranslation('nonexistent.key', 'Default Value');
```

#### `getCategoryTranslation(category, fallback)`
```javascript
// Traduce categorías de forma robusta
getCategoryTranslation('movies');
getCategoryTranslation('MOVIES'); // Case-insensitive
```

#### `getSubcategoryTranslation(subcategory, category, fallback)`
```javascript
// Traduce subcategorías con contexto de categoría
getSubcategoryTranslation('action', 'movies');
getSubcategoryTranslation('ACTION'); // Busca en todas las categorías
```

#### `hasTranslation(key)`
```javascript
// Verifica si existe una traducción
if (hasTranslation('ui.navigation.home')) {
  // Usar traducción
}
```

#### `getTranslationMetadata()`
```javascript
// Obtiene metadatos del sistema de traducciones
const metadata = getTranslationMetadata();
console.log(metadata.version); // "2.0.0"
```

## API del Contexto (LanguageContext.jsx)

### Hook `useLanguage()`

Retorna un objeto con todas las funcionalidades:

```javascript
const {
  // Estado básico
  lang,
  t,
  availableLanguages,
  
  // Cambio de idioma
  changeLanguage,
  setLanguage,
  
  // Funciones de traducción (originales)
  getTranslation,
  getCategoryTranslation,
  getSubcategoryTranslation,
  
  // Funciones de conveniencia
  translate,
  translateCategory,
  translateSubcategory,
  
  // Utilidades
  hasTranslation,
  isLanguageAvailable,
  getAvailableLanguages,
  getTranslationMetadata
} = useLanguage();
```

### Funciones de Conveniencia

```javascript
// Método corto para traducir
const homeText = translate('ui.navigation.home', 'Home');

// Traducir categoría con fallback
const categoryName = translateCategory('movies', 'Movies');

// Traducir subcategoría con contexto
const subName = translateSubcategory('action', 'movies', 'Action');
```

## Utilidades Avanzadas (translationUtils.js)

### Validador de Traducciones
```javascript
import { createTranslationValidator } from '../utils/translationUtils';

const validator = createTranslationValidator(translations);
const isValid = validator.validate('ui.navigation.home');
const missingKeys = validator.getMissingKeys();
```

### Formateo con Variables
```javascript
import { formatTranslation } from '../utils/translationUtils';

const template = "Hello {name}, you have {count} messages";
const result = formatTranslation(template, { name: "John", count: 5 });
// "Hello John, you have 5 messages"
```

### Pluralización
```javascript
import { pluralize } from '../utils/translationUtils';

const result = pluralize(5, 'item', 'items', 'en');
// "items"
```

### Namespace de Traducciones
```javascript
import { createTranslationNamespace } from '../utils/translationUtils';

const uiTranslate = createTranslationNamespace(getTranslation, 'ui');
const homeText = uiTranslate('navigation.home'); // Equivale a getTranslation('ui.navigation.home')
```

### Cache de Traducciones
```javascript
import { createTranslationCache } from '../utils/translationUtils';

const cache = createTranslationCache();
const result = cache.get('expensive-key', () => computeExpensiveTranslation());
```

## Estructura de texts.json

```json
{
  "metadata": {
    "version": "2.0.0",
    "supportedLanguages": ["es", "en"],
    "defaultLanguage": "es"
  },
  "es": {
    "ui": { ... },
    "categories": {
      "movies": "Películas",
      "series": "Series"
    },
    "subcategories": {
      "movies": {
        "action": "Acción",
        "comedy": "Comedia"
      },
      "series": {
        "drama": "Drama"
      }
    }
  },
  "en": { ... }
}
```

## Mejores Prácticas

### ✅ DO - Usar contexto de categoría
```javascript
// ✅ CORRECTO - Proporciona contexto
getSubcategoryTranslation('action', 'movies');
```

### ❌ DON'T - Asumir formato de claves
```javascript
// ❌ INCORRECTO - Hardcodear fallbacks
const result = subcategory === 'action' ? 'Acción' : subcategory;

// ✅ CORRECTO - Usar el sistema
const result = getSubcategoryTranslation(subcategory, category);
```

### ✅ DO - Usar fallbacks seguros
```javascript
// ✅ CORRECTO
const text = getTranslation('ui.button.save', 'Save');
```

### ✅ DO - Validar antes de usar
```javascript
// ✅ CORRECTO
if (hasTranslation('complex.nested.key')) {
  const text = getTranslation('complex.nested.key');
}
```

## Ventajas del Sistema Refactorizado

1. **Eliminación de Hardcoding**: No más fallbacks hardcodeados
2. **Búsqueda Inteligente**: Sistema contextual de subcategorías
3. **Robustez**: Manejo completo de errores y casos edge
4. **Mantenibilidad**: Código limpio y bien documentado
5. **Extensibilidad**: Fácil agregar nuevas funcionalidades
6. **Performance**: Cache y optimizaciones incluidas
7. **Developer Experience**: APIs intuitivas y debugging mejorado

## Debugging y Desarrollo

### DevTools
El store está configurado con Zustand DevTools para debugging en desarrollo.

### Logging
```javascript
// Los errores y advertencias se logean automáticamente
console.warn('[Translation] Language not found:', lang);
```

### Validación en Desarrollo
```javascript
// En desarrollo, usar el validador para encontrar claves faltantes
if (process.env.NODE_ENV === 'development') {
  const validator = createTranslationValidator(translations);
  // Validar claves críticas
}
```

## Migración y Compatibilidad

### Código Existente
El código existente seguirá funcionando sin cambios. Las nuevas funcionalidades son aditivas.

### Nuevos Desarrollos
Para nuevos desarrollos, usar las APIs mejoradas:

```javascript
// Viejo estilo (sigue funcionando)
getSubcategoryTranslation(subcategory);

// Nuevo estilo (recomendado)
getSubcategoryTranslation(subcategory, category);
```

## Conclusión

Este motor de traducciones refactorizado proporciona una base sólida y estable para el sistema de internacionalización de la aplicación. Con características robustas, APIs intuitivas y excelente mantenibilidad, está diseñado para escalar y evolucionar con las necesidades del proyecto.

**Estable como Debian.** 🗿
