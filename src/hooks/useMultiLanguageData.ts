import { useCallback } from 'react';
import { useLanguage } from '../LanguageContext';

type LocalizedString = string | { [lang: string]: string };

type Item = {
  [key: string]: any;
  title?: LocalizedString;
  name?: string;
  description?: LocalizedString;
  trailer?: LocalizedString;
};

interface UseMultiLanguageDataReturn {
  getLocalizedContent: (content: LocalizedString, fallback?: string) => string;
  getTitle: (title: LocalizedString, name?: string | null, fallback?: string) => string;
  getDescription: (description: LocalizedString, fallback?: string) => string;
  getString: (value: any, fallback?: string) => string;
  getTrailerUrl: (trailer: LocalizedString) => string;
  getItemField: (item: Item, field: string, fallback?: string) => string;
  getLocalizedItem: (item: Item) => Item | null;
  truncateText: (text: string, maxLength?: number, suffix?: string) => string;
  currentLanguage: string;
}

export const useMultiLanguageData = (): UseMultiLanguageDataReturn => {
  const { lang } = useLanguage();

  const getLocalizedContent = useCallback((content: LocalizedString, fallback: string = ''): string => {
    if (content == null) {
      return fallback;
    }
    if (typeof content === 'string') {
      return content;
    }
    if (typeof content === 'object' && content !== null) {
      return content[lang] || content.es || content.en || Object.values(content)[0] || fallback;
    }
    return String(content);
  }, [lang]);

  const getTitle = useCallback((title: LocalizedString, name: string | null = null, fallback: string = 'Sin título'): string => {
    return getLocalizedContent(title ?? (name ?? ''), fallback);
  }, [getLocalizedContent]);

  const getDescription = useCallback((description: LocalizedString, fallback: string = ''): string => {
    return getLocalizedContent(description, fallback);
  }, [getLocalizedContent]);

  const getString = useCallback((value: any, fallback: string = ''): string => {
    return getLocalizedContent(value, fallback);
  }, [getLocalizedContent]);

  const getTrailerUrl = useCallback((trailer: LocalizedString): string => {
    return getLocalizedContent(trailer, '');
  }, [getLocalizedContent]);

  const getItemField = useCallback((item: Item, field: string, fallback: string = ''): string => {
    if (!item || !field) return fallback;
    return getLocalizedContent(item[field], fallback);
  }, [getLocalizedContent]);

  const getLocalizedItem = useCallback((item: Item): Item | null => {
    if (!item) return null;
    return {
      ...item,
      localizedTitle: getTitle(item.title ?? '', item.name ?? ''),
      localizedDescription: getDescription(item.description ?? ''),
      localizedTrailer: getTrailerUrl(item.trailer ?? ''),
      title: getTitle(item.title ?? '', item.name ?? ''),
      description: getDescription(item.description ?? '')
    };
  }, [getTitle, getDescription, getTrailerUrl]);

  const truncateText = useCallback((text: string, maxLength: number = 150, suffix: string = '...'): string => {
    if (!text || typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + suffix;
    }
    return truncated + suffix;
  }, []);

  return {
    getLocalizedContent,
    getTitle,
    getDescription,
    getString,
    getTrailerUrl,
    getItemField,
    getLocalizedItem,
    truncateText,
    currentLanguage: lang
  };
};

export default useMultiLanguageData; 