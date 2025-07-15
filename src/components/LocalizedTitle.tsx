// =============================================
// LocalizedTitle: Componente de título localizado
// Componente de título localizado. Optimizado para internacionalización y SEO dinámico.
// =============================================

import React from 'react';

interface LocalizedTitleProps {
  title: string;
  lang?: string;
}

const LocalizedTitle: React.FC<LocalizedTitleProps> = ({ title, lang = 'es' }) => {
  return (
    <h1 lang={lang} style={{ fontWeight: 700, fontSize: '2rem', margin: '0.5em 0' }}>{title}</h1>
  );
};

export default LocalizedTitle; 