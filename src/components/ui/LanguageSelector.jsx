import React from 'react';
import { useLanguage } from '../../LanguageContext';
import { MenuItem, Select, Box } from '@mui/material';
import UiButton from './UiButton';

/**
 * LanguageSelector
 * Componente parametrizable para selección de idioma.
 *
 * Props:
 * - languages: array de objetos { code, label, flag? } (idiomas a mostrar)
 * - onChange: función (callback al cambiar idioma)
 * - value: string (idioma seleccionado)
 * - variant: 'desktop' | 'mobile' (modo visual)
 * - sx: objeto de estilos MUI
 * - className: string (clase CSS adicional)
 * - showFlags: boolean (mostrar banderas)
 * - showLabels: boolean (mostrar etiquetas)
 * - buttonProps: props adicionales para los botones (mobile)
 * - selectProps: props adicionales para el Select (desktop)
 */
const LanguageSelector = ({
  languages = [
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ],
  onChange,
  value,
  variant = 'desktop',
  sx = {},
  className = '',
  showFlags = false,
  showLabels = true,
  buttonProps = {},
  selectProps = {},
}) => {
  // Soporte para contexto legacy si no se pasan props controlados
  const ctx = useLanguage?.() || {};
  const lang = value ?? ctx.lang;
  const handleChange = onChange || ctx.changeLanguage;

  if (variant === 'mobile') {
    return (
      <Box sx={{ display: 'flex', gap: 1, ...sx }} className={className}>
        {languages.map(l => (
          <UiButton
            key={l.code}
            variant={lang === l.code ? 'contained' : 'outlined'}
            color="primary"
            size="small"
            onClick={() => handleChange?.(l.code)}
            sx={{ minWidth: 60, borderRadius: 6, fontWeight: 'bold', padding: '4px 12px' }}
            {...buttonProps}
          >
            {showFlags && l.flag ? (
              <span style={{ marginRight: showLabels ? 6 : 0 }}>{l.flag}</span>
            ) : null}
            {showLabels ? l.label || l.code.toUpperCase() : null}
          </UiButton>
        ))}
      </Box>
    );
  }

  // Desktop: Select clásico
  return (
    <Box sx={{ minWidth: 120, ...sx }} className={className}>
      <Select
        value={lang}
        onChange={e => handleChange?.(e.target.value)}
        size="small"
        sx={{ borderRadius: 2, fontSize: '1em', height: 36, ...sx }}
        {...selectProps}
      >
        {languages.map(l => (
          <MenuItem value={l.code} key={l.code}>
            {showFlags && l.flag ? (
              <span style={{ marginRight: showLabels ? 8 : 0 }}>{l.flag}</span>
            ) : null}
            {showLabels ? l.label || l.code.toUpperCase() : null}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default LanguageSelector;
