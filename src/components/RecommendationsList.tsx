import React from 'react';
import { useAppView } from '../store/useAppStore';
import MobileRecommendationsList from './MobileRecommendationsList';
import DesktopRecommendationsList from './DesktopRecommendationsList';

// Tipos para props
interface RecommendationsListProps {
  items?: any[];
  renderItem?: (item: any, idx: number) => React.ReactNode;
  onItemClick?: (item: any) => void;
  loading?: boolean;
  emptyComponent?: React.ReactNode | (() => React.ReactNode);
  pagination?: any;
  sx?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

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