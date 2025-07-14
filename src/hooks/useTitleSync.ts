import { useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppData } from '../store/useAppStore';

export const useTitleSync = (): void => {
  const { lang } = useLanguage();
  const { updateTitleForLanguage, selectedCategory, title, getDefaultTitle, setTitle } = useAppData();

  useEffect(() => {
    updateTitleForLanguage(lang);
  }, [lang, selectedCategory, updateTitleForLanguage]);

  useEffect(() => {
    if (!title && !selectedCategory) {
      const defaultTitle = getDefaultTitle(lang);
      setTitle(defaultTitle);
    }
  }, [title, selectedCategory, lang, getDefaultTitle, setTitle]);
}; 