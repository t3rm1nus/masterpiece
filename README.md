# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Componentes UI base

### UiButton

Botón base reutilizable para toda la app. Centraliza estilos y variantes. Extiende MUI Button.

**Props:**

- `variant`: 'contained' | 'outlined' | 'text' (variante visual, default: 'contained')
- `color`: string (color del botón, default: 'primary')
- `size`: 'small' | 'medium' | 'large' (tamaño, default: 'medium')
- `icon`: ReactNode (icono opcional a la izquierda)
- `onClick`: function (callback al hacer click)
- `sx`: object (estilos adicionales MUI sx)
- `className`: string (clase CSS adicional)
- `children`: contenido del botón

**Ejemplo de uso:**

```jsx
import UiButton from './src/components/ui/UiButton';

<UiButton variant="outlined" color="secondary" onClick={handleClick} icon={<MyIcon />}>Aceptar</UiButton>
```

### SpecialButtons

Botones especiales contextuales para categorías. Permite customizar estilos, callbacks, visibilidad y textos.

**Props:**

- `selectedCategory`: string (categoría activa)
- `isSpanishCinemaActive`: boolean (estado del botón Cine Español)
- `handleSpanishCinemaToggle`: function (callback para alternar Cine Español)
- `isMasterpieceActive`: boolean (estado del botón Obras Maestras)
- `handleMasterpieceToggle`: function (callback para alternar Obras Maestras)
- `activePodcastLanguages`: array (idiomas activos en podcast)
- `togglePodcastLanguage`: function (callback para alternar idioma podcast)
- `activeDocumentaryLanguages`: array (idiomas activos en documentales)
- `toggleDocumentaryLanguage`: function (callback para alternar idioma documental)
- `lang`: string (idioma actual)
- `isRecommendedActive`: boolean (oculta botón Obras Maestras si true)
- `isMobile`: boolean (aplica estilos móviles)

**Ejemplo de uso:**

```jsx
<SpecialButtons
  selectedCategory="movies"
  isSpanishCinemaActive={true}
  handleSpanishCinemaToggle={() => {}}
  isMasterpieceActive={false}
  handleMasterpieceToggle={() => {}}
  lang="es"
  isMobile={false}
/>
```

### CategoryBar

Barra de selección de categorías altamente parametrizable y reutilizable. Permite customizar estilos, iconos, callbacks, render y visibilidad.

**Props avanzados:**
- `categories`: array (lista de categorías { key, label })
- `selectedCategory`: string (categoría activa)
- `onCategoryClick`: function (callback al seleccionar categoría)
- `renderButton`: función opcional para custom render de cada botón `(cat, selected, idx) => ReactNode`
- `sx`: objeto de estilos adicionales para el contenedor
- `buttonSx`: objeto de estilos adicionales para cada botón
- `visible`: boolean (si se muestra el componente, default: true)
- ...props: cualquier otro prop para el contenedor

**Ejemplo de uso:**

```jsx
import CategoryBar from './src/components/home/CategoryBar';

<CategoryBar
  categories={[{ key: 'movies', label: 'Películas' }]}
  selectedCategory="movies"
  onCategoryClick={key => {}}
  sx={{ background: '#fafafa' }}
  buttonSx={{ fontSize: 18 }}
/>

// Custom render
<CategoryBar
  categories={cats}
  selectedCategory={active}
  onCategoryClick={setActive}
  renderButton={(cat, selected) => (
    <button key={cat.key} style={{ color: selected ? 'blue' : 'black' }}>{cat.label}</button>
  )}
/>
```

### SubcategoryBar

Barra de selección de subcategorías altamente parametrizable y reutilizable. Permite customizar estilos, callbacks, render y visibilidad de elementos.

**Props avanzados:**
- `selectedCategory`: string (categoría activa)
- `categorySubcategories`: array (subcategorías de la categoría)
- `activeSubcategory`: string (subcategoría activa)
- `setActiveSubcategory`: function (callback al seleccionar subcategoría)
- `allData`: object (datos completos para subcats dinámicos)
- `t`: object (traducciones)
- `lang`: string (idioma actual)
- `renderChip`: función opcional para custom render de cada chip `(subcat, selected, idx) => ReactNode`
- `sx`: objeto de estilos adicionales para el contenedor
- `chipSx`: objeto de estilos adicionales para cada chip
- `visible`: boolean (si se muestra el componente, default: true)
- ...props: cualquier otro prop para el contenedor

**Ejemplo de uso:**

```jsx
import SubcategoryBar from './src/components/home/SubcategoryBar';

<SubcategoryBar
  selectedCategory="movies"
  categorySubcategories={[{ sub: 'Acción', order: 1 }]}
  activeSubcategory="Acción"
  setActiveSubcategory={sub => {}}
  sx={{ background: '#fafafa' }}
  chipSx={{ fontSize: 16 }}
/>

// Custom render
<SubcategoryBar
  selectedCategory={cat}
  categorySubcategories={subcats}
  activeSubcategory={active}
  setActiveSubcategory={setActive}
  renderChip={(subcat, selected) => (
    <span key={subcat} style={{ color: selected ? 'red' : 'gray' }}>{subcat}</span>
  )}
/>
```

### UnifiedItemDetail

Detalle unificado de ítem para todas las categorías. Permite pasar acciones extra, customizar layout y mostrar/ocultar secciones.

**Props:**

- `item`: objeto de datos del ítem a mostrar
- `onClose`: función para cerrar el detalle
- `selectedCategory`: string (categoría activa)
- `renderMobileActionButtons`: función opcional para renderizar acciones extra en mobile
- `renderDesktopActionButtons`: función opcional para renderizar acciones extra en desktop
- `renderMobileSpecificContent`: función opcional para renderizar contenido extra en mobile
- `renderDesktopSpecificContent`: función opcional para renderizar contenido extra en desktop
- `showSections`: objeto opcional para mostrar/ocultar secciones (por ejemplo: `{ trailer: true, description: false }`)

**Ejemplo de uso:**

```jsx
<UnifiedItemDetail
  item={item}
  onClose={() => setOpen(false)}
  selectedCategory="movies"
  renderMobileActionButtons={() => <CustomActions />}
  showSections={{ trailer: true, description: false }}
/>
```

### MaterialContentWrapper

Wrapper adaptable para recomendaciones y contenido principal. Permite customizar layout, pasar acciones extra y mostrar/ocultar secciones.

**Props:**

- `children`: contenido a renderizar (usado en desktop)
- `categories`: array de categorías
- `selectedCategory`: string (categoría activa)
- `onCategoryClick`: función para seleccionar categoría
- `subcategories`: array de subcategorías
- `activeSubcategory`: string (subcategoría activa)
- `onSubcategoryClick`: función para seleccionar subcategoría
- `recommendations`: array de recomendaciones a mostrar
- `isHome`: boolean (modo home)
- `categoryColor`: string (color de la categoría)
- `renderExtraActions`: función opcional para renderizar acciones extra
- `showSections`: objeto opcional para mostrar/ocultar secciones (por ejemplo: `{ recommendations: true, emptyState: true }`)

**Ejemplo de uso:**

```jsx
<MaterialContentWrapper
  categories={categories}
  selectedCategory={selectedCategory}
  onCategoryClick={onCategoryClick}
  recommendations={recommendations}
  renderExtraActions={() => <CustomActions />}
  showSections={{ recommendations: true }}
>
  {children}
</MaterialContentWrapper>
```

### MaterialMobileMenu

Menú lateral y AppBar para navegación móvil. Permite customizar renderizado de items, estilos y callbacks.

**Props:**

- `renderMenuItem`: función opcional para customizar el render de cada ítem del menú `(item, index) => ReactNode`
- `menuItems`: array opcional de items personalizados para el menú
- `onMenuOpen`/`onMenuClose`: callbacks opcionales al abrir/cerrar el menú
- `sx`: estilos adicionales para el Drawer/AppBar

**Ejemplo de uso:**

```jsx
<MaterialMobileMenu
  renderMenuItem={(item, idx) => <CustomMenuItem item={item} key={idx} />}
  menuItems={[{ label: 'Inicio', icon: <HomeIcon />, action: () => {} }]}
  onMenuOpen={() => {}}
  onMenuClose={() => {}}
  sx={{ background: '#222' }}
/>
```

### HybridMenu

Menú adaptable que muestra menú móvil o desktop según el dispositivo. Permite customizar renderizado de items, estilos y callbacks.

**Props:**

- `renderMenuItem`: función opcional para customizar el render de cada ítem del menú `(item, index) => ReactNode`
- `menuItems`: array opcional de items personalizados para el menú
- `onMenuOpen`/`onMenuClose`: callbacks opcionales al abrir/cerrar el menú
- `sx`: estilos adicionales para el menú

**Ejemplo de uso:**

```jsx
<HybridMenu
  renderMenuItem={(item, idx) => <CustomMenuItem item={item} key={idx} />}
  menuItems={[{ label: 'Inicio', icon: <HomeIcon />, action: () => {} }]}
  onMenuOpen={() => {}}
  onMenuClose={() => {}}
  sx={{ background: '#222' }}
/>
```

### SplashDialog (ejemplo de modal/dialogo parametrizable)

Modal/diálogo de splash personalizable. Permite definir título, contenido, acciones, estilos y callbacks de cierre.

**Props:**

- `open`: boolean (si el diálogo está abierto)
- `onClose`: función (callback al cerrar)
- `title`: string o ReactNode (título opcional)
- `content`: ReactNode (contenido opcional, por defecto imagen splash)
- `actions`: ReactNode (acciones opcionales, por ejemplo botones)
- `audio`: string (ruta de audio opcional)
- `dark`: boolean (modo oscuro)
- `sx`: estilos adicionales para el diálogo
- `PaperProps`/`DialogContentProps`: props adicionales para personalizar estilos

**Ejemplo de uso:**

```jsx
<SplashDialog
  open={open}
  onClose={() => setOpen(false)}
  title="Bienvenido"
  content={<img src="/imagenes/splash_image.png" alt="Splash" />}
  actions={<Button onClick={onClose}>Cerrar</Button>}
  audio="/imagenes/samurai.mp3"
  dark={true}
  sx={{ background: '#111' }}
/>
```

### Modal

Modal base personalizable. Permite definir título, acciones, estilos, callbacks y visibilidad de secciones.

**Props:**

- `open`: boolean (si el modal está abierto)
- `onClose`: función (callback al cerrar)
- `title`: string o ReactNode (título opcional)
- `actions`: ReactNode (acciones opcionales, por ejemplo botones)
- `children`: contenido principal
- `className`: string (clase CSS para el modal)
- `contentClassName`: string (clase CSS para el contenido)
- `backdropClassName`: string (clase CSS para el fondo)
- `sx`: objeto de estilos adicionales `{ modal, content, backdrop, title, actions }`
- `onBackdropClick`: función (callback al hacer click en el fondo)

**Ejemplo de uso:**

```jsx
<Modal
  open={open}
  onClose={onClose}
  title="Título"
  actions={<button onClick={onClose}>Cerrar</button>}
  sx={{ modal: { background: '#fff' }, title: { color: 'red' } }}
>
  <p>Contenido</p>
</Modal>
```

### Alert

Alerta base personalizable. Permite definir título, acciones, icono, estilos, visibilidad y callbacks.

**Props:**

- `type`: 'info' | 'success' | 'warning' | 'error' (tipo de alerta)
- `title`: string o ReactNode (título opcional)
- `children`: contenido principal
- `actions`: ReactNode (acciones opcionales, por ejemplo botones)
- `icon`: ReactNode (icono opcional)
- `onClose`: función (callback al cerrar)
- `className`: string (clase CSS adicional)
- `sx`: objeto de estilos adicionales `{ root, title, content, actions, icon, close }`
- `visible`: boolean (si la alerta está visible)

**Ejemplo de uso:**

```jsx
<Alert
  type="success"
  title="Éxito"
  actions={<button onClick={onClose}>Cerrar</button>}
  icon={<CheckIcon />}
  onClose={onClose}
  sx={{ root: { background: '#e0ffe0' }, title: { color: 'green' } }}
>
  Operación completada
</Alert>
```

### LanguageSelector

Selector de idioma parametrizable y reutilizable. Permite customizar los idiomas, el renderizado, los estilos, el modo visual y la integración controlada o con contexto global.

**Props:**
- `languages`: array de objetos `{ code, label, flag? }` (idiomas a mostrar, por defecto español e inglés)
- `onChange`: función (callback al cambiar idioma, recibe el código)
- `value`: string (idioma seleccionado, modo controlado)
- `variant`: 'desktop' | 'mobile' (modo visual, default: 'desktop')
- `sx`: objeto de estilos MUI (aplicado al contenedor)
- `className`: string (clase CSS adicional)
- `showFlags`: boolean (mostrar banderas, default: false)
- `showLabels`: boolean (mostrar etiquetas, default: true)
- `buttonProps`: props adicionales para los botones (mobile)
- `selectProps`: props adicionales para el Select (desktop)

**Ejemplo de uso:**

```jsx
import LanguageSelector from './src/components/ui/LanguageSelector';

// Desktop, controlado
<LanguageSelector
  languages={[
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ]}
  value={lang}
  onChange={setLang}
  showFlags
  sx={{ my: 2 }}
/>

// Mobile, con contexto global
<LanguageSelector variant="mobile" showFlags showLabels={false} />
```

### ThemeToggle

Botón para alternar entre tema claro y oscuro, altamente parametrizable. Permite customizar iconos, tooltips, estilos, callbacks y modo de visualización.

**Props:**
- `showLabel`: boolean (muestra el texto junto al icono, default: false)
- `sx`: objeto de estilos adicionales para el botón
- `iconLight`: ReactNode (icono personalizado para modo claro)
- `iconDark`: ReactNode (icono personalizado para modo oscuro)
- `color`: string (color del botón, default: 'secondary')
- `variant`: string (variante del botón, default: 'outlined')
- `onToggle`: función (callback opcional al cambiar el tema, recibe el nuevo valor)
- `tooltip`: string o ReactNode (tooltip personalizado, opcional)
- `tooltipProps`: objeto de props adicionales para el tooltip (opcional)
- `size`: string (tamaño del botón, default: 'medium')
- `ariaLabel`: string (etiqueta accesible personalizada)

**Ejemplo de uso:**

```jsx
import ThemeToggle from './src/components/ui/ThemeToggle';

<ThemeToggle
  showLabel
  iconLight={<SunIcon />}
  iconDark={<MoonIcon />}
  color="primary"
  variant="contained"
  sx={{ borderRadius: 8, boxShadow: '0 2px 8px #0002' }}
  onToggle={mode => console.log('Nuevo modo:', mode)}
  tooltip="Cambiar tema"
  tooltipProps={{ placement: 'bottom' }}
  size="large"
  ariaLabel="Alternar tema"
/>
```

### FabBackButton

Botón flotante de retroceso, totalmente parametrizable. Permite customizar el icono, color, tamaño, posición, visibilidad, accesibilidad y cualquier prop de MUI Fab.

**Props:**
- `icon`: ReactNode (icono personalizado, default: ArrowBackIcon)
- `color`: string (color del botón, default: 'primary')
- `size`: 'small' | 'medium' | 'large' (tamaño, default: 'medium')
- `sx`: objeto de estilos MUI (posición, etc.)
- `onClick`: función (callback al hacer click)
- `visible`: boolean (si se muestra el botón, default: true)
- `ariaLabel`: string (accesibilidad, default: 'volver')
- ...props: cualquier otro prop de MUI Fab

**Ejemplo de uso:**

```jsx
import FabBackButton from './src/components/ui/FabBackButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';

<FabBackButton
  onClick={() => window.history.back()}
  color="secondary"
  size="large"
  sx={{ top: 120, left: 24, background: '#fff' }}
  icon={<HomeIcon />}
  ariaLabel="Volver al inicio"
  visible={true}
/>

// Ocultar condicionalmente
<FabBackButton visible={false} />
```

### MaterialSubcategoryChips

Renderiza una lista de chips de subcategoría altamente parametrizable. Permite customizar el renderizado, estilos, iconos, callbacks y visibilidad.

**Props:**
- `subcategories`: array de objetos `{ key, label, icon? }` (subcategorías a mostrar)
- `value`: string (subcategoría seleccionada)
- `onChange`: función (callback al seleccionar subcategoría)
- `renderChip`: función opcional para customizar el render de cada chip `(subcat, selected, idx) => ReactNode`
- `sx`: objeto de estilos adicionales para el contenedor
- `chipSx`: objeto de estilos adicionales para cada chip
- `visible`: boolean (si se muestra el componente, default: true)
- `showIcons`: boolean (mostrar iconos si existen)
- ...props: cualquier otro prop para el contenedor

**Ejemplo de uso:**

```jsx
import MaterialSubcategoryChips from './src/components/ui/MaterialSubcategoryChips';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

<MaterialSubcategoryChips
  subcategories={[
    { key: 'accion', label: 'Acción', icon: <LocalOfferIcon /> },
    { key: 'drama', label: 'Drama' },
  ]}
  value={activeSubcat}
  onChange={setActiveSubcat}
  showIcons
  chipSx={{ fontSize: 16 }}
/>

// Custom render
<MaterialSubcategoryChips
  subcategories={subcats}
  value={active}
  onChange={setActive}
  renderChip={(subcat, selected) => (
    <span key={subcat.key} style={{ color: selected ? 'red' : 'gray' }}>{subcat.label}</span>
  )}
/>
```

### MaterialCategoryButtons

Renderiza una lista de botones de categoría altamente parametrizable. Permite customizar el renderizado, estilos, iconos, callbacks y visibilidad.

**Props:**
- `categories`: array de objetos `{ key, label, icon? }` (categorías a mostrar)
- `value`: string (categoría seleccionada)
- `onChange`: función (callback al seleccionar categoría)
- `renderButton`: función opcional para customizar el render de cada botón `(cat, selected, idx) => ReactNode`
- `sx`: objeto de estilos adicionales para el contenedor
- `buttonSx`: objeto de estilos adicionales para cada botón
- `visible`: boolean (si se muestra el componente, default: true)
- `showIcons`: boolean (mostrar iconos si existen)
- ...props: cualquier otro prop para el contenedor

**Ejemplo de uso:**

```jsx
import MaterialCategoryButtons from './src/components/ui/MaterialCategoryButtons';
import MovieIcon from '@mui/icons-material/Movie';

<MaterialCategoryButtons
  categories={[
    { key: 'peliculas', label: 'Películas', icon: <MovieIcon /> },
    { key: 'series', label: 'Series' },
  ]}
  value={selectedCat}
  onChange={setSelectedCat}
  showIcons
  buttonSx={{ fontSize: 18 }}
/>

// Custom render
<MaterialCategoryButtons
  categories={cats}
  value={active}
  onChange={setActive}
  renderButton={(cat, selected) => (
    <button key={cat.key} style={{ color: selected ? 'blue' : 'black' }}>{cat.label}</button>
  )}
/>
```

### UiCard

Tarjeta base reutilizable y altamente parametrizable. Permite definir cabecera, media, acciones, pie, estilos avanzados y props para cada sección.

**Props:**
- `elevation`: number (sombra de la tarjeta, default: 2)
- `variant`: 'elevation' | 'outlined' (variante visual, default: 'elevation')
- `color`: string (color de fondo, opcional)
- `sx`: object (estilos adicionales MUI sx)
- `className`: string (clase CSS adicional)
- `style`: object (estilos CSS adicionales)
- `header`: ReactNode (cabecera de la tarjeta, opcional)
- `headerProps`: object (props adicionales para CardHeader)
- `media`: ReactNode (zona de imagen/media, opcional)
- `mediaProps`: object (props adicionales para CardMedia o Box)
- `actions`: ReactNode (zona de acciones, opcional)
- `actionsProps`: object (props adicionales para CardActions)
- `footer`: ReactNode (pie de la tarjeta, opcional)
- `footerProps`: object (props adicionales para el footer)
- `contentProps`: object (props adicionales para CardContent)
- `children`: contenido principal de la tarjeta

**Ejemplo de uso:**

```jsx
import UiCard from './src/components/ui/UiCard';
import Button from '@mui/material/Button';

<UiCard
  header={<span>Título</span>}
  media={<img src="/img.jpg" alt="img" style={{ width: '100%' }} />}
  actions={<Button>Acción</Button>}
  footer={<small>Pie de tarjeta</small>}
  sx={{ maxWidth: 320, m: 2 }}
  contentProps={{ sx: { fontSize: 18 } }}
>
  Contenido principal de la tarjeta
</UiCard>
```

### MobileItemDetail / DesktopItemDetail

Componentes de detalle de ítem para móvil y desktop, altamente parametrizables. Permiten customizar el renderizado de cada sección, acciones, layout, visibilidad y estilos.

**Props avanzados:**
- `renderHeader`, `renderImage`, `renderCategory`, `renderSubcategory`, `renderYear`, `renderDescription`, `renderActions`, `renderFooter`: funciones para custom render de cada sección
- `showSections`: objeto para mostrar/ocultar secciones (por ejemplo: `{ image: true, category: true, year: true, description: true, actions: true, footer: true }`)
- `sx`, `className`, `style`: estilos avanzados
- ...props legacy (compatibles)

**Ejemplo de uso:**

```jsx
import MobileItemDetail from './src/components/shared/MobileItemDetail';
import DesktopItemDetail from './src/components/shared/DesktopItemDetail';

<MobileItemDetail
  selectedItem={item}
  title={item.title}
  description={item.description}
  renderImage={item => <img src={item.image} alt={item.title} style={{ width: '100%', borderRadius: 12 }} />}
  renderActions={item => <Button onClick={() => alert(item.title)}>Acción</Button>}
  showSections={{ year: false, footer: true }}
  sx={{ background: '#fafafa' }}
/>

<DesktopItemDetail
  selectedItem={item}
  title={item.title}
  description={item.description}
  renderCategory={item => <span style={{ color: 'red' }}>{item.category}</span>}
  showSections={{ description: true, actions: true }}
/>
```

### SharedComponents

Componentes utilitarios reutilizables y altamente parametrizables para imágenes, badges, etiquetas y estados vacíos.

**OptimizedImage**
- Props: `src`, `alt`, `className`, `style`, `loading`, `decoding`, `fallback`, ...props

**MasterpieceBadge**
- Props: `config`, `tooltip`, `size`, ...props

**CategoryLabels**
- Props: `category`, `subcategory`, `getCategoryTranslation`, `getSubcategoryTranslation`, `renderCategory`, `renderSubcategory`, `sx`, ...props

**NoResults**
- Props: `t`, `randomNotFoundImage`, `image`, `text`, `subtext`, `children`, `sx`, ...props

**Ejemplo de uso:**

```jsx
import { OptimizedImage, MasterpieceBadge, CategoryLabels, NoResults } from './src/components/SharedComponents';

<OptimizedImage src="/img.jpg" alt="Imagen" fallback="/fallback.png" style={{ borderRadius: 8 }} />
<MasterpieceBadge config={badgeConfig} tooltip="Obra maestra" size={64} />
<CategoryLabels category="movies" subcategory="action" getCategoryTranslation={t => t} getSubcategoryTranslation={t => t} />
<NoResults text="Nada encontrado" image="/notfound.png"> <Button>Volver</Button> </NoResults>
```

### RecommendationsList

Wrapper de lista de recomendaciones adaptable a dispositivo (mobile/desktop). Permite customizar el renderizado de ítems, callbacks, estilos, paginación, loading y empty state.

**Props:**
- `items`: array de recomendaciones a mostrar
- `renderItem`: función para custom render de cada ítem `(item, idx) => ReactNode`
- `onItemClick`: callback al hacer click en un ítem
- `loading`: boolean (estado de carga)
- `emptyComponent`: ReactNode o función para custom empty state
- `pagination`: objeto de paginación `{ page, pageSize, onPageChange }`
- `sx`, `className`, `style`: estilos avanzados
- ...props: cualquier otro prop que se pasa a la lista interna

**Ejemplo de uso:**

```jsx
import RecommendationsList from './src/components/RecommendationsList';

<RecommendationsList
  items={recs}
  renderItem={(item, idx) => <MyCard item={item} key={item.id} />}
  onItemClick={item => setSelected(item)}
  loading={isLoading}
  emptyComponent={<div>No hay recomendaciones</div>}
  pagination={{ page, pageSize, onPageChange }}
  sx={{ background: '#fafafa' }}
/>
```

### MaterialCategorySelect

Selector de categoría y subcategoría altamente parametrizable, ideal para flujos móviles o compactos. Permite customizar el render, callbacks, integración con subcategorías y estilos.

**Props:**
- `categories`: array de objetos `{ key, label, isMasterpiece?, icon? }` (categorías a mostrar)
- `selectedCategory`: string (categoría seleccionada)
- `onCategoryChange`: función (callback al seleccionar categoría o subcategoría, recibe `(categoryKey, subcategoryKey)`)
- `subcategories`: array de subcategorías (opcional, para mostrar select de subcategoría)
- `activeSubcategory`: string (subcategoría seleccionada, opcional)
- `sx`: objeto de estilos adicionales para el select principal
- `subcategorySx`: objeto de estilos adicionales para el select de subcategoría
- `visible`: boolean (si se muestra el componente, default: true)
- `showIcons`: boolean (mostrar iconos si existen, default: true)
- ...props: cualquier otro prop para el contenedor

**Ejemplo de uso:**

```jsx
import MaterialCategorySelect from './src/components/MaterialCategorySelect';
import MovieIcon from '@mui/icons-material/Movie';

<MaterialCategorySelect
  categories={[
    { key: 'peliculas', label: 'Películas', icon: <MovieIcon /> },
    { key: 'series', label: 'Series' },
  ]}
  selectedCategory={selectedCat}
  onCategoryChange={(cat, subcat) => {
    setSelectedCat(cat);
    setActiveSubcat(subcat);
  }}
  subcategories={[
    { sub: 'Acción', label: 'Acción' },
    { sub: 'Drama', label: 'Drama' },
  ]}
  activeSubcategory={activeSubcat}
/>

// Solo categorías (sin subcategorías)
<MaterialCategorySelect
  categories={cats}
  selectedCategory={active}
  onCategoryChange={setActive}
/>

// Customización avanzada: estilos y control de visibilidad
<MaterialCategorySelect
  categories={cats}
  selectedCategory={active}
  onCategoryChange={setActive}
  sx={{ background: '#f5f5f5' }}
  visible={isMobile}
/>
```
