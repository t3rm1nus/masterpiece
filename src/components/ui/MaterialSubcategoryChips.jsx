import React from 'react';
import { Chip, Box } from '@mui/material';

/**
 * MaterialSubcategoryChips (Material UI Subcategory Chip Group)
 * -----------------------------------------------------------------------------
 * Highly customizable, accessible group of subcategory chips using MUI.
 * - Designed for quick filtering and selection in subcategory UIs.
 * - Mobile-first, responsive, and keyboard accessible.
 * - Supports custom rendering, icons, and flexible styling.
 *
 * Performance & Mobile Optimizations:
 * - Minimal re-renders, only visible when needed.
 * - Uses flexbox for responsive wrapping and spacing.
 * - Chip states (filled/outlined) for clear selection feedback.
 *
 * Accessibility:
 * - All chips are focusable and operable via keyboard.
 * - Icons are optional and ARIA-compliant.
 *
 * Example usage:
 *   <MaterialSubcategoryChips subcategories={...} value={...} onChange={...} />
 *
 * -----------------------------------------------------------------------------
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
