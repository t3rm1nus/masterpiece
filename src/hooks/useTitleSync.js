import { useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import useFiltersStore from '../store/filtersStore';
import useAppDataStore from '../store/appDataStore';

// Hook personalizado para sincronizar el título con el idioma
export const useTitleSync = () => {
  const { lang } = useLanguage();
  const { updateTitleForLanguage, selectedCategory, title } = useFiltersStore();
  const { getDefaultTitle } = useAppDataStore();

  useEffect(() => {
    // Actualizar título cuando cambia el idioma
    updateTitleForLanguage(lang);
  }, [lang, updateTitleForLanguage]);

  useEffect(() => {
    // Inicializar título si no existe
    if (!title && !selectedCategory) {
      const defaultTitle = getDefaultTitle(lang);
      useFiltersStore.getState().setTitle(defaultTitle);
    }
  }, [title, selectedCategory, lang, getDefaultTitle]);
};
