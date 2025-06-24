import React from 'react';
import MaterialContentWrapper from './MaterialContentWrapper';
import '../styles/components/cards.css';

/**
 * MobileRecommendationsList
 * Lista de recomendaciones para móvil, altamente parametrizable y reutilizable.
 *
 * Props avanzados:
 * - items: array de recomendaciones a mostrar (alias de recommendations)
 * - renderItem: función para custom render de cada ítem `(item, idx) => ReactNode`
 * - onItemClick: callback al hacer click en un ítem
 * - loading: boolean (estado de carga)
 * - emptyComponent: ReactNode o función para custom empty state
 * - pagination: objeto de paginación `{ page, pageSize, onPageChange }`
 * - categories: array de categorías (para select de categorías)
 * - selectedCategory: string (categoría activa)
 * - onCategoryClick: función para seleccionar categoría
 * - subcategories: array de subcategorías (para chips de subcategorías)
 * - activeSubcategory: string (subcategoría activa)
 * - onSubcategoryClick: función para seleccionar subcategoría
 * - renderCategoryButton: función para custom render de botón de categoría
 * - renderSubcategoryChip: función para custom render de chip de subcategoría
 * - categorySelectSx: estilos adicionales para MaterialCategorySelect
 * - subcategoryChipsSx: estilos adicionales para MaterialSubcategoryChips
 * - showCategorySelect: boolean (mostrar select de categorías, default: true)
 * - showSubcategoryChips: boolean (mostrar chips de subcategorías, default: true)
 * - ...props legacy (recommendations, etc.)
 *
 * Ejemplo de uso:
 * <MobileRecommendationsList
 *   items={recs}
 *   categories={categories}
 *   selectedCategory={selectedCategory}
 *   onCategoryClick={setCategory}
 *   subcategories={subcategories}
 *   activeSubcategory={activeSubcategory}
 *   onSubcategoryClick={setActiveSubcategory}
 *   renderCategoryButton={...}
 *   renderSubcategoryChip={...}
 *   categorySelectSx={{ background: '#fafafa' }}
 *   subcategoryChipsSx={{ background: '#eee' }}
 *   showCategorySelect={false} // <---
 *   showSubcategoryChips={false} // <---
 *   renderItem={(item, idx) => <MyCard item={item} key={item.id} />}
 *   onItemClick={item => setSelected(item)}
 *   loading={isLoading}
 *   emptyComponent={<div>No hay recomendaciones</div>}
 *   pagination={{ page, pageSize, onPageChange }}
 *   sx={{ background: '#fafafa' }}
 * />
 */
const MobileRecommendationsList = ({
  items,
  renderItem,
  onItemClick,
  loading,
  emptyComponent,
  pagination,
  sx = {},
  className = '',
  style = {},
  // legacy/compatibilidad
  recommendations,
  isHome,
  categories,
  selectedCategory,
  onCategoryClick,
  subcategories,
  activeSubcategory,
  onSubcategoryClick,
  renderCategoryButton,
  renderSubcategoryChip,
  categorySelectSx = {},
  subcategoryChipsSx = {},
  categorySelectProps = {},
  subcategoryChipsProps = {},
  visible = true,
  showCategorySelect = true,
  showSubcategoryChips = true,
  ...rest
}) => {
  const data = items || recommendations;
  return (
    <MaterialContentWrapper
      recommendations={data}
      isHome={isHome}
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryClick={onCategoryClick}
      subcategories={subcategories}
      activeSubcategory={activeSubcategory}
      onSubcategoryClick={onSubcategoryClick}
      renderCategoryButton={renderCategoryButton}
      renderSubcategoryChip={renderSubcategoryChip}
      categorySelectSx={categorySelectSx}
      subcategoryChipsSx={subcategoryChipsSx}
      categorySelectProps={categorySelectProps}
      subcategoryChipsProps={subcategoryChipsProps}
      visible={visible}
      sx={sx}
      className={className}
      style={style}
      showCategorySelect={showCategorySelect}
      showSubcategoryChips={showSubcategoryChips}
      {...rest}
    >
      {/* Render custom recommendations if provided, else fallback to default */}
      {loading ? (
        <div className="recommendations-loading">{getTranslation('ui.states.loading', 'Cargando...')}</div>
      ) : !data?.length ? (
        typeof emptyComponent === 'function' ? emptyComponent() : emptyComponent
      ) : renderItem ? (
        <>
          {data.map((item, idx) => renderItem(item, idx))}
        </>
      ) : null}
      {/* Paginación si aplica */}
      {pagination && (
        <div className="pagination-container">
          <button 
            className="pagination-button" 
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            {getTranslation('ui.actions.previous', 'Anterior')}
          </button>
          <span className="pagination-info">
            {getTranslation('ui.pagination.page_of', 'Página {page} de {total}', {
              page: pagination.page,
              total: Math.ceil((data?.length || 0) / (pagination.pageSize || 1))
            })}
          </span>
          <button 
            className="pagination-button" 
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            disabled={pagination.page >= Math.ceil((data?.length || 0) / (pagination.pageSize || 1))}
          >
            {getTranslation('ui.actions.next', 'Siguiente')}
          </button>
        </div>
      )}
    </MaterialContentWrapper>
  );
};

export default MobileRecommendationsList;