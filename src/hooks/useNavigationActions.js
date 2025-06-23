// Hook para centralizar acciones de navegación
import { useAppView } from '../store/useAppStore';

export function useNavigationActions() {
  const { goBackFromDetail, goBackFromCoffee, goHome, goToCoffee, goToHowToDownload } = useAppView();
  return {
    goBackFromDetail,
    goBackFromCoffee,
    goHome,
    goToCoffee,
    goToHowToDownload
  };
}
