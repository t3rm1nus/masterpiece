import { useCallback } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppView, useAppData, useAppTheme } from '../store/useAppStore';

export const useRecommendationLogic = (onItemClick) => {
  const { lang } = useLanguage();
  const { goToDetail } = useAppView();
  const { randomNotFoundImage } = useAppData();
  const { getMasterpieceBadgeConfig } = useAppTheme();
  
  const badgeConfig = getMasterpieceBadgeConfig();

  // Funciones utilitarias
  const processMultiLanguageField = useCallback((field) => {
    if (!field) return '';
    if (typeof field === 'object' && field !== null) {
      return field[lang] || field['es'] || field['en'] || Object.values(field)[0] || '';
    }
    return field.toString();
  }, [lang]);

  const truncateDescription = useCallback((description, maxLength = 150) => {
    if (!description) return '';
    return description.length > maxLength 
      ? description.substring(0, maxLength).trim() + '...'
      : description;
  }, []);

  const normalizeRecommendation = useCallback((rec) => ({
    ...rec,
    description: rec.description || rec.descripcion,
    subcategory: rec.subcategory || (rec.category !== 'documentales' ? rec.category : null),
    category: rec.category === 'documentales' ? 'documentales' : 
             (['politics', 'history', 'science', 'nature', 'culture', 'crime', 'art'].includes(rec.category)) 
               ? 'documentales' 
               : rec.category,
    image: rec.image || '/favicon.png'
  }), []);

  const getCardClasses = useCallback((item) => {
    let classes = 'recommendation-card';
    if (item?.category) classes += ` ${item.category}`;
    if (item?.masterpiece) classes += ' masterpiece';
    return classes;
  }, []);

  const handleItemClick = useCallback((item) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      goToDetail(item);
    }
  }, [goToDetail, onItemClick]);

  return {
    processMultiLanguageField,
    truncateDescription,
    normalizeRecommendation,
    getCardClasses,
    handleItemClick,
    badgeConfig,
    randomNotFoundImage
  };
};