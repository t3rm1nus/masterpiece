import React from 'react';
import { useAppView } from '../store/useAppStore';
import MobileRecommendationsList from './MobileRecommendationsList';
import DesktopRecommendationsList from './DesktopRecommendationsList';

const RecommendationsList = (props) => {
  const { isMobile } = useAppView();

  return isMobile 
    ? <MobileRecommendationsList {...props} />
    : <DesktopRecommendationsList {...props} />;
};

export default RecommendationsList;