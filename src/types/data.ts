export interface BaseItem {
  id: string;
  title: string;
  year?: number;
  genre?: string[];
  description?: string;
  image?: string;
}

export interface Movie extends BaseItem {
  director?: string;
  duration?: string;
}

export interface Book extends BaseItem {
  author?: string;
  pages?: number;
}

// Aquí puedes añadir más interfaces para comics, música, etc. 