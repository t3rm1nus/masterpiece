# Componentes Principales

La carpeta `src/components/` contiene los componentes reutilizables y principales de la aplicación. La estructura actual distingue entre componentes clásicos y componentes basados en Material UI, priorizando estos últimos para una experiencia visual moderna y responsiva.

- `AppContent.jsx`: Orquesta la navegación y renderizado de vistas principales (Home, detalle, donaciones, etc.) y gestiona overlays/modales.
- `HomePage.jsx`: Página de inicio, muestra el listado principal de recomendaciones y controles de filtrado.
- `HybridMenu.jsx`, `MaterialMobileMenu.jsx`: Menús de navegación adaptativos para desktop y móvil.
- `MaterialCategoryButtons.jsx`, `MaterialSubcategoryChips.jsx`, `MaterialCategorySelect.jsx`: Componentes de selección y filtrado de categorías y subcategorías, con soporte para chips y botones especiales.
- `MaterialRecommendationCard.jsx`: Tarjetas de recomendación de contenido, con badges y estilos avanzados.
- `UnifiedItemDetail.jsx`, `MaterialItemDetail.jsx`, `ItemDetail.jsx`: Vistas de detalle de los ítems recomendados, con lógica unificada para desktop y móvil.
- `ErrorDisplay.jsx`: Visualización de errores globales o de red.
- `LocalizedTitle.jsx`: Títulos adaptados al idioma/contexto.
- Otros: componentes de UI (botones, layouts, modales) y wrappers para integración con Material UI.

La tendencia actual es consolidar la experiencia en Material UI y componentes unificados, eliminando gradualmente los componentes legacy o duplicados.
