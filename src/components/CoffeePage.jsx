import React, { useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import MaterialCoffeePage from './MaterialCoffeePage';

const CoffeePage = () => {
  const { t } = useLanguage();
  
  // Inicializar PayPal cuando el componente se monte
  useEffect(() => {
    console.log('CoffeePage montado, inicializando PayPal...');
    
    // Dar tiempo a que el DOM se actualice
    const timer = setTimeout(() => {
      if (window.initializePayPal) {
        window.initializePayPal();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      {/* Componente Material UI solo para móviles */}
      <MaterialCoffeePage />
      
      {/* Página clásica solo para desktop */}
      <div className="coffee-page desktop-only">
        {/* Icono de café animado */}
        <div className="coffee-icon">☕</div>
        
        {/* Título principal */}
        <h1 className="coffee-title">{t.coffee_page_title}</h1>
        
        {/* Subtítulo */}
        <p className="coffee-subtitle">{t.coffee_page_subtitle}</p>
        
        {/* Descripción principal */}
        <p className="coffee-description">
          {t.coffee_description}
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
        
        {/* Input de cantidad */}
        <div className="amount-input-wrapper">
          <label htmlFor="donation-amount" className="amount-label">
            {t.amount_label || 'Cantidad (EUR)'}
          </label>
          <input 
            type="number" 
            id="donation-amount"
            name="amount"
            min="1" 
            max="100" 
            defaultValue="5"
            className="amount-input"
            placeholder="5"
          />
        </div>
        
        {/* Contenedor del botón de PayPal */}
        <div className="paypal-button-container" id="paypal-button-wrapper">
          <div id="paypal-container-MRSQEQV646EPA"></div>
        </div>
        
        {/* Footer divertido */}
        <p className="coffee-footer">{t.coffee_footer}</p>
      </div>
    </>
  );
};

export default CoffeePage;
