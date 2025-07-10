import React from 'react';
import { useAppView } from '../store/useAppStore';
import MobileRecommendationsList from './MobileRecommendationsList';
import DesktopRecommendationsList from './DesktopRecommendationsList';

// =============================================
// RecommendationsList: Wrapper de lista de recomendaciones adaptable
// Wrapper de lista de recomendaciones adaptable a móvil y desktop.
// Optimizado para performance, UX y soporte de renderizado personalizado.
// =============================================

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

  // Mantener todas las props para que infinite scroll funcione en ambas plataformas
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
    ...props // Incluir todas las props, incluidas las de infinite scroll
  };

  return isMobile 
    ? <MobileRecommendationsList {...commonProps} />
    : <DesktopRecommendationsList {...commonProps} />;
};

export default RecommendationsList;