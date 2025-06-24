import React from 'react';
import PropTypes from 'prop-types';
import { useAppTheme } from '../../store/useAppStore';
import { useLanguage } from '../../LanguageContext';
import UiButton from './UiButton';
import { Tooltip } from '@mui/material';

/**
 * ThemeToggle
 * Botón para alternar entre tema claro y oscuro.
 *
 * Props:
 * - showLabel: boolean (muestra el texto junto al icono)
 * - sx: estilos adicionales para el botón
 * - iconLight: icono personalizado para modo claro
 * - iconDark: icono personalizado para modo oscuro
 * - color: color del botón (default: secondary)
 * - variant: variante del botón (default: outlined)
 * - onToggle: callback opcional al cambiar el tema (recibe el nuevo valor)
 * - tooltip: string o ReactNode (tooltip personalizado, opcional)
 * - tooltipProps: objeto de props adicionales para el tooltip (opcional)
 * - size: string (tamaño del botón, default: 'medium')
 * - ariaLabel: string (etiqueta accesible personalizada)
 */
const ThemeToggle = ({
  sx = {},
  showLabel = false,
  iconLight,
  iconDark,
  color = 'secondary',
  variant = 'outlined',
  onToggle,
  tooltip,
  tooltipProps = {},
  size = 'medium',
  ariaLabel
}) => {
  const { theme, toggleTheme } = useAppTheme();
  const { getTranslation } = useLanguage();

  const handleClick = () => {
    toggleTheme();
    if (onToggle) onToggle(theme === 'light' ? 'dark' : 'light');
  };

  const defaultLightIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const defaultDarkIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="5" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const button = (
    <UiButton
      className="theme-toggle-btn"
      onClick={handleClick}
      variant={variant}
      color={color}
      size={size}
      aria-label={ariaLabel || (theme === 'light' ? getTranslation('ui.dark_mode', 'Modo oscuro') : getTranslation('ui.light_mode', 'Modo claro'))}
      sx={{
        background: 'transparent',
        border: '1.5px solid #888', // siempre gris
        color: 'var(--mui-color-secondary, #6d4aff)',
        borderRadius: '4px',
        padding: '6px 16px',
        minWidth: 40,
        minHeight: 36,
        fontSize: '1rem',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        margin: '0 0.5rem',
        transition: 'background 0.2s, border-color 0.2s',
        boxShadow: 'none',
        cursor: 'pointer',
        '&:hover': {
          background: 'rgba(109,74,255,0.04)',
          borderColor: '#888',
        },
        ...sx
      }}
    >
      {theme === 'light'
        ? (iconLight || defaultLightIcon)
        : (iconDark || defaultDarkIcon)}
      {showLabel && (
        <span style={{ marginLeft: 8, color: '#888' }}>
          {theme === 'light'
            ? getTranslation('ui.dark_mode', 'Modo oscuro')
            : getTranslation('ui.light_mode', 'Modo claro')}
        </span>
      )}
    </UiButton>
  );

  return tooltip ? (
    <Tooltip title={tooltip} {...tooltipProps}>
      <span>{button}</span>
    </Tooltip>
  ) : button;
};

ThemeToggle.propTypes = {
  showLabel: PropTypes.bool,
  sx: PropTypes.object,
  iconLight: PropTypes.node,
  iconDark: PropTypes.node,
  color: PropTypes.string,
  variant: PropTypes.string,
  onToggle: PropTypes.func,
  tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  tooltipProps: PropTypes.object,
  size: PropTypes.string,
  ariaLabel: PropTypes.string
};

export default ThemeToggle;
