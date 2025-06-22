import { useEffect, useMemo } from 'react';

export function useCategories(getCategories, t) {
  const categoriesFromStore = getCategories();
  return useMemo(
    () =>
      categoriesFromStore.map(cat => ({
        ...cat,
        label: t?.categories?.[cat.key] || cat.label,
        isMasterpiece: cat.key === 'masterpiece' || cat.masterpiece === true,
      })),
    [categoriesFromStore, t]
  );
}

export function useCategorySubcategories(selectedCategory, getSubcategoriesForCategory, t, lang) {
  return useMemo(() => {
    let subs = getSubcategoriesForCategory(selectedCategory);
    if (selectedCategory === 'boardgames' && Array.isArray(subs)) {
      return subs.map(({ sub, ...rest }) => ({
        sub: sub.toLowerCase().trim(),
        label: t?.subcategories?.boardgames?.[sub.toLowerCase().trim()] || sub,
        ...rest,
      }));
    }
    return subs;
  }, [selectedCategory, getSubcategoriesForCategory, t, lang]);
}
