import { useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { useAppData } from '../store/useAppStore';

// =============================================
// useTitleSync: Hook para sincronizar dinámicamente el título de la página
// Sincroniza el título con el idioma y la categoría seleccionada, optimizando para SEO y experiencia de usuario.
// =============================================
export const useTitleSync = () => {
  const { lang } = useLanguage();
  const { updateTitleForLanguage, selectedCategory, title, getDefaultTitle, setTitle } = useAppData();

  useEffect(() => {
    // Actualizar título cuando cambia el idioma o la categoría seleccionada
    updateTitleForLanguage(lang);
  }, [lang, selectedCategory, updateTitleForLanguage]);

  useEffect(() => {
    // Inicializar título si no existe
    if (!title && !selectedCategory) {
      const defaultTitle = getDefaultTitle(lang);
      setTitle(defaultTitle);
    }
  }, [title, selectedCategory, lang, getDefaultTitle, setTitle]);
};
