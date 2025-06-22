import React from 'react';

const SubcategoryBar = ({ selectedCategory, categorySubcategories, activeSubcategory, setActiveSubcategory, allData, t, lang }) => {
  if (!selectedCategory) return null;
  if (selectedCategory !== 'documentales') {
    return (
      <div className="subcategories-container">
        {Array.isArray(categorySubcategories) && categorySubcategories.length > 0 && (
          categorySubcategories
            .sort((a, b) => a.order - b.order)
            .map(({ sub }) => (
              <button
                key={sub}
                className={`subcategory-btn${activeSubcategory === sub ? ' active' : ''}`}
                onClick={() => setActiveSubcategory(sub)}
              >
                {t?.subcategories?.[selectedCategory]?.[sub.toLowerCase()] || sub}
              </button>
            ))
        )}
      </div>
    );
  }
  // documentales: subcats dinámicos
  const subcatsSet = new Set();
  (allData['documentales'] || []).forEach(item => {
    if (item.subcategory) subcatsSet.add(item.subcategory.toLowerCase().trim());
  });
  const subcats = Array.from(subcatsSet).sort((a, b) => a.localeCompare(b, lang === 'es' ? 'es' : 'en', { sensitivity: 'base' }));
  return (
    <div className="subcategories-container">
      {subcats.map(sub => (
        <button
          key={sub}
          className={`subcategory-btn${activeSubcategory === sub ? ' active' : ''}`}
          onClick={() => setActiveSubcategory(sub)}
        >
          {t?.subcategories?.documentales?.[sub] || sub}
        </button>
      ))}
    </div>
  );
};

export default SubcategoryBar;
