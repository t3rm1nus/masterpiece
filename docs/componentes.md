# Componentes Principales

La carpeta `src/components/` contiene los componentes reutilizables y principales de la aplicación. Actualmente, **todos los componentes legacy han sido eliminados o migrados**, y la experiencia está 100% consolidada en Material UI y componentes unificados, optimizados para performance y móviles.

- `AppContent.jsx`: Orquesta la navegación y renderizado de vistas principales (Home, detalle, donaciones, etc.), gestiona overlays/modales y aplica lazy loading a páginas pesadas mediante React.lazy y Suspense.
- `HomePage.jsx`: Página de inicio, muestra el listado principal de recomendaciones y controles de filtrado, adaptada a móvil y desktop.
- `HybridMenu.jsx`, `MaterialMobileMenu.jsx`: Menús de navegación adaptativos para desktop y móvil, con animaciones y soporte touch.
- `MaterialCategoryButtons.jsx`, `MaterialSubcategoryChips.jsx`, `MaterialCategorySelect.jsx`: Componentes de selección y filtrado de categorías y subcategorías, con soporte para chips y botones especiales, todos basados en Material UI.
- `MaterialRecommendationCard.jsx`: Tarjetas de recomendación de contenido, con badges y estilos avanzados, optimizadas para móviles.
- `UnifiedItemDetail.jsx`, `MaterialItemDetail.jsx`: Vistas de detalle de los ítems recomendados, con lógica unificada para desktop y móvil.
- `ErrorDisplay.jsx`: Visualización de errores globales o de red.
- `LocalizedTitle.jsx`: Títulos adaptados al idioma/contexto.
- Otros: componentes de UI (botones, layouts, modales) y wrappers para integración con Material UI y soporte de accesibilidad.

> **Nota:** La navegación se gestiona mediante un store global (Zustand) y no con un router tradicional. El lazy loading se aplica a páginas pesadas para mejorar la performance en móviles y desktop.
