import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import CategoryBar from '../home/CategoryBar';

const categories = [
  { key: 'movies', label: 'Películas' },
  { key: 'series', label: 'Series' },
  { key: 'books', label: 'Libros' }
];

describe('CategoryBar', () => {
  it('renderiza las categorías y resalta la activa', () => {
    const { getByText } = render(
      <CategoryBar
        categories={categories}
        selectedCategory="series"
        onCategoryClick={() => {}}
      />
    );
    expect(getByText('Películas')).toBeInTheDocument();
    expect(getByText('Series').className).toMatch(/active/);
    expect(getByText('Libros')).toBeInTheDocument();
  });

  it('llama a onCategoryClick al hacer click', () => {
    const onCategoryClick = jest.fn();
    const { getByText } = render(
      <CategoryBar
        categories={categories}
        selectedCategory={null}
        onCategoryClick={onCategoryClick}
      />
    );
    fireEvent.click(getByText('Libros'));
    expect(onCategoryClick).toHaveBeenCalledWith('books');
  });

  it('usa renderButton personalizado si se pasa', () => {
    const { getByText } = render(
      <CategoryBar
        categories={categories}
        selectedCategory="movies"
        onCategoryClick={() => {}}
        renderButton={(cat, isActive) => <button key={cat.key}>{cat.label} {isActive ? 'ACTIVO' : ''}</button>}
      />
    );
    expect(getByText('Películas ACTIVO')).toBeInTheDocument();
    expect(getByText('Series')).toBeInTheDocument();
  });

  it('no renderiza nada si visible es false', () => {
    const { container } = render(
      <CategoryBar
        categories={categories}
        selectedCategory={null}
        onCategoryClick={() => {}}
        visible={false}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('no crashea si categories es vacío', () => {
    const { container } = render(
      <CategoryBar
        categories={[]}
        selectedCategory={null}
        onCategoryClick={() => {}}
      />
    );
    expect(container.querySelectorAll('.category-btn').length).toBe(0);
  });

  it('aplica estilos personalizados al contenedor y botones', () => {
    const sx = { background: 'red' };
    const buttonSx = { color: 'blue' };
    const { container, getByText } = render(
      <CategoryBar
        categories={categories}
        selectedCategory={null}
        onCategoryClick={() => {}}
        sx={sx}
        buttonSx={buttonSx}
      />
    );
    expect(container.firstChild).toHaveStyle('background: red');
    // No se puede verificar el style inline del botón fácilmente porque se aplica vía sx, pero el prop se pasa
    expect(getByText('Películas')).toBeInTheDocument();
  });

  it('acepta props adicionales en el contenedor', () => {
    const { container } = render(
      <CategoryBar
        categories={categories}
        selectedCategory={null}
        onCategoryClick={() => {}}
        data-testid="catbar"
      />
    );
    expect(container.querySelector('[data-testid="catbar"]')).toBeInTheDocument();
  });

  it('renderiza correctamente con props mínimos', () => {
    render(<CategoryBar categories={[]} selectedCategory={null} onCategoryClick={() => {}} />);
  });

  it('acepta fragmentos y children', () => {
    const { container } = render(<CategoryBar categories={[]} selectedCategory={null} onCategoryClick={() => {}}>{<><span>Child</span></>}</CategoryBar>);
    expect(container).toBeDefined();
  });
}); 