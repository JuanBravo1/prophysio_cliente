// CheckEmail.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/checkEmail.css'; // Asegúrate de crear este archivo CSS

const CheckEmail = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/'); // Redirige a la página principal
  };

  return (
    <div className="check-email-container">
      <div className="check-email-box">
        <h2>¡Verifica tu correo! 📧</h2>
        <p>
          Te hemos enviado un enlace de verificación a tu correo electrónico.
          Por favor, revisa tu bandeja de entrada (o tu carpeta de spam).
        </p>
        <p>Una vez verificada, podrás iniciar sesión.</p>
        <button className="back-home-btn" onClick={handleBackHome}>
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default CheckEmail;
