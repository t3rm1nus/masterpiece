// Tipos base para el proyecto
export * from './data';
export * from './components';
export * from './store';
export * from './api';

// Tipos globales
export type Category = 
  | 'peliculas' 
  | 'series' 
  | 'libros' 
  | 'musica' 
  | 'documentales' 
  | 'podcasts' 
  | 'videojuegos' 
  | 'juegos_de_mesa' 
  | 'comics';

export type Language = 'es' | 'en' | 'ca' | 'eu' | 'gl';

export type Theme = 'light' | 'dark';

// Tipos utilitarios
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;