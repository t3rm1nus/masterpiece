import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Store consolidado para UI y renderizado
const useViewStore = create(
  devtools(
    (set, get) => ({
      // ==========================================
      // ESTADO DE UI
      // ==========================================
      isMobile: false,
      mobileMenuOpen: false,
      currentView: 'home', // Vista actual (home, detail, coffee, etc.)
      lastCategory: null, // Última categoría visitada
      
      // Estado para la vista de detalle
      selectedItem: null, // Item seleccionado para mostrar detalles
      previousView: 'home', // Vista anterior para poder volver      // ==========================================
      // CONFIGURACIÓN DE RENDERIZADO
      // ==========================================

      // Configuración de estilos para mobile home layout
      mobileHomeStyles: {
        cardStyle: { position: 'relative' },
        imageStyle: {
          objectFit: 'cover', 
          borderRadius: 8, 
          flexShrink: 0, 
          marginBottom: 4
        },
        categoryContainer: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px',
          marginTop: 0,
          marginBottom: 0
        },
        categoryStyle: {
          fontWeight: 'bold', 
          marginBottom: 0, 
          lineHeight: '1.1'
        },
        subcategoryStyle: {
          marginTop: 0, 
          lineHeight: '1.1'
        }
      },      // Configuración de estilos para desktop layout
      desktopStyles: {
        cardStyle: { position: 'relative' },
        imageStyle: { objectFit: 'cover' },        categoryContainer: { 
          marginBottom: '1rem', 
          textAlign: 'center' 
        },
        categoryStyle: { 
          fontWeight: 'bold', 
          display: 'inline',
          textAlign: 'center'
        },
        subcategoryStyle: { 
          fontWeight: 500, 
          color: '#888',
          textAlign: 'center',
          display: 'block',
          marginLeft: '0',
          marginTop: '0.25rem'
        }
      },

      // ==========================================
      // ACCIONES DE UI
      // ==========================================
        setMobile: (isMobile) => {
        const current = get().isMobile;        set(
          { isMobile },
          false,
          'setMobile'
        );
      },
        openMobileMenu: () => {
        set(
          { mobileMenuOpen: true },
          false,
          'openMobileMenu'
        );
      },
      
      closeMobileMenu: () => {
        set(
          { mobileMenuOpen: false },
          false,
          'closeMobileMenu'
        );
      },
      
      toggleMobileMenu: () => set(
        (state) => ({ mobileMenuOpen: !state.mobileMenuOpen }),
        false,
        'toggleMobileMenu'
      ),
      
      // Navegar a una vista
      navigate: (view) => set(
        { currentView: view },
        false,
        'navigate'
      ),
      
      // Establecer la última categoría visitada
      setLastCategory: (category) => set(
        { lastCategory: category },
        false,
        'setLastCategory'
      ),
      
      // Volver a la vista anterior
      goBack: () => {
        const { lastCategory } = get();
        if (lastCategory) {
          set({ currentView: 'category', lastCategory: null }, false, 'goBack');
        } else {
          set({ currentView: 'home' }, false, 'goBack');
        }
      },      // Navegar a la vista de detalle de un item
      navigateToDetail: (item) => {
        const currentView = get().currentView;
        
        set(
          { 
            selectedItem: item,
            previousView: currentView,
            currentView: 'detail'
          },
          false,
          'navigateToDetail'
        );
      },
        // Volver de la vista de detalle
      goBackFromDetail: () => {
        const previousView = get().previousView;
        
        set(
          {
            selectedItem: null,
            currentView: previousView,
            previousView: 'home'
          },
          false,
          'goBackFromDetail'
        );
      },
      
      // Navegar a la página de donación
      navigateToCoffee: () => {
        const currentView = get().currentView;
        set(
          {
            previousView: currentView,
            currentView: 'coffee'
          },
          false,
          'navigateToCoffee'
        );
      },
      
      // Volver de la página de donación
      goBackFromCoffee: () => {
        const previousView = get().previousView;
        set(
          {
            currentView: previousView,
            previousView: 'home'
          },
          false,
          'goBackFromCoffee'
        );
      },

      // ==========================================
      // FUNCIONES DE RENDERIZADO
      // ==========================================
      
      // Procesar título según idioma
      processTitle: (title, lang) => {
        return typeof title === 'object' 
          ? (title[lang] || title.es || title.en || '') 
          : (title || '');
      },
      
      // Procesar descripción según idioma
      processDescription: (description, lang) => {
        return typeof description === 'object' 
          ? (description[lang] || description.es || description.en || '') 
          : (description || '');
      },
      
      // Configuración de clases CSS dinámicas
      getRecommendationCardClasses: (rec, isHome, isMobile) => {
        const baseClass = 'recommendation-card';
        const layoutClass = (isHome && isMobile) ? ' mobile-home-layout' : '';
        const categoryClass = ` ${rec.category}`;
        const masterpieceClass = rec.masterpiece ? ' masterpiece' : '';
        
        return `${baseClass}${layoutClass}${categoryClass}${masterpieceClass}`;
      }
    }),
    { name: 'view-store' }
  )
);

export default useViewStore;
