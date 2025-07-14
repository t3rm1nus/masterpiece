import React from 'react';
import { Button, Box, ButtonProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

/**
 * MaterialCategoryButtons (Material UI Category Button Group)
 * -----------------------------------------------------------------------------
 * Highly customizable, accessible group of category buttons using MUI.
 * - Designed for fast navigation and clear selection in category-based UIs.
 * - Mobile-first, responsive, and keyboard accessible.
 * - Supports custom rendering, icons, and flexible styling.
 *
 * Performance & Mobile Optimizations:
 * - Minimal re-renders, only visible when needed.
 * - Uses flexbox for responsive wrapping and spacing.
 * - Button states (contained/outlined) for clear selection feedback.
 *
 * Accessibility:
 * - All buttons are focusable and operable via keyboard.
 * - Icons are optional and ARIA-compliant.
 *
 * Example usage:
 *   <MaterialCategoryButtons categories={...} value={...} onChange={...} />
 *
 * -----------------------------------------------------------------------------
 */

interface Category {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

interface MaterialCategoryButtonsProps {
  categories?: Category[];
  value?: string;
  onChange?: (categoryKey: string) => void;
  renderButton?: (category: Category, isSelected: boolean, index: number) => React.ReactNode;
  sx?: SxProps<Theme>;
  buttonSx?: SxProps<Theme>;
  visible?: boolean;
  showIcons?: boolean;
}

const MaterialCategoryButtons: React.FC<MaterialCategoryButtonsProps> = ({
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