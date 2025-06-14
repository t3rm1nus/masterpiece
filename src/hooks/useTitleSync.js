import { useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import useDataStore from '../store/dataStore';

// Hook personalizado para sincronizar el título con el idioma
export const useTitleSync = () => {
  const { lang } = useLanguage();
  const { updateTitleForLanguage, selectedCategory, title, getDefaultTitle, setTitle } = useDataStore();

  useEffect(() => {
    // Actualizar título cuando cambia el idioma
    updateTitleForLanguage(lang);
  }, [lang, updateTitleForLanguage]);

  useEffect(() => {
    // Inicializar título si no existe
    if (!title && !selectedCategory) {
      const defaultTitle = getDefaultTitle(lang);
      setTitle(defaultTitle);
    }
  }, [title, selectedCategory, lang, getDefaultTitle, setTitle]);
};
