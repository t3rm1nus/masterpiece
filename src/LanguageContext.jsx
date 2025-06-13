import React, { createContext, useContext } from "react";
import useLanguageStore from "./store/languageStore";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Usamos el store de idioma
  const { 
    lang, 
    translations: t, 
    setLanguage, 
    getTranslation, 
    getCategoryTranslation,
    getSubcategoryTranslation 
  } = useLanguageStore();

  const changeLanguage = (lng) => setLanguage(lng);

  // Proporcionamos tanto el acceso al store como funciones de conveniencia
  return (
    <LanguageContext.Provider value={{ 
      lang, 
      t, 
      changeLanguage, 
      getTranslation,
      getCategoryTranslation,
      getSubcategoryTranslation
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
