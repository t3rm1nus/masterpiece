import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Store para configuración de estilos y constantes de la aplicación
const useStylesStore = create(
  devtools(
    (set, get) => ({
      // Configuración de estilos de botones especiales
      specialButtonLabels: {
        spanishCinema: {
          es: 'Cine Español',
          en: 'Spanish Cinema'
        },
        masterpiece: {
          es: 'Obras Maestras',
          en: 'Masterpieces'
        }
      },
      
      // Configuración de badges y elementos SVG
      masterpieceBadge: {
        svg: {
          width: "24",
          height: "24",
          viewBox: "0 0 24 24",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg"
        },
        circle: {
          cx: "12",
          cy: "12", 
          r: "12",
          fill: "#ffd700"
        },
        text: {
          x: "12",
          y: "17",
          textAnchor: "middle",
          fontSize: "14",
          fontWeight: "bold",
          fill: "#fff",
          content: "1"
        }
      },
      
      // Configuración de layouts
      layouts: {
        mobileHome: {
          imageSize: { width: 80, height: 110 },
          desktopImageSize: { width: 120, height: 170 }
        }
      },
      
      // Configuración de contenedores y espaciados
      containerStyles: {
        main: {
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        },
        categoriesList: {
          textAlign: 'center',
          marginTop: '4rem',
          marginBottom: '1rem',
          width: '100%'
        },
        subcategoriesList: {
          textAlign: 'center',
          marginBottom: '0.5rem',
          width: '100%'
        },
        specialButtonsContainer: {
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '1rem',
          width: '100%',
          textAlign: 'center'
        }
      },
      
      // Obtener etiquetas de botones especiales
      getSpecialButtonLabel: (type, lang) => {
        const { specialButtonLabels } = get();
        return specialButtonLabels[type] ? specialButtonLabels[type][lang] : '';
      },
      
      // Obtener configuración de badge
      getMasterpieceBadgeConfig: () => {
        return get().masterpieceBadge;
      }
    }),
    { name: 'styles-store' }
  )
);

export default useStylesStore;
