// Función para normalizar subcategorías (sin traducción)
export const normalizeSubcategoryInternal = (subcategory: string): string => {
  if (!subcategory) return '';
  const normalized = subcategory.toLowerCase().trim();
  switch (normalized) {
    // Películas
    case 'action':
    case 'acción': return 'action';
    case 'animation':
    case 'animación': return 'animation';
    case 'fantasy':
    case 'fantasía': return 'fantasy';
    case 'comedy':
    case 'comedia': return 'comedy';
    case 'adventure':
    case 'aventura': return 'adventure';
    case 'sci-fi':
    case 'ciencia ficción': return 'sci-fi';
    case 'horror':
    case 'terror': return 'horror';
    case 'thriller': return 'thriller';
    case 'drama': return 'drama';
    case 'war':
    case 'guerra': return 'war';
    case 'western': return 'western';
    case 'romance': return 'romance';
    case 'mystery':
    case 'misterio': return 'mystery';
    case 'biographical':
    case 'biográfico': return 'biographical';
    
    // Series
    case 'medical':
    case 'médica': return 'medical';
    case 'crime':
    case 'crimen': return 'crime';
    case 'historical':
    case 'histórica': return 'historical';
    
    // Documentales
    case 'nature':
    case 'naturaleza': return 'nature';
    case 'history':
    case 'historia': return 'history';
    case 'science':
    case 'ciencia': return 'science';
    case 'technology':
    case 'tecnología': return 'technology';
    case 'society':
    case 'sociedad': return 'society';
    case 'art':
    case 'arte': return 'art';
    case 'sports':
    case 'deportes': return 'sports';
    case 'travel':
    case 'viajes': return 'travel';
    case 'biography':
    case 'biografía': return 'biography';
    case 'politics':
    case 'política': return 'politics';
    case 'psychology':
    case 'psicología': return 'psychology';
    case 'culture':
    case 'cultura': return 'culture';
    case 'food':
    case 'gastronomía': return 'food';
    case 'spirituality':
    case 'espiritualidad': return 'spirituality';
    case 'health':
    case 'salud': return 'health';
    case 'economics':
    case 'economía': return 'economics';
    case 'environment':
    case 'medio ambiente': return 'environment';
    case 'others':
    case 'otros': return 'others';
    case 'aesthetic':
    case 'estética': return 'aesthetic';
    case 'exploration':
    case 'exploración': return 'exploration';
    case 'faith':
    case 'fe': return 'faith';
    case 'gastronomy':
    case 'gastronomía': return 'gastronomy';
    case 'justice':
    case 'justicia': return 'justice';
    case 'mind':
    case 'mente': return 'mind';
    case 'past':
    case 'pasado': return 'past';
    case 'people':
    case 'personas': return 'people';
    case 'wildlife':
    case 'vida salvaje': return 'wildlife';
    
    // Libros
    case 'mystery':
    case 'misterio': return 'mystery';
    case 'biography':
    case 'biografía': return 'biography';
    case 'clasic':
    case 'clásico': return 'clasic';
    case 'philosophy':
    case 'filosofía': return 'philosophy';
    case 'sociology':
    case 'sociología': return 'sociology';
    case 'self-help':
    case 'autoayuda': return 'self-help';
    case 'business':
    case 'negocios': return 'business';
    case 'poetry':
    case 'poesía': return 'poetry';
    case 'essay':
    case 'ensayo': return 'essay';
    case 'dystopia':
    case 'distopía': return 'dystopia';
    case 'humor': return 'humor';
    
    // Cómics
    case 'superhero':
    case 'superhéroes': return 'superhero';
    case 'graphic-novel':
    case 'novela gráfica': return 'graphic-novel';
    case 'manga': return 'manga';
    case 'indie':
    case 'independiente': return 'indie';
    
    // Música
    case 'pop': return 'pop';
    case 'rock': return 'rock';
    case 'rap': return 'rap';
    case 'rumba': return 'rumba';
    case 'classical':
    case 'clásica': return 'classical';
    case 'electronic':
    case 'electrónica': return 'electronic';
    case 'reggae': return 'reggae';
    case 'metal': return 'metal';
    case 'flamenco': return 'flamenco';
    case 'ethnic':
    case 'étnica': return 'ethnic';
    case 'punk': return 'punk';
    case 'chillout':
    case 'chill out': return 'chillout';
    case 'dub': return 'dub';
    case 'others':
    case 'otros': return 'others';
    case 'trap': return 'trap';
    
    // Videojuegos
    case 'rpg': return 'rpg';
    case 'shooter':
    case 'disparos': return 'shooter';
    case 'strategy':
    case 'estrategia': return 'strategy';
    case 'sandbox':
    case 'mundo abierto': return 'sandbox';
    case 'indie':
    case 'independiente': return 'indie';
    case 'platformer':
    case 'plataformas': return 'platformer';
    case 'sports':
    case 'deportes': return 'sports';
    case 'retro': return 'retro';
    
    // Juegos de Mesa
    case 'family':
    case 'familiar': return 'family';
    case 'abstract':
    case 'abstracto': return 'abstract';
    case 'cooperative':
    case 'cooperativo': return 'cooperative';
    case 'dice':
    case 'dados': return 'dice';
    case 'cards':
    case 'cartas': return 'cards';
    case 'civilization':
    case 'civilización': return 'civilization';
    case 'party':
    case 'fiesta': return 'party';
    case 'deduction':
    case 'deducción': return 'deduction';
    case 'solo':
    case 'solitario': return 'solo';
    case 'economic':
    case 'económico': return 'economic';
    case 'thematic':
    case 'temático': return 'thematic';
    
    // Podcasts
    case 'news':
    case 'noticias': return 'news';
    case 'inspiration':
    case 'inspiración': return 'inspiration';
    case 'education':
    case 'educación': return 'education';
    case 'technology':
    case 'tecnología': return 'technology';
    
    default: return normalized;
  }
};

// Función para traducir subcategorías normalizadas
const translateSubcategory = (normalizedSubcategory: string, lang: string): string => {
  if (lang === 'es') {
    switch (normalizedSubcategory) {
      // Películas
      case 'action': return 'acción';
      case 'animation': return 'animación';
      case 'fantasy': return 'fantasía';
      case 'comedy': return 'comedia';
      case 'adventure': return 'aventura';
      case 'sci-fi': return 'ciencia ficción';
      case 'horror': return 'terror';
      case 'thriller': return 'thriller';
      case 'drama': return 'drama';
      case 'war': return 'guerra';
      case 'western': return 'western';
      case 'romance': return 'romance';
      case 'mystery': return 'misterio';
      case 'biographical': return 'biográfico';
      
      // Series
      case 'medical': return 'médica';
      case 'crime': return 'crimen';
      case 'historical': return 'histórica';
      
      // Documentales
      case 'nature': return 'naturaleza';
      case 'history': return 'historia';
      case 'science': return 'ciencia';
      case 'technology': return 'tecnología';
      case 'society': return 'sociedad';
      case 'art': return 'arte';
      case 'sports': return 'deportes';
      case 'travel': return 'viajes';
      case 'biography': return 'biografía';
      case 'politics': return 'política';
      case 'psychology': return 'psicología';
      case 'culture': return 'cultura';
      case 'food': return 'gastronomía';
      case 'spirituality': return 'espiritualidad';
      case 'health': return 'salud';
      case 'economics': return 'economía';
      case 'environment': return 'medio ambiente';
      case 'others': return 'otros';
      case 'aesthetic': return 'estética';
      case 'exploration': return 'exploración';
      case 'faith': return 'fe';
      case 'gastronomy': return 'gastronomía';
      case 'justice': return 'justicia';
      case 'mind': return 'mente';
      case 'past': return 'pasado';
      case 'people': return 'personas';
      case 'wildlife': return 'vida salvaje';
      
      // Libros
      case 'clasic': return 'clásico';
      case 'philosophy': return 'filosofía';
      case 'sociology': return 'sociología';
      case 'self-help': return 'autoayuda';
      case 'business': return 'negocios';
      case 'poetry': return 'poesía';
      case 'essay': return 'ensayo';
      case 'dystopia': return 'distopía';
      
      // Cómics
      case 'superhero': return 'superhéroes';
      case 'graphic-novel': return 'novela gráfica';
      case 'indie': return 'independiente';
      
      // Música
      case 'classical': return 'clásica';
      case 'electronic': return 'electrónica';
      case 'ethnic': return 'étnica';
      case 'chillout': return 'chill out';
      
      // Videojuegos
      case 'shooter': return 'disparos';
      case 'strategy': return 'estrategia';
      case 'sandbox': return 'mundo abierto';
      case 'platformer': return 'plataformas';
      
      // Juegos de Mesa
      case 'family': return 'familiar';
      case 'abstract': return 'abstracto';
      case 'cooperative': return 'cooperativo';
      case 'dice': return 'dados';
      case 'cards': return 'cartas';
      case 'civilization': return 'civilización';
      case 'party': return 'fiesta';
      case 'deduction': return 'deducción';
      case 'solo': return 'solitario';
      case 'economic': return 'económico';
      case 'thematic': return 'temático';
      
      // Podcasts
      case 'news': return 'noticias';
      case 'inspiration': return 'inspiración';
      case 'education': return 'educación';
      
      default: return normalizedSubcategory;
    }
  } else {
    switch (normalizedSubcategory) {
      // Películas
      case 'acción': return 'action';
      case 'animación': return 'animation';
      case 'fantasía': return 'fantasy';
      case 'comedia': return 'comedy';
      case 'aventura': return 'adventure';
      case 'ciencia ficción': return 'sci-fi';
      case 'terror': return 'horror';
      case 'guerra': return 'war';
      case 'misterio': return 'mystery';
      case 'biográfico': return 'biographical';
      
      // Series
      case 'médica': return 'medical';
      case 'crimen': return 'crime';
      case 'histórica': return 'historical';
      
      // Documentales
      case 'naturaleza': return 'nature';
      case 'historia': return 'history';
      case 'ciencia': return 'science';
      case 'tecnología': return 'technology';
      case 'sociedad': return 'society';
      case 'arte': return 'art';
      case 'deportes': return 'sports';
      case 'viajes': return 'travel';
      case 'biografía': return 'biography';
      case 'política': return 'politics';
      case 'psicología': return 'psychology';
      case 'cultura': return 'culture';
      case 'gastronomía': return 'food';
      case 'espiritualidad': return 'spirituality';
      case 'salud': return 'health';
      case 'economía': return 'economics';
      case 'medio ambiente': return 'environment';
      case 'otros': return 'others';
      case 'estética': return 'aesthetic';
      case 'exploración': return 'exploration';
      case 'fe': return 'faith';
      case 'justicia': return 'justice';
      case 'mente': return 'mind';
      case 'pasado': return 'past';
      case 'personas': return 'people';
      case 'vida salvaje': return 'wildlife';
      
      // Libros
      case 'clásico': return 'clasic';
      case 'filosofía': return 'philosophy';
      case 'sociología': return 'sociology';
      case 'autoayuda': return 'self-help';
      case 'negocios': return 'business';
      case 'poesía': return 'poetry';
      case 'ensayo': return 'essay';
      case 'distopía': return 'dystopia';
      
      // Cómics
      case 'superhéroes': return 'superhero';
      case 'novela gráfica': return 'graphic-novel';
      case 'independiente': return 'indie';
      
      // Música
      case 'clásica': return 'classical';
      case 'electrónica': return 'electronic';
      case 'étnica': return 'ethnic';
      case 'chill out': return 'chillout';
      
      // Videojuegos
      case 'disparos': return 'shooter';
      case 'estrategia': return 'strategy';
      case 'mundo abierto': return 'sandbox';
      case 'plataformas': return 'platformer';
      
      // Juegos de Mesa
      case 'familiar': return 'family';
      case 'abstracto': return 'abstract';
      case 'cooperativo': return 'cooperative';
      case 'dados': return 'dice';
      case 'cartas': return 'cards';
      case 'civilización': return 'civilization';
      case 'fiesta': return 'party';
      case 'deducción': return 'deduction';
      case 'solitario': return 'solo';
      case 'económico': return 'economic';
      case 'temático': return 'thematic';
      
      // Podcasts
      case 'noticias': return 'news';
      case 'inspiración': return 'inspiration';
      case 'educación': return 'education';
      
      default: return normalizedSubcategory;
    }
  }
};

// Función para normalizar subcategorías (pública)
export const normalizeSubcategory = (subcategory: string, lang: string): string => {
  const normalized = normalizeSubcategoryInternal(subcategory);
  return translateSubcategory(normalized, lang);
};

// Interface para items con subcategoría
interface ItemWithSubcategory {
  subcategory: string;
  [key: string]: any;
}

// Función para filtrar items por subcategoría
export const filterItemsBySubcategory = (items: ItemWithSubcategory[], subcategory: string, lang: string): ItemWithSubcategory[] => {
  const normalizedSubcategory = normalizeSubcategoryInternal(subcategory);
  return items.filter(item => 
    normalizeSubcategoryInternal(item.subcategory) === normalizedSubcategory
  );
};

// Función para obtener subcategorías únicas
export const getUniqueSubcategories = (items: ItemWithSubcategory[], lang: string): string[] => {
  const subcategories = new Set(
    items.map(item => normalizeSubcategoryInternal(item.subcategory))
  );
  return Array.from(subcategories).filter(Boolean);
};

// Helpers para categorías y colores
// getCategoryColor centralizado en categoryPalette.js, eliminar duplicados

// Función utilitaria para obtener el degradado de la categoría
import { getCategoryGradient as getCentralizedCategoryGradient } from './categoryPalette';

export function getCategoryGradient(category: string): string {
  return getCentralizedCategoryGradient(category);
}

// ...otros helpers de categorías a futuro... 