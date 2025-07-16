import { render, fireEvent, screen } from '@testing-library/react';
import ThemeToggle from '../ui/ThemeToggle';
import { LanguageProvider } from "../../LanguageContext";
import MaterialThemeProvider from "../MaterialThemeProvider";

describe('ThemeToggle', () => {
  it('renderiza y responde a click', () => {
    const { getByRole } = render(
      <LanguageProvider>
        <MaterialThemeProvider>
          <ThemeToggle />
        </MaterialThemeProvider>
      </LanguageProvider>
    );
    const button = getByRole('button');
    fireEvent.click(button);
    expect(button).toBeInTheDocument();
  });

  it('muestra el label cuando showLabel es true', () => {
    const { getByText } = render(
      <LanguageProvider>
        <MaterialThemeProvider>
          <ThemeToggle showLabel />
        </MaterialThemeProvider>
      </LanguageProvider>
    );
    expect(getByText(/modo/i)).toBeInTheDocument();
  });

  it('usa iconos personalizados', () => {
    const iconLight = <span data-testid="icon-light">🌞</span>;
    const iconDark = <span data-testid="icon-dark">🌚</span>;
    render(
      <LanguageProvider>
        <MaterialThemeProvider>
          <ThemeToggle iconLight={iconLight} iconDark={iconDark} />
        </MaterialThemeProvider>
      </LanguageProvider>
    );
    // Debe estar uno de los dos, según el tema
    expect(screen.queryByTestId('icon-light') || screen.queryByTestId('icon-dark')).toBeTruthy();
  });

  it('muestra tooltip si se pasa', async () => {
    render(
      <LanguageProvider>
        <MaterialThemeProvider>
          <ThemeToggle tooltip="Cambia el tema" />
        </MaterialThemeProvider>
      </LanguageProvider>
    );
    // Simular hover sobre el botón para mostrar el tooltip
    fireEvent.mouseOver(screen.getByRole('button'));
    // Esperar a que aparezca el tooltip
    const tooltip = await screen.findByText('Cambia el tema');
    expect(tooltip).toBeInTheDocument();
  });

  it('llama a onToggle cuando se hace click', () => {
    const onToggle = jest.fn();
    const { getByRole } = render(
      <LanguageProvider>
        <MaterialThemeProvider>
          <ThemeToggle onToggle={onToggle} />
        </MaterialThemeProvider>
      </LanguageProvider>
    );
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalled();
  });

  it('aplica aria-label personalizado', () => {
    const { getByLabelText } = render(
      <LanguageProvider>
        <MaterialThemeProvider>
          <ThemeToggle ariaLabel="cambiar tema" />
        </MaterialThemeProvider>
      </LanguageProvider>
    );
    expect(getByLabelText('cambiar tema')).toBeInTheDocument();
  });
}); 