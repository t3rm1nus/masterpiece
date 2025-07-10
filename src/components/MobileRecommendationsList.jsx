import React from 'react';
import MaterialContentWrapper from './MaterialContentWrapper';
import { useLanguage } from '../LanguageContext';

// =============================================
// MobileRecommendationsList: Lista de recomendaciones para móviles
// Lista de recomendaciones optimizada para móviles. Altamente parametrizable, soporta infinite scroll, filtros y renderizado personalizado.
// =============================================

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
  const { getTranslation } = useLanguage();

  return (
    <>
      {/* Infinite scroll props explícitos para debug */}
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
        showCategorySelect={showCategorySelect}
        showSubcategoryChips={showSubcategoryChips}
        onLoadMore={rest.onLoadMore}
        hasMore={rest.hasMore}
        loadingMore={rest.loadingMore}
        {...rest}
      >
        {/* Render custom recommendations if provided, else fallback to default */}
        {loading && !data?.length ? (
          <div
            style={{ width: '100%', textAlign: 'center', padding: '32px 0', fontSize: '1.1rem', color: '#888' }}
          >
            {getTranslation('ui.states.loading', 'Cargando...')}
          </div>
        ) : !data?.length ? (
          typeof emptyComponent === 'function' ? emptyComponent() : emptyComponent
        ) : renderItem ? (
          <>
            {data.map((item, idx) => renderItem(item, idx))}
          </>
        ) : null}
        {/* Paginación si aplica */}
        {pagination && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              margin: '24px 0 8px 0',
              flexWrap: 'wrap',
            }}
          >
            <button
              style={{
                border: 'none',
                background: '#eee',
                color: '#333',
                borderRadius: 6,
                padding: '6px 18px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                opacity: pagination.page <= 1 ? 0.5 : 1,
                transition: 'background 0.2s',
              }}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              {getTranslation('ui.actions.previous', 'Anterior')}
            </button>
            <span style={{ fontWeight: 500, fontSize: '1rem', color: '#555' }}>
              {getTranslation('ui.pagination.page_of', 'Página {page} de {total}', {
                page: pagination.page,
                total: Math.ceil((data?.length || 0) / (pagination.pageSize || 1))
              })}
            </span>
            <button
              style={{
                border: 'none',
                background: '#eee',
                color: '#333',
                borderRadius: 6,
                padding: '6px 18px',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: pagination.page >= Math.ceil((data?.length || 0) / (pagination.pageSize || 1)) ? 'not-allowed' : 'pointer',
                opacity: pagination.page >= Math.ceil((data?.length || 0) / (pagination.pageSize || 1)) ? 0.5 : 1,
                transition: 'background 0.2s',
              }}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil((data?.length || 0) / (pagination.pageSize || 1))}
            >
              {getTranslation('ui.actions.next', 'Siguiente')}
            </button>
          </div>
        )}
      </MaterialContentWrapper>
    </>
  );
};

export default MobileRecommendationsList;