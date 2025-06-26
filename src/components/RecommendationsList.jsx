import React from 'react';
import { useAppView } from '../store/useAppStore';
import MobileRecommendationsList from './MobileRecommendationsList';
import DesktopRecommendationsList from './DesktopRecommendationsList';

/**
 * RecommendationsList
 * Wrapper de lista de recomendaciones adaptable a dispositivo.
 *
 * Props avanzados:
 * - items: array de recomendaciones a mostrar
 * - renderItem: función para custom render de cada ítem `(item, idx) => ReactNode`
 * - onItemClick: callback al hacer click en un ítem
 * - loading: boolean (estado de carga)
 * - emptyComponent: ReactNode o función para custom empty state
 * - pagination: objeto de paginación `{ page, pageSize, onPageChange }`
 * - sx, className, style: estilos avanzados
 * - ...props: cualquier otro prop que se pasa a la lista interna
 *
 * Ejemplo de uso:
 * <RecommendationsList
 *   items={recs}
 *   renderItem={(item, idx) => <MyCard item={item} key={item.id} />}
 *   onItemClick={item => setSelected(item)}
 *   loading={isLoading}
 *   emptyComponent={<div>No hay recomendaciones</div>}
 *   pagination={{ page, pageSize, onPageChange }}
 *   sx={{ background: '#fafafa' }}
 * />
 */
const RecommendationsList = ({
  items,
  renderItem,
  onItemClick,
  loading,
  emptyComponent,
  pagination,
  sx,
  className,
  style,
  ...props
}) => {
  const { isMobile } = useAppView();

  // Eliminar props de infinite scroll que no son para desktop ni para la lista de categorías
  const {
    onLoadMore,
    hasMore,
    loadingMore,
    ...desktopSafeProps
  } = props;

  const commonProps = {
    items,
    renderItem,
    onItemClick,
    loading,
    emptyComponent,
    pagination,
    sx,
    className,
    style,
    ...desktopSafeProps
  };

  return isMobile 
    ? <MobileRecommendationsList {...commonProps} />
    : <DesktopRecommendationsList {...commonProps} />;
};

export default RecommendationsList;