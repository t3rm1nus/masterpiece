import React, { createContext, useContext, useState, useEffect } from "react";
import texts from "./texts.json";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("es");
  const [t, setT] = useState(texts[lang]);

  useEffect(() => {
    setT(texts[lang]);
  }, [lang]);

  const changeLanguage = (lng) => setLang(lng);

  return (
    <LanguageContext.Provider value={{ lang, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
