import React from 'react';
import { Button, Box } from '@mui/material';

/**
 * MaterialCategoryButtons
 * Renderiza una lista de botones de categoría altamente parametrizable.
 *
 * Props:
 * - categories: array de objetos { key, label, icon? } (categorías a mostrar)
 * - value: string (categoría seleccionada)
 * - onChange: función (callback al seleccionar categoría)
 * - renderButton: función opcional para customizar el render de cada botón `(cat, selected, idx) => ReactNode`
 * - sx: estilos adicionales para el contenedor
 * - buttonSx: estilos adicionales para cada botón
 * - visible: boolean (si se muestra el componente, default: true)
 * - showIcons: boolean (mostrar iconos si existen)
 * - ...props: cualquier otro prop para el contenedor
 */
const MaterialCategoryButtons = ({
  categories = [],
  value,
  onChange,
  renderButton,
  sx = {},
  buttonSx = {},
  visible = true,
  showIcons = false,
  ...props
}) => {
  if (!visible) return null;
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ...sx }} {...props}>
      {categories.map((cat, idx) =>
        renderButton ? (
          renderButton(cat, value === cat.key, idx)
        ) : (
          <Button
            key={cat.key}
            startIcon={showIcons && cat.icon ? cat.icon : undefined}
            variant={value === cat.key ? 'contained' : 'outlined'}
            color={value === cat.key ? 'primary' : 'inherit'}
            onClick={() => onChange && onChange(cat.key)}
            sx={{ fontWeight: 600, textTransform: 'none', ...buttonSx }}
          >
            {cat.label}
          </Button>
        )
      )}
    </Box>
  );
};

export default MaterialCategoryButtons;
