// Detecta si la categoría es válida para infinite scroll (no home ni especiales)
export function isCategoryListView(selectedCategory: string | null, isHome: boolean): boolean {
  if (isHome) return false;
  if (!selectedCategory) return false;
  // Puedes ajustar aquí si hay categorías especiales que no deban tener infinite scroll
  return true;
} 