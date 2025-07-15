import React from 'react';
import UiButton from '../ui/UiButton';
import { getCategoryColor, getCategoryGradient } from '../../utils/categoryPalette';

interface Subcategory {
  sub: string;
  order?: number;
  label?: string;
}

interface SubcategoryBarProps {
  selectedCategory: string | null;
  categorySubcategories: Subcategory[];
  activeSubcategory: string | null;
  setActiveSubcategory: (subcategory: string) => void;
  allData?: Record<string, any[]>;
  t?: Record<string, any>;
  lang?: string;
  renderChip?: (subcategory: string, isActive: boolean, index: number) => React.ReactNode;
  sx?: React.CSSProperties;
  chipSx?: React.CSSProperties;
  visible?: boolean;
  [key: string]: any; // Para props adicionales
}

/**
 * SubcategoryBar: Barra de selección de subcategorías altamente parametrizable y reutilizable.
 * Permite customizar estilos, callbacks, render y visibilidad de elementos.
 *
 * Props avanzados:
 * - selectedCategory: string (categoría activa)
 * - categorySubcategories: array (subcategorías de la categoría)
 * - activeSubcategory: string (subcategoría activa)
 * - setActiveSubcategory: function (callback al seleccionar subcategoría)
 * - allData: object (datos completos para subcats dinámicos)
 * - t: object (traducciones)
 * - lang: string (idioma actual)
 * - renderChip: función opcional para custom render de cada chip `(subcat, selected, idx) => ReactNode`
 * - sx: objeto de estilos adicionales para el contenedor
 * - chipSx: objeto de estilos adicionales para cada chip
 * - visible: boolean (si se muestra el componente, default: true)
 * - ...props: cualquier otro prop para el contenedor
 *
 * Ejemplo de uso:
 * <SubcategoryBar
 *   selectedCategory="movies"
 *   categorySubcategories={[{ sub: 'Acción', order: 1 }]}
 *   activeSubcategory="Acción"
 *   setActiveSubcategory={sub => {}}
 *   sx={{ background: '#fafafa' }}
 *   chipSx={{ fontSize: 16 }}
 *   renderChip={(subcat, selected, idx) => (
 *     <span key={subcat} style={{ color: selected ? 'red' : 'gray' }}>{subcat}</span>
 *   )}
 * />
 */

const SubcategoryBar: React.FC<SubcategoryBarProps> = ({ 
  selectedCategory, 
  categorySubcategories, 
  activeSubcategory, 
  setActiveSubcategory, 
  allData, 
  t, 
  lang, 
  renderChip, 
  sx, 
  chipSx, 
  visible = true, 
  ...props 
}) => {
  // Log para depuración
  // eslint-disable-next-line no-console
  console.log('[SubcategoryBar] categorySubcategories:', categorySubcategories);
  if (!visible || !selectedCategory) return null;
  
  if (selectedCategory !== 'documentales') {
    return (
      <div className="subcategories-container" style={sx} {...props}>
        {Array.isArray(categorySubcategories) && categorySubcategories.length > 0 && (
          categorySubcategories
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(({ sub, label }, idx) => {
              const isActive = activeSubcategory === sub;
              if (renderChip) {
                return renderChip(label || sub, isActive, idx); // <-- Pasar label traducido al renderChip
              }
              // Log para depuración en el render del botón
              // eslint-disable-next-line no-console
              console.log('[SubcategoryBar][Button]', { sub, label });
              return (
                <UiButton
                  key={`subcat-${idx}-${typeof sub === 'string' ? sub : 'sub'}`}
                  className={`subcategory-btn${isActive ? ' active' : ''}`}
                  variant="outlined"
                  color="secondary"
                  size="medium"
                  icon={null}
                  onClick={() => setActiveSubcategory(sub)}
                  sx={{
                    background: isActive ? getCategoryGradient(selectedCategory) : 'var(--background-secondary)',
                    color: isActive ? '#222' : 'var(--text-color)',
                    border: isActive ? `2px solid ${getCategoryColor(selectedCategory) || 'var(--color-primary)'}` : '1.5px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '6px 18px',
                    fontSize: '1rem',
                    fontWeight: isActive ? 700 : 500,
                    margin: '0 4px 8px 0',
                    minWidth: 80,
                    transition: 'all 0.2s',
                    boxShadow: isActive ? '0 2px 8px 0 rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {label}
                </UiButton>
              );
            })
        )}
      </div>
    );
  }
  
  // documentales: subcats dinámicos
  const subcatsSet = new Set<string>();
  (allData?.['documentales'] || []).forEach(item => {
    if (item.subcategory) subcatsSet.add(item.subcategory.toLowerCase().trim());
  });
  const subcats = Array.from(subcatsSet).sort((a, b) => a.localeCompare(b, lang === 'es' ? 'es' : 'en', { sensitivity: 'base' }));
  
  return (
    <div className="subcategories-container" style={sx} {...props}>
      {subcats.map((sub, idx) => {
        const isActive = activeSubcategory === sub;
        if (renderChip) {
          return renderChip(sub, isActive, idx);
        }
        return (
          <UiButton
            key={`subcat-${idx}-${typeof sub === 'string' ? sub : 'sub'}`}
            className={`subcategory-btn${isActive ? ' active' : ''}`}
            variant="outlined"
            color="secondary"
            size="medium"
            icon={null}
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
              },
              ...chipSx
            }}
          >
            {typeof t?.subcategories?.documentales?.[sub] === 'string' 
              ? t.subcategories.documentales[sub] 
              : (typeof sub === 'string' ? sub : 'Subcategory')}
          </UiButton>
        );
      })}
    </div>
  );
};

export default SubcategoryBar; 