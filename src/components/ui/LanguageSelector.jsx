import React from 'react';
import { useLanguage } from '../../LanguageContext';
import { MenuItem, Select, Box, Typography } from '@mui/material';
import UiButton from './UiButton';

const LanguageSelector = ({ variant = 'desktop', sx = {} }) => {
  const { lang, changeLanguage, getTranslation } = useLanguage();

  if (variant === 'mobile') {
    // Para mobile, usar UiButton planos
    return (
      <Box sx={{ display: 'flex', gap: 1, ...sx }}>
        <UiButton
          variant={lang === 'es' ? 'contained' : 'outlined'}
          color="primary"
          size="small"
          onClick={() => changeLanguage('es')}
          sx={{ minWidth: 60, borderRadius: 6, fontWeight: 'bold', padding: '4px 12px' }}
        >
          ES
        </UiButton>
        <UiButton
          variant={lang === 'en' ? 'contained' : 'outlined'}
          color="primary"
          size="small"
          onClick={() => changeLanguage('en')}
          sx={{ minWidth: 60, borderRadius: 6, fontWeight: 'bold', padding: '4px 12px' }}
        >
          EN
        </UiButton>
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
