// Tipos para los datos del proyecto

export interface BaseItem {
  id: string;
  title: string;
  year?: number;
  genre?: string[];
  description?: string;
  image?: string;
  rating?: number;
  language?: string;
}

export interface Movie extends BaseItem {
  director?: string;
  duration?: string;
  cast?: string[];
}

export interface Series extends BaseItem {
  seasons?: number;
  episodes?: number;
  creator?: string;
  cast?: string[];
}

export interface Book extends BaseItem {
  author?: string;
  pages?: number;
  isbn?: string;
  publisher?: string;
}

export interface Music extends BaseItem {
  artist?: string;
  album?: string;
  duration?: string;
  tracks?: number;
}

export interface Documentary extends BaseItem {
  director?: string;
  duration?: string;
  topic?: string;
}

export interface Podcast extends BaseItem {
  host?: string;
  episodes?: number;
  duration?: string;
  platform?: string;
}

export interface VideoGame extends BaseItem {
  developer?: string;
  publisher?: string;
  platform?: string[];
  genre?: string[];
}

export interface BoardGame extends BaseItem {
  designer?: string;
  publisher?: string;
  players?: string;
  duration?: string;
  complexity?: string;
}

export interface Comic extends BaseItem {
  author?: string;
  illustrator?: string;
  publisher?: string;
  pages?: number;
}

// Union type para todos los items
export type Item = 
  | Movie 
  | Series 
  | Book 
  | Music 
  | Documentary 
  | Podcast 
  | VideoGame 
  | BoardGame 
  | Comic;