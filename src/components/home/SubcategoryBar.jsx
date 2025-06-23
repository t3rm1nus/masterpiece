import React from 'react';
import UiButton from '../ui/UiButton';

/**
 * SubcategoryBar: Barra de selección de subcategorías.
 * Permite customizar estilos, callbacks y visibilidad de elementos.
 *
 * Props:
 * - selectedCategory: string (categoría activa)
 * - categorySubcategories: array (subcategorías de la categoría)
 * - activeSubcategory: string (subcategoría activa)
 * - setActiveSubcategory: function (callback al seleccionar subcategoría)
 * - allData: object (datos completos para subcats dinámicos)
 * - t: object (traducciones)
 * - lang: string (idioma actual)
 *
 * Ejemplo de uso:
 * <SubcategoryBar
 *   selectedCategory="movies"
 *   categorySubcategories={[{ sub: 'Acción', order: 1 }]}
 *   activeSubcategory="Acción"
 *   setActiveSubcategory={sub => {}}
 *   allData={{}}
 *   t={{}}
 *   lang="es"
 * />
 */

const SubcategoryBar = ({ selectedCategory, categorySubcategories, activeSubcategory, setActiveSubcategory, allData, t, lang }) => {
  if (!selectedCategory) return null;
  if (selectedCategory !== 'documentales') {
    return (
      <div className="subcategories-container">
        {Array.isArray(categorySubcategories) && categorySubcategories.length > 0 && (
          categorySubcategories
            .sort((a, b) => a.order - b.order)
            .map(({ sub }) => {
              const isActive = activeSubcategory === sub;
              return (
                <UiButton
                  key={sub}
                  className={`subcategory-btn${isActive ? ' active' : ''}`}
                  variant="outlined"
                  color="secondary"
                  size="medium"
                  onClick={() => setActiveSubcategory(sub)}
                  sx={{
                    background: isActive ? 'var(--color-primary)' : 'var(--background-secondary)',
                    color: isActive ? 'var(--text-inverse)' : 'var(--text-color)',
                    border: isActive ? '2px solid var(--color-primary)' : '1.5px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: 'var(--space-xs) var(--space-sm)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: isActive ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
                    minWidth: 100,
                    margin: '0 4px',
                    boxShadow: 'none',
                    transition: 'all var(--transition-normal)',
                    '&:hover': {
                      background: 'var(--hover-color)',
                      borderColor: 'var(--border-color-hover)',
                      transform: 'translateY(-1px)',
                      boxShadow: 'var(--shadow-sm)'
                    }
                  }}
                >
                  {t?.subcategories?.[selectedCategory]?.[sub.toLowerCase()] || sub}
                </UiButton>
              );
            })
        )}
      </div>
    );
  }
  // documentales: subcats dinámicos
  const subcatsSet = new Set();
  (allData['documentales'] || []).forEach(item => {
    if (item.subcategory) subcatsSet.add(item.subcategory.toLowerCase().trim());
  });
  const subcats = Array.from(subcatsSet).sort((a, b) => a.localeCompare(b, lang === 'es' ? 'es' : 'en', { sensitivity: 'base' }));
  return (
    <div className="subcategories-container">
      {subcats.map(sub => {
        const isActive = activeSubcategory === sub;
        return (
          <UiButton
            key={sub}
            className={`subcategory-btn${isActive ? ' active' : ''}`}
            variant="outlined"
            color="secondary"
            size="medium"
            onClick={() => setActiveSubcategory(sub)}
            sx={{
              background: isActive ? 'var(--color-primary)' : 'var(--background-secondary)',
              color: isActive ? 'var(--text-inverse)' : 'var(--text-color)',
              border: isActive ? '2px solid var(--color-primary)' : '1.5px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--space-xs) var(--space-sm)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: isActive ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)',
              minWidth: 100,
              margin: '0 4px',
              boxShadow: 'none',
              transition: 'all var(--transition-normal)',
              '&:hover': {
                background: 'var(--hover-color)',
                borderColor: 'var(--border-color-hover)',
                transform: 'translateY(-1px)',
                boxShadow: 'var(--shadow-sm)'
              }
            }}
          >
            {t?.subcategories?.documentales?.[sub] || sub}
          </UiButton>
        );
      })}
    </div>
  );
};

export default SubcategoryBar;
