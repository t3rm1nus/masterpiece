import React from 'react';
import UiButton from '../ui/UiButton';

/**
 * CategoryBar: Barra de selección de categorías altamente parametrizable y reutilizable.
 * Permite customizar estilos, iconos, callbacks, render y visibilidad.
 *
 * Props avanzados:
 * - categories: array (lista de categorías { key, label })
 * - selectedCategory: string (categoría activa)
 * - onCategoryClick: function (callback al seleccionar categoría)
 * - renderButton: función opcional para custom render de cada botón `(cat, selected, idx) => ReactNode`
 * - sx: objeto de estilos adicionales para el contenedor
 * - buttonSx: objeto de estilos adicionales para cada botón
 * - visible: boolean (si se muestra el componente, default: true)
 * - ...props: cualquier otro prop para el contenedor
 *
 * Ejemplo de uso:
 * <CategoryBar
 *   categories={[{ key: 'movies', label: 'Películas' }]}
 *   selectedCategory="movies"
 *   onCategoryClick={key => {}}
 *   sx={{ background: '#fafafa' }}
 *   buttonSx={{ fontSize: 18 }}
 *   renderButton={(cat, selected, idx) => (
 *     <button key={cat.key} style={{ color: selected ? 'blue' : 'black' }}>{cat.label}</button>
 *   )}
 * />
 */

const CategoryBar = ({ categories, selectedCategory, onCategoryClick, renderButton, sx, buttonSx, visible = true, ...props }) => {
  if (!visible) return null;
  return (
    <div className="categories-container" style={sx} {...props}>
      <div className="categories-list">
        {Array.isArray(categories) && categories.map((category, idx) => {
          const isActive = selectedCategory === category.key;
          if (renderButton) {
            return renderButton(category, isActive, idx);
          }
          return (
            <UiButton
              key={category.key}
              className={`category-btn${isActive ? ' active' : ''}`}
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => onCategoryClick(category.key)}
              sx={{
                background: isActive ? (category.gradient || category.color || '#2196f3') : 'var(--color-masterpiece-light)',
                color: isActive ? '#222' : 'var(--text-color)',
                border: isActive ? `2px solid ${category.color || '#2196f3'}` : '1.5px solid color-mix(in srgb, var(--color-masterpiece) 30%, transparent)',
                borderRadius: 'var(--border-radius-md)',
                padding: 'var(--space-md) var(--space-lg)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: isActive ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                boxShadow: 'var(--shadow-sm)',
                margin: '0 4px',
                minWidth: 120,
                transition: 'all var(--transition-normal)',
                '&:hover': {
                  background: isActive ? (category.gradient || category.color || '#2196f3') : 'color-mix(in srgb, var(--color-masterpiece) 15%, var(--card-background))',
                  borderColor: isActive ? (category.color || '#2196f3') : 'color-mix(in srgb, var(--color-masterpiece) 50%, transparent)',
                  transform: 'translateY(-2px)',
                  boxShadow: 'var(--shadow-md)'
                },
                ...buttonSx
              }}
            >
              {category.label}
            </UiButton>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBar;
