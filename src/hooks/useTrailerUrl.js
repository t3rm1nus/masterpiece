// =============================================
// useTrailerUrl: Hook para obtener la URL del trailer según idioma
// Devuelve la URL del trailer más adecuada según el idioma activo, optimizando la experiencia multilenguaje.
// =============================================
import { useLanguage } from '../LanguageContext';

export function useTrailerUrl(trailer) {
  const { lang } = useLanguage();
  if (!trailer) return null;
  if (lang === 'es' && trailer.es) {
    return trailer.es;
  } else if (lang === 'en' && trailer.en) {
    return trailer.en;
  } else if (typeof trailer === 'string') {
    return trailer;
  } else if (trailer.es) {
    return trailer.es;
  } else if (trailer.en) {
    return trailer.en;
  }
  return null;
}
