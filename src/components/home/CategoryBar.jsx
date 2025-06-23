import React from 'react';
import UiButton from '../ui/UiButton';

const CategoryBar = ({ categories, selectedCategory, onCategoryClick }) => (
  <div className="categories-container">
    <div className="categories-list">
      {Array.isArray(categories) && categories.map((category) => {
        const isActive = selectedCategory === category.key;
        return (
          <UiButton
            key={category.key}
            className={`category-btn${isActive ? ' active' : ''}`}
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => onCategoryClick(category.key)}
            sx={{
              background: isActive ? 'color-mix(in srgb, var(--color-masterpiece) 25%, var(--card-background))' : 'var(--color-masterpiece-light)',
              color: 'var(--text-color)',
              border: isActive ? '2px solid var(--color-masterpiece)' : '1.5px solid color-mix(in srgb, var(--color-masterpiece) 30%, transparent)',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--space-md) var(--space-lg)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: isActive ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
              boxShadow: 'var(--shadow-sm)',
              margin: '0 4px',
              minWidth: 120,
              transition: 'all var(--transition-normal)',
              '&:hover': {
                background: 'color-mix(in srgb, var(--color-masterpiece) 15%, var(--card-background))',
                borderColor: 'color-mix(in srgb, var(--color-masterpiece) 50%, transparent)',
                transform: 'translateY(-2px)',
                boxShadow: 'var(--shadow-md)'
              }
            }}
          >
            {category.label}
          </UiButton>
        );
      })}
    </div>
  </div>
);

export default CategoryBar;
