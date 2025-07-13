// Tipos para APIs y servicios

// Respuesta de API genérica
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// Configuración de API
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// Parámetros de búsqueda
export interface SearchParams {
  query?: string;
  category?: string;
  subcategory?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filtros
export interface FilterOptions {
  year?: number[];
  genre?: string[];
  rating?: number[];
  language?: string[];
}

// Paginación
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Resultado paginado
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}