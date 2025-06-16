import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import texts from '../texts.json';

// Store para gestionar el idioma y las traducciones
const useLanguageStore = create(
  devtools(
    (set, get) => ({
      // Estado inicial
      lang: 'es',
      translations: texts.es, // Inicialmente cargamos las traducciones en español
      
      // Acciones
      setLanguage: (lang) => {
        // Verificar que el idioma es válido
        if (lang && texts[lang]) {
          set(
            { 
              lang,
              translations: texts[lang]
            },
            false,
            'setLanguage'
          );
        }
      },
      
      // Método de utilidad para obtener una traducción específica
      getTranslation: (key) => {
        const translations = get().translations;
        return key.split('.').reduce((obj, part) => 
          obj && obj[part] ? obj[part] : undefined, 
          translations
        );
      },
      
      // Método para obtener traducciones de categorías
      getCategoryTranslation: (category) => {
        const translations = get().translations;
        return translations.categories && translations.categories[category] 
          ? translations.categories[category] 
          : category;
      },
      
      // Traducciones comunes de subcategorías
      getSubcategoryTranslation: (subcategory) => {
        const { translations } = get();
        
        // Primero intenta usar las subcategorías del archivo texts.json
        // Convertir a minúsculas para hacer coincidencia case-insensitive
        const lowercaseSubcategory = subcategory ? subcategory.toLowerCase() : '';
        if (translations.subcategories && translations.subcategories[lowercaseSubcategory]) {
          return translations.subcategories[lowercaseSubcategory];
        }
        
        // Fallback a las traducciones hardcodeadas para subcategorías existentes
        const { lang } = get();
        const subcategoryTranslations = {
          'fantasy': lang === 'es' ? 'fantasía' : 'fantasy',
          'acción': lang === 'en' ? 'action' : 'acción',
          'action': lang === 'es' ? 'acción' : 'action',
          'comedy': lang === 'es' ? 'comedia' : 'comedy',
          'adventure': lang === 'es' ? 'aventura' : 'adventure',
          'aventura': lang === 'en' ? 'adventure' : 'aventura',
          'comedia': lang === 'en' ? 'comedy' : 'comedia',
          'histórico': lang === 'en' ? 'historical' : 'histórico',
          'crónica': lang === 'en' ? 'chronicle' : 'crónica',
          'animation': lang === 'es' ? 'animación' : 'animation',
          'war': lang === 'es' ? 'guerra' : 'war',
          'spanish cinema': lang === 'es' ? 'cine español' : 'spanish cinema',
          'sci-fi': lang === 'es' ? 'ciencia ficción' : 'sci-fi',
          'thriller': lang === 'es' ? 'suspense' : 'thriller',
          'horror': lang === 'es' ? 'terror' : 'horror',
          'drama': 'drama',
          'western': 'western',
          'superhéroes': lang === 'en' ? 'superheroes' : 'superhéroes',
          'superheroes': lang === 'es' ? 'superhéroes' : 'superheroes',
          // Subcategorías adicionales de boardgames
          'civilización': lang === 'en' ? 'civilization' : 'civilización',
          'civilization': lang === 'es' ? 'civilización' : 'civilization',
          'party': lang === 'es' ? 'fiesta' : 'party'
        };
        
        return subcategoryTranslations[lowercaseSubcategory] || subcategory;
      }
    }),
    { name: 'language-store' } // Nombre para DevTools
  )
);

export default useLanguageStore;
