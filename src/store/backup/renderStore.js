import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Store para lógica de renderizado de recomendaciones
const useRenderStore = create(
  devtools(
    (set, get) => ({
      // Funciones de utilidad para procesamiento de contenido
      processTitle: (title, lang) => {
        return typeof title === 'object' 
          ? (title[lang] || title.es || title.en || '') 
          : (title || '');
      },
      
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
      },
      
      // Configuración de contenedores de resultados vacíos
      noResultsConfig: {
        containerStyle: { 
          width: '100%', 
          maxWidth: '100%' 
        },
        imageContainerStyle: { 
          textAlign: 'center', 
          width: '100%', 
          maxWidth: '100%' 
        }
      },
      
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
          marginBottom: 0, 
          lineHeight: '1.1'
        },
        subcategoryStyle: {
          marginTop: 0, 
          lineHeight: '1.1'
        }
      },
      
      // Configuración de estilos para desktop layout
      desktopStyles: {
        cardStyle: { position: 'relative' },
        imageStyle: { objectFit: 'cover' },
        categoryContainer: { marginBottom: '0.2rem' },
        categoryStyle: { 
          fontWeight: 'bold', 
          display: 'block' 
        },
        subcategoryStyle: { 
          fontWeight: 500, 
          color: '#888' 
        }
      }
    }),
    { name: 'render-store' }
  )
);

export default useRenderStore;
