import React from 'react';
import { useLanguage } from '../../LanguageContext';
import { MenuItem, Select, Box, Typography } from '@mui/material';

const LanguageSelector = ({ variant = 'desktop', sx = {} }) => {
  const { lang, changeLanguage, getTranslation } = useLanguage();

  if (variant === 'mobile') {
    // Para mobile, usar botones planos
    return (
      <Box sx={{ display: 'flex', gap: 1, ...sx }}>
        <button
          style={{
            minWidth: 60,
            background: lang === 'es' ? '#0078d4' : 'transparent',
            color: lang === 'es' ? '#fff' : '#0078d4',
            border: '1.5px solid #0078d4',
            borderRadius: 6,
            fontWeight: 'bold',
            padding: '4px 12px',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background 0.2s',
          }}
          onClick={() => changeLanguage('es')}
        >
          ES
        </button>
        <button
          style={{
            minWidth: 60,
            background: lang === 'en' ? '#0078d4' : 'transparent',
            color: lang === 'en' ? '#fff' : '#0078d4',
            border: '1.5px solid #0078d4',
            borderRadius: 6,
            fontWeight: 'bold',
            padding: '4px 12px',
            cursor: 'pointer',
            outline: 'none',
            transition: 'background 0.2s',
          }}
          onClick={() => changeLanguage('en')}
        >
          EN
        </button>
      </Box>
    );
  }

  // Para desktop, usar select clásico
  return (
    <Box sx={{ minWidth: 120, ...sx }}>
      <Select
        value={lang}
        onChange={e => changeLanguage(e.target.value)}
        size="small"
        sx={{ borderRadius: 2, fontSize: '1em', height: 36, ...sx }}
      >
        <MenuItem value="es">Español</MenuItem>
        <MenuItem value="en">English</MenuItem>
      </Select>
    </Box>
  );
};

export default LanguageSelector;
