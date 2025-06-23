import React from 'react';
import { Chip, Box } from '@mui/material';

/**
 * MaterialSubcategoryChips
 * Renderiza una lista de chips de subcategoría altamente parametrizable.
 *
 * Props:
 * - subcategories: array de objetos { key, label, icon? } (subcategorías a mostrar)
 * - value: string (subcategoría seleccionada)
 * - onChange: función (callback al seleccionar subcategoría)
 * - renderChip: función opcional para customizar el render de cada chip `(subcat, selected, idx) => ReactNode`
 * - sx: estilos adicionales para el contenedor
 * - chipSx: estilos adicionales para cada chip
 * - visible: boolean (si se muestra el componente, default: true)
 * - showIcons: boolean (mostrar iconos si existen)
 * - ...props: cualquier otro prop para el contenedor
 */
const MaterialSubcategoryChips = ({
  subcategories = [],
  value,
  onChange,
  renderChip,
  sx = {},
  chipSx = {},
  visible = true,
  showIcons = false,
  ...props
}) => {
  if (!visible) return null;
  return (
    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ...sx }} {...props}>
      {subcategories.map((subcat, idx) =>
        renderChip ? (
          renderChip(subcat, value === subcat.key, idx)
        ) : (
          <Chip
            key={subcat.key}
            label={subcat.label}
            icon={showIcons && subcat.icon ? subcat.icon : undefined}
            color={value === subcat.key ? 'primary' : 'default'}
            variant={value === subcat.key ? 'filled' : 'outlined'}
            onClick={() => onChange && onChange(subcat.key)}
            sx={{ fontWeight: 500, ...chipSx }}
          />
        )
      )}
    </Box>
  );
};

export default MaterialSubcategoryChips;
