import { useLanguage } from '../LanguageContext';

type TrailerType = string | { es?: string; en?: string; [key: string]: string | undefined };

export function useTrailerUrl(trailer: TrailerType | null | undefined): string | null {
  const { lang } = useLanguage();
  if (!trailer) return null;
  if (typeof trailer === 'object') {
    if (lang === 'es' && trailer.es) {
      return trailer.es;
    } else if (lang === 'en' && trailer.en) {
      return trailer.en;
    } else if (trailer.es) {
      return trailer.es;
    } else if (trailer.en) {
      return trailer.en;
    }
    // Si hay otros idiomas, devolver el primero disponible
    const values = Object.values(trailer).filter(Boolean);
    if (values.length > 0) return values[0] as string;
    return null;
  }
  if (typeof trailer === 'string') {
    return trailer;
  }
  return null;
} 