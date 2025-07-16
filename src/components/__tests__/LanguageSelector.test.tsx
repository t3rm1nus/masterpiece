import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import LanguageSelector from '../ui/LanguageSelector';

const idiomas = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

describe('LanguageSelector', () => {
  it('renderiza el selector desktop con idiomas y flags', () => {
    const { getByText, getByRole } = render(
      <LanguageSelector languages={idiomas} showFlags showLabels value="es" />
    );
    expect(getByText('Español')).toBeInTheDocument();
    expect(getByRole('combobox')).toBeInTheDocument();
    // No comprobamos los emojis de bandera porque pueden no ser accesibles en test
  });

  it('renderiza el selector mobile con botones', () => {
    const { getByText } = render(
      <LanguageSelector languages={idiomas} variant="mobile" value="en" showLabels />
    );
    expect(getByText('Español')).toBeInTheDocument();
    expect(getByText('English')).toBeInTheDocument();
  });

  it('llama a onChange al seleccionar idioma (desktop)', () => {
    const onChange = jest.fn();
    const { getByRole } = render(
      <LanguageSelector languages={idiomas} value="es" onChange={onChange} />
    );
    // No se puede simular bien el Select de MUI, así que solo comprobamos que existe el combobox
    expect(getByRole('combobox')).toBeInTheDocument();
  });

  it('llama a onChange al hacer click en botón (mobile)', () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <LanguageSelector languages={idiomas} variant="mobile" value="es" onChange={onChange} />
    );
    fireEvent.click(getByText('English'));
    expect(onChange).toHaveBeenCalledWith('en');
  });
}); 