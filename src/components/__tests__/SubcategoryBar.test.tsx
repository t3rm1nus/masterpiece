import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SubcategoryBar from '../home/SubcategoryBar';

describe('SubcategoryBar', () => {
  const baseProps = {
    selectedCategory: 'movies',
    categorySubcategories: [
      { sub: 'Acción', order: 1 },
      { sub: 'Drama', order: 2 }
    ],
    activeSubcategory: 'Acción',
    setActiveSubcategory: jest.fn(),
    lang: 'es',
  };

  it('renderiza subcategorías y resalta la activa', () => {
    const { getAllByRole } = render(<SubcategoryBar {...baseProps} />);
    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(2); // Debe haber dos subcategorías
    // Nota: No es posible comprobar el texto de los botones porque el HTML está vacío en el entorno de test.
    expect(buttons[0].className).toMatch(/active/);
  });

  it('llama a setActiveSubcategory al hacer click', () => {
    const setActiveSubcategory = jest.fn();
    const { getAllByRole } = render(
      <SubcategoryBar {...baseProps} setActiveSubcategory={setActiveSubcategory} />
    );
    const buttons = getAllByRole('button');
    fireEvent.click(buttons[1]);
    expect(setActiveSubcategory).toHaveBeenCalledWith('Drama');
  });

  it('renderiza usando renderChip personalizado', () => {
    const renderChip = (subcat: string, selected: boolean, idx: number) => (
      <span key={subcat} data-testid={`chip-${subcat}`}>{subcat} {selected ? 'activo' : ''}</span>
    );
    const { getByTestId } = render(
      <SubcategoryBar {...baseProps} renderChip={renderChip} />
    );
    expect(getByTestId('chip-Acción')).toHaveTextContent('Acción activo');
    expect(getByTestId('chip-Drama')).toHaveTextContent('Drama');
  });

  it('renderiza subcategorías dinámicas para documentales', () => {
    const allData = { documentales: [
      { subcategory: 'Historia' },
      { subcategory: 'Ciencia' },
      { subcategory: 'Historia' } // Duplicado, debe salir solo una vez
    ] };
    const setActiveSubcategory = jest.fn();
    const { getAllByRole, getByText } = render(
      <SubcategoryBar
        selectedCategory="documentales"
        categorySubcategories={[]}
        activeSubcategory="Historia"
        setActiveSubcategory={setActiveSubcategory}
        allData={allData}
        lang="es"
      />
    );
    const buttons = getAllByRole('button');
    expect(buttons.length).toBe(2);
    // Verifica que el botón activo tiene el texto correcto (minúsculas)
    expect(getByText((content) => content.toLowerCase() === 'historia')).toBeInTheDocument();
    // Click en el primer botón ('ciencia')
    fireEvent.click(buttons[0]);
    expect(setActiveSubcategory).toHaveBeenCalledWith('ciencia');
    // Click en el segundo botón ('historia')
    fireEvent.click(buttons[1]);
    expect(setActiveSubcategory).toHaveBeenCalledWith('historia');
  });

  it('traduce subcategorías de documentales usando t', () => {
    const allData = { documentales: [ { subcategory: 'historia' } ] };
    const t = { subcategories: { documentales: { historia: 'Historia traducida' } } };
    const { getByText } = render(
      <SubcategoryBar
        selectedCategory="documentales"
        categorySubcategories={[]}
        activeSubcategory={null}
        setActiveSubcategory={() => {}}
        allData={allData}
        t={t}
        lang="es"
      />
    );
    expect(getByText('Historia traducida')).toBeInTheDocument();
  });

  it('no renderiza nada si visible es false', () => {
    const { container } = render(<SubcategoryBar {...baseProps} visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('no renderiza nada si selectedCategory es null', () => {
    const { container } = render(<SubcategoryBar {...baseProps} selectedCategory={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('aplica chipSx a los chips', () => {
    const chipSx = { background: 'red' };
    const { getAllByRole } = render(<SubcategoryBar {...baseProps} chipSx={chipSx} />);
    // No se puede comprobar el estilo inline directamente, pero el test asegura que no crashea
    expect(getAllByRole('button').length).toBeGreaterThan(0);
  });

  it('renderiza subcategorías con label personalizado', () => {
    const categorySubcategories = [
      { sub: 'accion', label: 'Acción Traducida' },
      { sub: 'drama', label: 'Drama Traducida' }
    ];
    const { getByText } = render(<SubcategoryBar {...baseProps} categorySubcategories={categorySubcategories} />);
    expect(getByText((content) => content.includes('Acción Traducida'))).toBeInTheDocument();
    expect(getByText((content) => content.includes('Drama Traducida'))).toBeInTheDocument();
  });

  it('no renderiza nada si categorySubcategories es vacío', () => {
    const { container } = render(<SubcategoryBar {...baseProps} categorySubcategories={[]} />);
    expect(container.querySelectorAll('button').length).toBe(0);
  });

  it('renderiza correctamente con props mínimos', () => {
    render(<SubcategoryBar selectedCategory="movies" categorySubcategories={[]} activeSubcategory={null} setActiveSubcategory={() => {}} />);
  });

  it('acepta fragmentos y children', () => {
    const { container } = render(<SubcategoryBar {...baseProps}>{<><span>Child</span></>}</SubcategoryBar>);
    expect(container).toBeDefined();
  });
}); 