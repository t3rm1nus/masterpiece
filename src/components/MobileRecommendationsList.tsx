import React from 'react';
import MaterialContentWrapper from './MaterialContentWrapper';
import { useLanguage } from '../LanguageContext';

// Tipos para props
interface MobileRecommendationsListProps {
  items?: any[];
  renderItem?: (item: any, idx: number) => React.ReactNode;
  onItemClick?: (item: any) => void;
  loading?: boolean;
  emptyComponent?: React.ReactNode | (() => React.ReactNode);
  pagination?: any;
  sx?: React.CSSProperties;
  recommendations?: any[];
  isHome?: boolean;
  categories?: any[];
  selectedCategory?: string;
  onCategoryClick?: (category: string) => void;
  subcategories?: any[];
  activeSubcategory?: string;
  onSubcategoryClick?: (subcategory: string) => void;
  renderCategoryButton?: (category: any, selected: boolean, idx: number) => React.ReactNode;
  renderSubcategoryChip?: (subcategory: any, selected: boolean, idx: number) => React.ReactNode;
  categorySelectSx?: React.CSSProperties;
  subcategoryChipsSx?: React.CSSProperties;
  categorySelectProps?: any;
  subcategoryChipsProps?: any;
  visible?: boolean;
  showCategorySelect?: boolean;
  showSubcategoryChips?: boolean;
  [key: string]: any;
}

const MobileRecommendationsList: React.FC<MobileRecommendationsListProps> = ({
  items,
  renderItem,
  onItemClick,
  loading,
  emptyComponent,
  pagination,
  sx = {},
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
              {getTranslation('ui.pagination.page_of', 'Página')}
              {' '}{pagination.page}{' '}{getTranslation('ui.pagination.of', 'de')}{' '}{Math.ceil((data?.length || 0) / (pagination.pageSize || 1))}
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