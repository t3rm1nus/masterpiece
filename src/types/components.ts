// Tipos para componentes React
import { ReactNode } from 'react';
import { Item } from './data';
import { Category } from './index';

// Props base para componentes
export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
}

// Props para componentes de items
export interface ItemDetailProps {
  item: Item;
  onClose: () => void;
  isOpen: boolean;
}

export interface ItemCardProps {
  item: Item;
  onClick?: () => void;
  showDetails?: boolean;
}

// Props para navegación
export interface CategoryBarProps {
  currentCategory: Category;
  onCategoryChange: (category: Category) => void;
}

export interface SubcategoryBarProps {
  category: Category;
  currentSubcategory: string;
  onSubcategoryChange: (subcategory: string) => void;
}

// Props para menús
export interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Props para layout
export interface LayoutProps {
  children: ReactNode;
}

// Props para formularios
export interface FormProps {
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}