import { LanguageProvider, useLanguage } from "./LanguageContext";
import './App.css'
import { useState, useEffect } from "react";
import datosMovies from "./datos_movies.json";
import datosComics from "./datos_comics.json";
import datosBooks from "./datos_books.json";
import datosMusic from "./datos_music.json";
import datosVideogames from "./datos_videogames.json";
import datosBoardgames from "./datos_boardgames.json";
import datosPodcast from "./datos_podcast.json";
import React from "react";
import { normalizeSubcategory, filterItemsBySubcategory, getUniqueSubcategories, normalizeSubcategoryInternal } from './utils/categoryUtils';

// Utilidad para obtener el dataset según la categoría
const datosByCategory = {
  movies: { recommendations: datosMovies.recommendations },
  comics: datosComics,
  books: datosBooks,
  music: datosMusic,
  videogames: datosVideogames,
  boardgames: datosBoardgames,
  podcast: datosPodcast
};

function LanguageSelector() {
  const { lang, changeLanguage } = useLanguage();
  return (
    <select
      id="language-selector"
      name="language-selector"
      value={lang}
      onChange={e => changeLanguage(e.target.value)}
      style={{ marginLeft: 8 }}
    >
      <option value="es">Español</option>
      <option value="en">English</option>
    </select>
  );
}

function Menu({ onNavigate, showBack, onBack, backLabel }) {
  const { t, lang } = useLanguage();
  
  return (
    <nav className="main-menu" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '1rem',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {showBack && (
          <button className="category-btn" onClick={onBack}>&larr; {backLabel}</button>
        )}
        {/* Botón de inicio a la izquierda que recarga la página */}
        <button 
          onClick={() => window.location.reload()} 
          style={{ fontWeight: 'bold' }}
        >
          {t.home_title}
        </button>
      </div>
      
      {/* Selector de idioma - siempre a la derecha */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <LanguageSelector />
      </div>
    </nav>
  );
}

function RecommendationsList({ recommendations, isHome }) {
  const { lang, t } = useLanguage();
  const categoryNames = t.categories;
  const subcategoryTranslations = {
    'fantasy': lang === 'es' ? 'fantasía' : 'fantasy',
    'acción': lang === 'en' ? 'action' : 'acción',
    'action': lang === 'es' ? 'acción' : 'action',
    'comedy': lang === 'es' ? 'comedia' : 'comedy',
    'adventure': lang === 'es' ? 'aventura' : 'adventure',
    'aventura': lang === 'en' ? 'adventure' : 'aventura',
    'comedia': lang === 'en' ? 'comedy' : 'comedia',
    'histórico': lang === 'en' ? 'historical' : 'histórico',
    'crónica': lang === 'en' ? 'chronicle' : 'crónica'
  };
  // Detectar móvil de forma robusta
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  return (
    <div className="recommendations-list">
      {recommendations.map((rec, idx) => {
        const title = typeof rec.title === 'object' ? (rec.title[lang] || rec.title.es || rec.title.en || '') : (rec.title || '');
        const description = typeof rec.description === 'object' ? (rec.description[lang] || rec.description.es || rec.description.en || '') : (rec.description || '');
        // Clave única: añade siempre el índice para evitar duplicados
        const recKey = `${rec.category}_${rec.id !== undefined ? rec.id : idx}_${idx}`;
        if (isHome && isMobile) {
          return (            <div
              className={`recommendation-card mobile-home-layout ${rec.category}${rec.masterpiece ? ' masterpiece' : ''}`}
              key={recKey}
              style={{position: 'relative'}}
            >
              {/* Fila superior: solo el nombre, centrado */}
              <div className="rec-home-row rec-home-row-top">
                <span className="rec-home-title">{title}</span>
              </div>
              {/* Fila inferior: imagen, debajo género y subgénero, y a la derecha la descripción */}
              <div className="rec-home-row rec-home-row-bottom">
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',minWidth:0}}>
                  <img src={rec.image} alt={title} width={80} height={110} style={{objectFit:'cover', borderRadius:8, flexShrink:0, marginBottom:4}} />
                  <div className="rec-home-cats" style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'5px',marginTop:0,marginBottom:0}}>
                    <span className="rec-home-cat" style={{marginBottom:0, lineHeight:'1.1'}}>{categoryNames[rec.category]}</span>
                    <span className="rec-home-subcat" style={{marginTop:0, lineHeight:'1.1'}}>{subcategoryTranslations[rec.subcategory] || rec.subcategory}</span>
                  </div>
                </div>
                <div className="rec-home-info">
                  <p className="rec-home-desc">{description}</p>
                </div>
              </div>
              {rec.masterpiece && (
                <span className="masterpiece-badge" title="Obra maestra">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#ffd700"/>
                    <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">1</text>
                  </svg>
                </span>
              )}
            </div>
          );
        }
        // Layout normal para desktop/tablet o fuera de home
        return (          <div
            className={`recommendation-card ${rec.category}${rec.masterpiece ? ' masterpiece' : ''}`}
            key={recKey}
            style={{position: 'relative'}}
          >
            {rec.masterpiece && (
              <span className="masterpiece-badge" title="Obra maestra">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="12" fill="#ffd700"/>
                  <text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">1</text>
                </svg>
              </span>
            )}
            <img src={rec.image} alt={title} width={120} height={170} style={{objectFit:'cover'}} />
            <div style={{marginBottom: '0.2rem'}}>
              <span style={{fontWeight: 'bold', display: 'block'}}>{categoryNames[rec.category]}</span>
              <span style={{fontWeight: 500, color: '#888'}}>{subcategoryTranslations[rec.subcategory] || rec.subcategory}</span>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        );
      })}
    </div>
  );
}

function HomePage({ onCategory }) {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [title, setTitle] = useState(lang === 'en' ? 'Daily Recommendations' : 'Recomendaciones diarias');
  const [isSpanishCinemaActive, setIsSpanishCinemaActive] = useState(false);
  const [isMasterpieceActive, setIsMasterpieceActive] = useState(false);

  const categories = [
    { key: 'movies', label: lang === 'en' ? 'Movies' : 'Películas' },
    { key: 'comics', label: lang === 'en' ? 'Comics' : 'Cómics' },
    { key: 'books', label: lang === 'en' ? 'Books' : 'Libros' },
    { key: 'music', label: lang === 'en' ? 'Music' : 'Música' },
    { key: 'videogames', label: lang === 'en' ? 'Video Games' : 'Videojuegos' },
    { key: 'boardgames', label: lang === 'en' ? 'Board Games' : 'Juegos de Mesa' },
    { key: 'podcast', label: lang === 'en' ? 'Podcasts' : 'Podcasts' }
  ];

  // Efecto para actualizar el título cuando cambia el idioma o la categoría
  useEffect(() => {
    if (selectedCategory) {
      // Si hay una categoría seleccionada, buscar su etiqueta traducida
      const category = categories.find(cat => cat.key === selectedCategory);
      if (category) {
        setTitle(category.label);
      }
    } else {
      // Si no hay categoría seleccionada, mostrar el título por defecto
      setTitle(lang === 'en' ? 'Daily Recommendations' : 'Recomendaciones diarias');
    }
  }, [lang, selectedCategory, categories]);
  const subcategoryTranslations = {
    'fantasy': 'fantasía',
    'action': 'acción',
    'comedy': 'comedia',
    'adventure': 'aventura',
    'animation': 'animación',
    'war': 'guerra',
    'spanish cinema': 'cine español',
    'sci-fi': 'ciencia ficción',
    'thriller': 'suspense',
    'horror': 'terror',
    'drama': 'drama',
    'western': 'western',
    'superhéroes': 'superheroes',
    'superheroes': 'superhéroes'
  };

  // Función para obtener subcategorías según la categoría seleccionada
  const getSubcategoriesForCategory = (category) => {
    if (!category) return [];
    
    const categoryData = datosByCategory[category];
    if (!categoryData || !categoryData.recommendations) return [];
    
    // Extraer subcategorías únicas de la categoría seleccionada
    const uniqueSubcategories = Array.from(
      new Set(
        categoryData.recommendations
          .filter(item => item.category === category && item.subcategory)
          .map(item => {
            // Normalizar subcategorías para consistencia
            return item.subcategory.toLowerCase();
          })
      )
    );
    
    // Convertir a formato de objeto para el componente
    return uniqueSubcategories.map(sub => ({ sub }));
  };
  
  // Obtener subcategorías para la categoría seleccionada
  const categorySubcategories = getSubcategoriesForCategory(selectedCategory);

  function renderRecommendations(allRecommendations) {
    return allRecommendations.sort(() => 0.5 - Math.random()).slice(0, 11);
  }

  function renderCategoriesAndSubcategories(categories, selectedCategory, activeSubcategory, isMasterpiecesActive, isSpanishCinemaActive) {
    let filteredRecommendations = selectedCategory
      ? categories.filter(item => item.category === selectedCategory && (!activeSubcategory || item.subcategory === activeSubcategory))
      : categories;

    if (isMasterpiecesActive) {
      filteredRecommendations = filteredRecommendations.filter(item => item.masterpiece === true);
    }

    if (isSpanishCinemaActive) {
      filteredRecommendations = filteredRecommendations.filter(item => {
        const hasTag = Array.isArray(item.tags) && item.tags.includes('spanish');
        return hasTag;
      });
    }

    console.log('Filtered items:', filteredRecommendations);
    return filteredRecommendations;
  }

  const all = [
    ...datosMovies.recommendations,
    ...datosComics.recommendations,
    ...datosBooks.recommendations,
    ...datosMusic.recommendations,
    ...datosVideogames.recommendations,
    ...datosBoardgames.recommendations,
    ...datosPodcast.recommendations
  ];

  // Aplicar filtros en cadena
  let filteredRecommendations = all;
  
  // Aplicar filtro de categoría
  if (selectedCategory) {
    filteredRecommendations = filteredRecommendations.filter(item => item.category === selectedCategory);
  }

  // Aplicar filtro de subcategoría
  if (activeSubcategory && activeSubcategory !== '__masterpieces__') {
    filteredRecommendations = filteredRecommendations.filter(item => item.subcategory === activeSubcategory);
  }

  // Aplicar filtro de cine español si está activo
  if (isSpanishCinemaActive) {
    filteredRecommendations = filteredRecommendations.filter(item => 
      Array.isArray(item.tags) && item.tags.includes('spanish')
    );
  }

  // Aplicar filtro de obras maestras si está activo
  if (isMasterpieceActive) {
    filteredRecommendations = filteredRecommendations.filter(item => item.masterpiece === true);
  }

  // Si no hay filtros activos y no hay categoría seleccionada, mostrar recomendaciones aleatorias
  if (!selectedCategory && !isSpanishCinemaActive && !isMasterpieceActive) {
    filteredRecommendations = renderRecommendations(all);
  }

  console.log('Filter status:', {
    selectedCategory,
    activeSubcategory,
    isSpanishCinemaActive,
    isMasterpieceActive,
    totalItems: filteredRecommendations.length,
    spanishItems: filteredRecommendations.filter(item => Array.isArray(item.tags) && item.tags.includes('spanish')).length,
    masterpieces: filteredRecommendations.filter(item => item.masterpiece).length
  });  const resetCategory = () => {
    setSelectedCategory(null);
    setActiveSubcategory(null);
    setTitle(lang === 'en' ? 'Daily Recommendations' : 'Recomendaciones diarias');
    // Mantener el estado de los filtros incluso al resetear
  };  const handleCategoryClick = (key, label) => {
    setSelectedCategory(key);
    // Buscar la etiqueta traducida actual para la categoría
    const category = categories.find(cat => cat.key === key);
    setTitle(category ? category.label : label);
    setActiveSubcategory(null); // Reset subcategory when changing main category
    setIsSpanishCinemaActive(false); // Reset Spanish Cinema filter when changing category
  };

  return (
    <>
      <div className="categories-list" style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '1rem', width: '100%' }}>
        {categories.map(({ key, label }) => (
          <button
            key={key}
            className="category-btn"
            style={{ display: 'inline-block' }}
            onClick={() => handleCategoryClick(key, label)}
          >
            {label}
          </button>
        ))}
      </div>      {selectedCategory && (
        <>          <div className="subcategories-list" style={{ textAlign: 'center', marginBottom: '0.5rem', width: '100%' }}>
            {categorySubcategories.map(({ sub }) => (
              <button
                key={sub}
                className={`subcategory-btn${activeSubcategory === sub ? ' active' : ''}`}
                style={{ display: 'inline-block', margin: '0.5rem' }}
                onClick={() => setActiveSubcategory(activeSubcategory === sub ? null : sub)}
              >
                {lang === 'es' ? subcategoryTranslations[sub] || sub : sub}
              </button>
            ))}
          </div>          <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '1rem', 
              marginBottom: '1rem',
              width: '100%',
              textAlign: 'center'
            }}>
            {/* Mostrar botón de Cine Español solo si NO estamos en cómics */}
            {selectedCategory !== 'comics' && (
              <button
                className="subcategory-btn"              
                style={{ 
                  display: 'inline-block',
                  backgroundColor: isSpanishCinemaActive ? '#4A90E2' : '#E8E8E8',
                  color: isSpanishCinemaActive ? 'white' : 'black',
                  padding: '0.5rem 1.5rem',
                  minWidth: '150px',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  setIsSpanishCinemaActive(!isSpanishCinemaActive);
                  console.log('Toggling Spanish Cinema:', !isSpanishCinemaActive);
                }}
              >
                {lang === 'es' ? 'Cine Español' : 'Spanish Cinema'}
              </button>
            )}
            <button
              className="subcategory-btn"              
              style={{ 
                display: 'inline-block',
                backgroundColor: isMasterpieceActive ? '#4A90E2' : '#E8E8E8',
                color: isMasterpieceActive ? 'white' : 'black',
                padding: '0.5rem 1.5rem',
                minWidth: '150px',
                transition: 'all 0.3s ease'
              }}
              onClick={() => {
                setIsMasterpieceActive(!isMasterpieceActive);
              }}
            >
              {lang === 'es' ? 'Obras Maestras' : 'Masterpieces'}
            </button>
          </div>
        </>
      )}
      <h1>{title}</h1>      <RecommendationsList
        recommendations={filteredRecommendations}
        isHome={!selectedCategory && !activeSubcategory}
      />
    </>
  );
}



function MobileMenuBar({ onOpen }) {
  return (
    <div className="mobile-menu-bar">
      <button aria-label="Abrir menú" onClick={onOpen} style={{background:'none',border:'none',fontSize:'2rem',color:'#0078d4',cursor:'pointer',padding:0}}>
        <span style={{fontWeight:'bold'}}>&#9776;</span>
      </button>
      <span style={{fontWeight:'bold',fontSize:'1.1rem'}}>Masterpiece</span>
      <span></span>
    </div>
  );
}

function MobileMenu({ open, onClose, onNavigate, showBack, onBack, backLabel }) {
  const { lang } = useLanguage();
  if (!open) return null;
  
  // Componente simplificado y reescrito para evitar duplicaciones
  return (
    <div className="mobile-menu-overlay" onClick={onClose}>
      <nav className="mobile-menu" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Cerrar menú">&times;</button>
        
        {/* Botón de volver - solo visible cuando showBack es true */}
        {showBack && (
          <button className="category-btn" onClick={onBack}>&larr; {backLabel}</button>
        )}
        
        {/* Botón de inicio */}
        <button onClick={() => {onNavigate({view: 'home'}); onClose();}}>
          {lang === 'es' ? 'Inicio' : 'Home'}
        </button>
        
        {/* Botón de nuevas recomendaciones */}
        <button onClick={() => window.location.reload()}>
          {lang === 'es' ? 'Nuevas recomendaciones' : 'New Recommendations'}
        </button>
        
        {/* Selector de idioma */}
        <LanguageSelector />
      </nav>
    </div>
  );
}

function AppContent() {  const [view, setView] = useState({view: 'home'});
  const [lastCategory, setLastCategory] = useState(null);
  const { lang } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Removed handleItemClick function since we don't need it anymore
  
  const navigate = newView => {
    setView(newView);
  };

  let content;
  switch (view.view) {
    case 'home':
      content = <HomePage />;
      break;
    default:
      content = <div>Página no encontrada</div>;
  }

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="container">
      {isMobile ? (
        <>
          <MobileMenuBar onOpen={() => setMobileMenuOpen(true)} />
          <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} onNavigate={setView} />
        </>
      ) : (
        <Menu onNavigate={setView} />
      )}
      {content}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <AppContent />
      </div>
    </LanguageProvider>
  );
}
