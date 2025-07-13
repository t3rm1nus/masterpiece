import React from 'react';
import { useAppView } from '../store/useAppStore';
import MobileRecommendationsList from './MobileRecommendationsList';
import DesktopRecommendationsList from './DesktopRecommendationsList';
import { Item } from '../types/data';

// =============================================
// RecommendationsList: Wrapper de lista de recomendaciones adaptable
// Wrapper de lista de recomendaciones adaptable a móvil y desktop.
// Optimizado para performance, UX y soporte de renderizado personalizado.
// =============================================

interface PaginationProps {
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

interface RecommendationsListProps {
  items?: Item[];
  renderItem?: (item: Item, idx: number) => React.ReactNode;
  onItemClick?: (item: Item) => void;
  loading?: boolean;
  emptyComponent?: React.ReactNode | (() => React.ReactNode);
  pagination?: PaginationProps;
  sx?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any; // Para props adicionales como infinite scroll
}

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
const RecommendationsList: React.FC<RecommendationsListProps> = ({
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

  // Pasar todas las props para mantener compatibilidad
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