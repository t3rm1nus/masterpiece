import { useAppView } from '../store/useAppStore';

interface UseNavigationActionsReturn {
  goBackFromDetail: () => void;
  goBackFromCoffee: () => void;
  goHome: () => void;
  goToCoffee: () => void;
  goToHowToDownload: () => void;
}

export function useNavigationActions(): UseNavigationActionsReturn {
  const { goBackFromDetail, goBackFromCoffee, goHome, goToCoffee, goToHowToDownload } = useAppView();
  return {
    goBackFromDetail,
    goBackFromCoffee,
    goHome,
    goToCoffee,
    goToHowToDownload
  };
} 