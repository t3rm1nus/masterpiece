import { LanguageProvider, useLanguage } from "./LanguageContext";
import './App.css'
import { useState } from "react";
import datosMovies from "./datos_movies.json";
import datosComics from "./datos_comics.json";
import datosBooks from "./datos_books.json";
import datosMusic from "./datos_music.json";
import datosVideogames from "./datos_videogames.json";
import datosBoardgames from "./datos_boardgames.json";
import datosPodcast from "./datos_podcast.json";
import trailers from "./trailers.json";

// Utilidad para obtener el dataset según la categoría
const datosByCategory = {
  movies: datosMovies,
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
  const { t } = useLanguage();
  return (
    <nav className="main-menu">
      {showBack && (
        <button className="category-btn" onClick={onBack}>&larr; {backLabel}</button>
      )}
      <button onClick={() => onNavigate({view: 'home'})}>{t.home_title}</button>
      <button onClick={() => onNavigate({view: 'categories'})}>{t.categoriesTitle}</button>
      <LanguageSelector />
    </nav>
  );
}

function CategoriesPage({ onCategory }) {
  const { t, lang } = useLanguage();
  // Título de la página según idioma
  const title = t.categoriesTitle;
  return (
    <div>
      <h1>{title}</h1>
      <div className="categories-list">
        {Object.entries(t.categories).map(([key, label]) => (
          <button key={key} className="category-btn" onClick={() => onCategory(key)}>{label}</button>
        ))}
      </div>
    </div>
  );
}

function SubcategoriesPage({ category, onBack, onItemClick, onNavigate }) {
  const { t, lang } = useLanguage();
  // Obtener el dataset correcto según la categoría
  const datos = datosByCategory[category] || { recommendations: [] };
  const items = datos.recommendations.filter(r => r.category === category);
  // Diccionario para traducir subcategorías conocidas
  const subcategoryTranslations = {
    'fantasy': lang === 'es' ? 'fantasía' : 'fantasy',
    'acción': lang === 'en' ? 'action' : 'acción',
    'action': lang === 'es' ? 'acción' : 'action',
    'comedy': lang === 'es' ? 'comedia' : 'comedy',
    'adventure': lang === 'es' ? 'aventura' : 'adventure',
    'aventura': lang === 'en' ? 'adventure' : 'aventura',
    'comedia': lang === 'en' ? 'comedy' : 'comedia'
  };
  // Normalizar subcategorías según idioma
  let subs = Array.from(new Set(items.map(r => {
    if (lang === 'es' && r.subcategory === 'action') return 'acción';
    if (lang === 'en' && (r.subcategory === 'acción' || r.subcategory === 'acción')) return 'action';
    if (lang === 'es' && r.subcategory === 'fantasy') return 'fantasía';
    if (lang === 'en' && r.subcategory === 'fantasía') return 'fantasy';
    if (lang === 'es' && r.subcategory === 'comedy') return 'comedia';
    if (lang === 'en' && r.subcategory === 'comedia') return 'comedy';
    if (lang === 'es' && r.subcategory === 'adventure') return 'aventura';
    if (lang === 'en' && r.subcategory === 'aventura') return 'adventure';
    return r.subcategory;
  })));
  // Agregar tag especial para cine español
  const hasSpanishCinema = items.some(r => r.tags && r.tags.includes('cine español'));
  if (hasSpanishCinema) {
    subs.push(lang === 'es' ? 'cine español' : 'spanish cinema');
  }
  const [activeSub, setActiveSub] = useState(null);
  // --- MODIFICADO: Añadir botón para filtrar solo obras maestras como subcategoría exclusiva ---
  const masterpiecesKey = '__masterpieces__';
  // Filtrar ítems según subcategoría normalizada, tag especial o masterpieces
  let filtered;
  if (activeSub === masterpiecesKey) {
    filtered = items.filter(r => r.masterpiece);
  } else if (activeSub) {
    filtered = items.filter(r => {
      if (lang === 'es' && r.subcategory === 'action' && activeSub === 'acción') return true;
      if (lang === 'en' && r.subcategory === 'acción' && activeSub === 'action') return true;
      if (lang === 'es' && r.subcategory === 'fantasy' && activeSub === 'fantasía') return true;
      if (lang === 'en' && r.subcategory === 'fantasía' && activeSub === 'fantasy') return true;
      if (lang === 'es' && r.subcategory === 'comedy' && activeSub === 'comedia') return true;
      if (lang === 'en' && r.subcategory === 'comedia' && activeSub === 'comedy') return true;
      if (lang === 'es' && r.subcategory === 'adventure' && activeSub === 'aventura') return true;
      if (lang === 'en' && r.subcategory === 'aventura' && activeSub === 'adventure') return true;
      // Filtro especial para cine español
      if ((lang === 'es' && activeSub === 'cine español') || (lang === 'en' && activeSub === 'spanish cinema')) {
        return r.tags && r.tags.includes('cine español');
      }
      return r.subcategory === activeSub;
    });
  } else {
    filtered = items;
  }

  return (
    <div>
      <Menu showBack={true} onBack={onBack} backLabel={lang === 'en' ? 'Back' : 'Volver'} onNavigate={onNavigate} />
      <h2 className="subcategories-title">{t.categories[category]}</h2>
      <div className="categories-list">
        {subs.map(sub => (
          <button
            key={sub}
            className={`category-btn${activeSub === sub ? ' active' : ''}`}
            onClick={() => setActiveSub(sub)}
          >
            {subcategoryTranslations[sub] || sub}
          </button>
        ))}
        <button
          className={`category-btn${activeSub === masterpiecesKey ? ' active' : ''}`}
          onClick={() => setActiveSub(activeSub === masterpiecesKey ? null : masterpiecesKey)}
        >
          {lang === 'en' ? 'Masterpieces' : 'Obras maestras'}
        </button>
      </div>
      <RecommendationsList recommendations={filtered} onItemClick={onItemClick} />
    </div>
  );
}

function RecommendationsList({ recommendations, onItemClick }) {
  const { lang, t } = useLanguage();
  const categoryNames = t.categories;
  // Diccionario para traducir subcategorías conocidas
  const subcategoryTranslations = {
    'fantasy': lang === 'es' ? 'fantasía' : 'fantasy',
    'acción': lang === 'en' ? 'action' : 'acción',
    'action': lang === 'es' ? 'acción' : 'action',
    'comedy': lang === 'es' ? 'comedia' : 'comedy',
    'adventure': lang === 'es' ? 'aventura' : 'adventure',
    'aventura': lang === 'en' ? 'adventure' : 'aventura',
    'comedia': lang === 'en' ? 'comedy' : 'comedia'
  };
  return (
    <div className="recommendations-list">
      {recommendations.map((rec, idx) => {
        // Protección: si rec.title no es objeto, mostrar string plano
        const title = typeof rec.title === 'object' ? (rec.title[lang] || rec.title.es || rec.title.en || '') : (rec.title || '');
        const description = typeof rec.description === 'object' ? (rec.description[lang] || rec.description.es || rec.description.en || '') : (rec.description || '');
        // Usar una clave única combinando categoría e id, pero si id no existe usar idx
        const recKey = `${rec.category}_${rec.id !== undefined ? rec.id : idx}`;
        return (
          <div
            className={`recommendation-card ${rec.category}${rec.masterpiece ? ' masterpiece' : ''}`}
            key={recKey}
            onClick={() => onItemClick && onItemClick(rec.id)}
            style={{cursor: onItemClick ? 'pointer' : 'default', position: 'relative'}}
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

function HomePage({ onItemClick }) {
  const { lang } = useLanguage();
  // Unir todas las recomendaciones de todas las categorías
  const all = [
    ...datosMovies.recommendations,
    ...datosComics.recommendations,
    ...datosBooks.recommendations,
    ...datosMusic.recommendations,
    ...datosVideogames.recommendations,
    ...datosBoardgames.recommendations,
    ...datosPodcast.recommendations
  ];
  const random = all.sort(() => 0.5 - Math.random()).slice(0, 6);
  const homeTitle = lang === 'en' ? 'Daily Recommendations' : 'Recomendaciones diarias';
  return (
    <>
      <h1>{homeTitle}</h1>
      <RecommendationsList recommendations={random} onItemClick={onItemClick} />
    </>
  );
}

function SubcategoryItemsPage({ category, subcategory, onBack, onItemClick }) {
  const { t } = useLanguage();
  const datos = datosByCategory[category] || { recommendations: [] };
  const items = datos.recommendations.filter(r => r.category === category && r.subcategory === subcategory);
  return (
    <div>
      <button className="category-btn" onClick={onBack}>&larr; {t.categories[category]}</button>
      <h2>{subcategory}</h2>
      <RecommendationsList recommendations={items} onItemClick={onItemClick} />
    </div>
  );
}

function ItemDetailPage({ itemId, onBack }) {
  const { lang, t } = useLanguage();
  // Buscar el item en todos los datasets
  const all = [
    ...datosMovies.recommendations,
    ...datosComics.recommendations,
    ...datosBooks.recommendations,
    ...datosMusic.recommendations,
    ...datosVideogames.recommendations,
    ...datosBoardgames.recommendations,
    ...datosPodcast.recommendations
  ];
  const item = all.find(r => r.id === itemId);
  if (!item) return <div>Item no encontrado</div>;

  // Solo para películas, mostrar botón de trailer
  const isMovie = item.category === 'movies';
  // Diccionario de trailers por título (puedes agregar más si lo deseas)
  const trailerUrl = trailers[item.title[lang] || item.title.es]?.[lang] ||
    trailers[item.title.es]?.[lang] ||
    trailers[item.title.en]?.[lang] ||
    item.trailer?.[lang] || item.trailer?.es || item.trailer?.en || null;
  const trailerText = lang === 'en' ? 'Watch trailer on YouTube' : 'Ver tráiler en YouTube';

  // Diccionario para traducir subcategorías conocidas (mover aquí para usar en ficha)
  const subcategoryTranslations = {
    'fantasy': lang === 'es' ? 'fantasía' : 'fantasy',
    'acción': lang === 'en' ? 'action' : 'acción',
    'action': lang === 'es' ? 'acción' : 'action',
    'comedy': lang === 'es' ? 'comedia' : 'comedy',
    'adventure': lang === 'es' ? 'aventura' : 'adventure',
    'aventura': lang === 'en' ? 'adventure' : 'aventura',
    'comedia': lang === 'en' ? 'comedy' : 'comedia'
  };

  return (
    <div className={`item-detail${item.masterpiece ? ' masterpiece' : ''}`} style={{position:'relative'}}>
      {/* Botón volver eliminado del cuadro de detalles */}
      <h2>{item.title[lang] || item.title.es}</h2>
      <img src={item.image} alt={item.title[lang] || item.title.es} width={200} style={{borderRadius:12, margin:'1rem 0'}} />
      <p><strong>{lang === 'es' ? 'Categoría' : 'Category'}:</strong> {t.categories[item.category] || item.category}</p>
      <p><strong>{lang === 'es' ? 'Subcategoría' : 'Subcategory'}:</strong> {subcategoryTranslations[item.subcategory] || item.subcategory}</p>
      <p><strong>{isMovie ? (lang === 'es' ? 'Director' : 'Director') : (lang === 'es' ? 'Autor' : 'Author')}:</strong> {isMovie ? (item.director || (lang === 'es' ? 'Desconocido' : 'Unknown')) : (item.author || (lang === 'es' ? 'Desconocido' : 'Unknown'))}</p>
      {isMovie && (
        <p><strong>{lang === 'es' ? 'Año' : 'Year'}:</strong> {item.year || (lang === 'es' ? 'Desconocido' : 'Unknown')}</p>
      )}
      <p><strong>{lang === 'es' ? 'Descripción' : 'Description'}:</strong> {item.description[lang] || item.description.es}</p>
      {isMovie && (
        <a
          href={trailerUrl || '#'}
          className={`download-link${trailerUrl ? '' : ' disabled'}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{marginTop: '1.5rem', pointerEvents: trailerUrl ? 'auto' : 'none', opacity: trailerUrl ? 1 : 0.5}}
        >
          {trailerText}
        </a>
      )}
    </div>
  );
}

function AppContent() {
  const [view, setView] = useState({view: 'home'});
  const [lastCategory, setLastCategory] = useState(null);
  const { lang } = useLanguage();

  const handleCategory = cat => {
    setLastCategory(cat);
    setView({view: 'subcategories', category: cat});
  };

  const handleItemClick = id => {
    setView({view: 'itemDetail', itemId: id});
  };

  const navigate = newView => {
    setView(newView);
  };

  // Renderizar vista correspondiente
  let content;
  switch (view.view) {
    case 'home':
      content = <HomePage onItemClick={handleItemClick} />;
      break;
    case 'categories':
      content = <CategoriesPage onCategory={handleCategory} />;
      break;
    case 'subcategories':
      content = (
        <SubcategoriesPage
          category={view.category}
          onBack={() => setView({view: 'categories'})}
          onItemClick={handleItemClick}
          onNavigate={navigate}
        />
      );
      break;
    case 'subcategoryItems':
      content = (
        <SubcategoryItemsPage
          category={view.category}
          subcategory={view.subcategory}
          onBack={() => setView({view: 'subcategories', category: view.category})}
          onItemClick={handleItemClick}
        />
      );
      break;
    case 'itemDetail':
      content = (
        <ItemDetailPage
          itemId={view.itemId}
          onBack={() => {
            // Volver a la subcategoría anterior si existe, sino a categorías
            if (view.view === 'itemDetail' && lastCategory) {
              setView({view: 'subcategories', category: lastCategory});
            } else {
              setView({view: 'categories'});
            }
          }}
        />
      );
      break;
    default:
      content = <div>Página no encontrada</div>;
  }

  // --- AÑADIDO: Renderizar el menú superior SIEMPRE ---
  let showBack = false;
  let onBack = null;
  let backLabel = '';
  if (view.view === 'subcategories' || view.view === 'itemDetail' || view.view === 'subcategoryItems') {
    showBack = true;
    onBack = view.view === 'subcategories'
      ? () => setView({view: 'categories'})
      : () => setView({view: 'subcategories', category: lastCategory});
    backLabel = lang === 'en' ? 'Back' : 'Volver';
  }

  return (
    <div className="container">
      <Menu onNavigate={setView} showBack={showBack} onBack={onBack} backLabel={backLabel} />
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
