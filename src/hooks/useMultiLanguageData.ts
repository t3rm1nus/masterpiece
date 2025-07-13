/**
 * useMultiLanguageData
 * Hook centralizado para manejar datos multiidioma de manera consistente.
 * - Proporciona helpers para extraer y procesar campos localizados (título, descripción, trailer, etc.).
 * - Facilita la migración y mantenimiento de lógica multiidioma.
 * - Devuelve funciones para obtener contenido localizado, truncar texto, etc.
 */

import { useCallback } from 'react';
import { useLanguage } from '../LanguageContext';
import { Language } from '../types';
import { Item } from '../types/data';

// Tipos para contenido localizado
type LocalizedContent = string | Record<Language, string> | Record<string, string>;

// Tipo para item localizado
type LocalizedItem = Item & {
  localizedTitle: string;
  localizedDescription: string;
  localizedTrailer: string;
};

// Tipo de retorno del hook
type MultiLanguageDataReturn = {
  getLocalizedContent: (content: LocalizedContent, fallback?: string) => string;
  getTitle: (title: LocalizedContent, name?: string | null, fallback?: string) => string;
  getDescription: (description: LocalizedContent, fallback?: string) => string;
  getString: (value: any, fallback?: string) => string;
  getTrailerUrl: (trailer: LocalizedContent) => string;
  getItemField: (item: any, field: string, fallback?: string) => string;
  getLocalizedItem: (item: any) => LocalizedItem | null;
  truncateText: (text: string, maxLength?: number, suffix?: string) => string;
  currentLanguage: Language;
};

/**
 * Hook centralizado para manejar datos multiidioma de manera consistente
 * Reemplaza las funciones duplicadas processTitle, processDescription, ensureString, etc.
 */
export const useMultiLanguageData = (): MultiLanguageDataReturn => {
  const { lang } = useLanguage();

  /**
   * Extrae contenido localizado de un campo que puede ser string o objeto {es, en}
   * @param content - El contenido que puede ser string o objeto
   * @param fallback - Valor por defecto si no se encuentra contenido
   * @returns El contenido en el idioma actual
   */
  const getLocalizedContent = useCallback((content: LocalizedContent, fallback: string = ''): string => {
    // Si es null o undefined, devolver fallback
    if (content == null) {
      return fallback;
    }

    // Si ya es un string, devolverlo directamente
    if (typeof content === 'string') {
      return content;
    }

    // Si es un objeto con idiomas
    if (typeof content === 'object' && content !== null) {
      // Priorizar idioma actual, luego español, luego inglés, luego cualquier valor disponible
      return content[lang] || 
             content.es || 
             content.en || 
             Object.values(content)[0] || 
             fallback;
    }

    // Para números, booleanos, etc., convertir a string
    return String(content);
  }, [lang]);

  /**
   * Procesa títulos de items (reemplaza processTitle)
   * @param title - El título del item
   * @param name - Nombre alternativo si no hay título
   * @param fallback - Texto por defecto
   * @returns El título procesado
   */
  const getTitle = useCallback((title: LocalizedContent, name: string | null = null, fallback: string = 'Sin título'): string => {
    return getLocalizedContent(title || name, fallback);
  }, [getLocalizedContent]);

  /**
   * Procesa descripciones de items (reemplaza processDescription)
   * @param description - La descripción del item
   * @param fallback - Texto por defecto
   * @returns La descripción procesada
   */
  const getDescription = useCallback((description: LocalizedContent, fallback: string = ''): string => {
    return getLocalizedContent(description, fallback);
  }, [getLocalizedContent]);

  /**
   * Procesa cualquier campo de texto (reemplaza ensureString)
   * @param value - El valor a procesar
   * @param fallback - Valor por defecto
   * @returns El valor como string
   */
  const getString = useCallback((value: any, fallback: string = ''): string => {
    return getLocalizedContent(value, fallback);
  }, [getLocalizedContent]);

  /**
   * Procesa URLs de trailers con idioma
   * @param trailer - La URL del trailer
   * @returns La URL del trailer en el idioma actual
   */
  const getTrailerUrl = useCallback((trailer: LocalizedContent): string => {
    return getLocalizedContent(trailer, '');
  }, [getLocalizedContent]);

  /**
   * Procesa cualquier campo de un item con soporte multiidioma
   * @param item - El item completo
   * @param field - El campo a extraer (ej: 'title', 'description')
   * @param fallback - Valor por defecto
   * @returns El valor del campo procesado
   */
  const getItemField = useCallback((item: any, field: string, fallback: string = ''): string => {
    if (!item || !field) return fallback;
    return getLocalizedContent(item[field], fallback);
  }, [getLocalizedContent]);

  /**
   * Procesa un item completo, devolviendo un objeto con todos los campos localizados
   * @param item - El item original
   * @returns Item con campos localizados
   */
  const getLocalizedItem = useCallback((item: any): LocalizedItem | null => {
    if (!item) return null;

    return {
      ...item,
      localizedTitle: getTitle(item.title, item.name),
      localizedDescription: getDescription(item.description),
      localizedTrailer: getTrailerUrl(item.trailer),
      // Preservar campos originales para compatibilidad
      title: getTitle(item.title, item.name),
      description: getDescription(item.description)
    };
  }, [getTitle, getDescription, getTrailerUrl]);

  /**
   * Trunca texto a una longitud específica
   * @param text - Texto a truncar
   * @param maxLength - Longitud máxima
   * @param suffix - Sufijo para indicar truncamiento
   * @returns Texto truncado
   */
  const truncateText = useCallback((text: string, maxLength: number = 150, suffix: string = '...'): string => {
    if (!text || typeof text !== 'string') return '';
    
    if (text.length <= maxLength) return text;
    
    // Truncar en el último espacio antes del límite para evitar cortar palabras
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + suffix;
    }
    
    return truncated + suffix;
  }, []);

  return {
    // Funciones principales
    getLocalizedContent,
    getTitle,
    getDescription,
    getString,
    getTrailerUrl,
    getItemField,
    getLocalizedItem,
    truncateText,
    
    // Idioma actual
    currentLanguage: lang
  };
};

export default useMultiLanguageData;
