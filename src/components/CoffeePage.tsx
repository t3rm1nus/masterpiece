import React, { useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import MaterialCoffeePage from './MaterialCoffeePage';

// =============================================
// CoffeePage: Página de donación legacy (redirige a MaterialCoffeePage)
// Página de donación legacy. Ahora redirige/renderiza MaterialCoffeePage para móviles y desktop. Mantener solo por compatibilidad.
// =============================================

interface CoffeePageProps {
  onAnimationEnd?: () => void;
}

const CoffeePage: React.FC<CoffeePageProps> = ({ onAnimationEnd }) => {
  const { t, getTranslation } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ marginTop: '70px' }}>
      {/* Componente Material UI para móviles Y desktop */}
      <MaterialCoffeePage onAnimationEnd={onAnimationEnd} />
      
      {/* Página clásica DESHABILITADA - ahora usamos MaterialCoffeePage para todo */}
      {false && (
      <div className="coffee-page desktop-only">
        {/* Icono de café animado */}
        <div className="coffee-icon">☕</div>
        
        {/* Título principal */}
        <h1 className="coffee-title animated-gradient-title"
            style={{
              background: 'linear-gradient(90deg, #f3ec78, #af4261)', // Placeholder, reemplazar si es necesario
              backgroundSize: '200% 200%',
              animation: 'animatedGradientBG 6s ease-in-out infinite',
              color: '#222',
            }}
        >
          {getTranslation('coffee.title', '¿Te gusta lo que ves?')}
        </h1>
        
        {/* Subtítulo */}
        <p className="coffee-subtitle">{t.coffee_page_subtitle}</p>
        
        {/* Descripción principal */}
        <p className="coffee-description">
          {getTranslation('coffee.description', 'Si disfrutas de este contenido y quieres apoyar su desarrollo, puedes invitarme a un café. Tu apoyo ayuda a mantener y mejorar este proyecto.')}
        </p>
        
        {/* Lista de beneficios */}
        <div className="coffee-benefits">
          <p className="coffee-benefits-title">{t.coffee_benefits_title}</p>
          <div className="coffee-benefits-list">
            <p>{t.coffee_benefit_1}</p>
            <p>{t.coffee_benefit_2}</p>
            <p>{t.coffee_benefit_3}</p>
            <p>{t.coffee_benefit_4}</p>
          </div>
        </div>
          {/* Call to action */}
        <p className="coffee-cta">{t.coffee_cta}</p>
        <p className="coffee-legend">{t.coffee_legend}</p>
        
        {/* PayPal Donation Button Form */}        <form action="https://www.paypal.com/donate" method="post" target="_top" style={{ marginTop: '20px', marginBottom: '20px' }}>
          <input type="hidden" name="hosted_button_id" value="SP8LLWVGW7EWC" />
          {/* Reemplazamos el input type="image" con un button para personalizarlo */}
          <button 
            type="submit" 
            name="submit" 
            className="custom-paypal-donate-button" // Clase para estilos personalizados
            title="PayPal - The safer, easier way to pay online!"
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '20px 40px',
              border: '3px solid #0056b3',
              borderRadius: '12px',
              fontSize: '1.4em',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'inline-block',
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              textDecoration: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none'
            }}
          >
            Donar con PayPal
          </button>
          <img 
            alt="" 
            src="https://www.paypal.com/en_ES/i/scr/pixel.gif" 
            width="1" 
            height="1" 
            style={{ border: '0' }} 
          />        </form>
          {/* Footer divertido */}
        <p className="coffee-footer">{t.coffee_footer}</p>
      </div>
      )}
    </div>
  );
};

export default CoffeePage; 