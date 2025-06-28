/**
 * useMultiLanguageData
 * Hook centralizado para manejar datos multiidioma de manera consistente.
 * - Proporciona helpers para extraer y procesar campos localizados (título, descripción, trailer, etc.).
 * - Facilita la migración y mantenimiento de lógica multiidioma.
 * - Devuelve funciones para obtener contenido localizado, truncar texto, etc.
 */

import { useCallback } from 'react';
import { useLanguage } from '../LanguageContext';

/**
 * Hook centralizado para manejar datos multiidioma de manera consistente
 * Reemplaza las funciones duplicadas processTitle, processDescription, ensureString, etc.
 */
export const useMultiLanguageData = () => {
  const { lang } = useLanguage();

  /**
   * Extrae contenido localizado de un campo que puede ser string o objeto {es, en}
   * @param {string|Object} content - El contenido que puede ser string o objeto
   * @param {string} fallback - Valor por defecto si no se encuentra contenido
   * @returns {string} - El contenido en el idioma actual
   */
  const getLocalizedContent = useCallback((content, fallback = '') => {
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
   * @param {string|Object} title - El título del item
   * @param {string} name - Nombre alternativo si no hay título
   * @param {string} fallback - Texto por defecto
   * @returns {string} - El título procesado
   */
  const getTitle = useCallback((title, name = null, fallback = 'Sin título') => {
    return getLocalizedContent(title || name, fallback);
  }, [getLocalizedContent]);

  /**
   * Procesa descripciones de items (reemplaza processDescription)
   * @param {string|Object} description - La descripción del item
   * @param {string} fallback - Texto por defecto
   * @returns {string} - La descripción procesada
   */
  const getDescription = useCallback((description, fallback = '') => {
    return getLocalizedContent(description, fallback);
  }, [getLocalizedContent]);

  /**
   * Procesa cualquier campo de texto (reemplaza ensureString)
   * @param {any} value - El valor a procesar
   * @param {string} fallback - Valor por defecto
   * @returns {string} - El valor como string
   */
  const getString = useCallback((value, fallback = '') => {
    return getLocalizedContent(value, fallback);
  }, [getLocalizedContent]);

  /**
   * Procesa URLs de trailers con idioma
   * @param {string|Object} trailer - La URL del trailer
   * @returns {string} - La URL del trailer en el idioma actual
   */
  const getTrailerUrl = useCallback((trailer) => {
    return getLocalizedContent(trailer, '');
  }, [getLocalizedContent]);

  /**
   * Procesa cualquier campo de un item con soporte multiidioma
   * @param {Object} item - El item completo
   * @param {string} field - El campo a extraer (ej: 'title', 'description')
   * @param {string} fallback - Valor por defecto
   * @returns {string} - El valor del campo procesado
   */
  const getItemField = useCallback((item, field, fallback = '') => {
    if (!item || !field) return fallback;
    return getLocalizedContent(item[field], fallback);
  }, [getLocalizedContent]);

  /**
   * Procesa un item completo, devolviendo un objeto con todos los campos localizados
   * @param {Object} item - El item original
   * @returns {Object} - Item con campos localizados
   */
  const getLocalizedItem = useCallback((item) => {
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
   * @param {string} text - Texto a truncar
   * @param {number} maxLength - Longitud máxima
   * @param {string} suffix - Sufijo para indicar truncamiento
   * @returns {string} - Texto truncado
   */
  const truncateText = useCallback((text, maxLength = 150, suffix = '...') => {
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
