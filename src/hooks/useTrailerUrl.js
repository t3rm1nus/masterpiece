// Hook para obtener la URL del trailer según idioma
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
