import React from 'react';

const CategoryBar = ({ categories, selectedCategory, onCategoryClick }) => (
  <div className="categories-container">
    <div className="categories-list">
      {Array.isArray(categories) && categories.map((category) => (
        <button
          key={category.key}
          className={`category-btn${selectedCategory === category.key ? ' active' : ''}`}
          onClick={() => onCategoryClick(category.key)}
        >
          {category.label}
        </button>
      ))}
    </div>
  </div>
);

export default CategoryBar;
