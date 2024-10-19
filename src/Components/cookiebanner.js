// src/components/CookieBanner.js
import React, { useState, useEffect } from 'react';
import '../Styles/cookiebanner.css';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const acceptedCookies = localStorage.getItem('cookiesAccepted');
    if (!acceptedCookies) {
      setShowBanner(true); // Mostrar banner si no se aceptaron las cookies
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true'); // Guardar la decisión en localStorage
    setShowBanner(false); // Ocultar banner con transición
  };

  return (
    showBanner && (
      <div className="cookie-banner">
        <p>
          Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. Al continuar, aceptas nuestro{' '}
          <a className='link-cookies' href="/politica-cookies" target="_blank" rel="noopener noreferrer">
            uso de cookies.
          </a>
        </p>
        <button onClick={handleAccept} className="btn-accept">
          Aceptar
        </button>
      </div>
    )
  );
};

export default CookieBanner;
