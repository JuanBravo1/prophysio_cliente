import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../Styles/verify.css';

const VerifyMessage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verificando tu cuenta...');
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    

    const verifyAccount = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/verify/${token}`);
        const result = await response.json();

        if (response.ok) {
          setMessage('¡Cuenta verificada exitosamente! Ahora puedes iniciar sesión.');
          setIsVerified(true);
          setTimeout(() => navigate('/login'), 3000);
        } else {
          setMessage(`Error: ${result.message}`);
          setIsVerified(false);
        }
      } catch (error) {
        console.error('Error en la verificación:', error);
        setMessage('Hubo un error al verificar tu cuenta. Inténtalo más tarde.');
        setIsVerified(false);
      }
    };

    verifyAccount();
  }, [token, navigate]);

  return (
    <div className={`verify-container ${isVerified ? 'success' : 'error'}`}>
      <h2>{message}</h2>
      {isVerified === false && (
        <button onClick={() => navigate('/resend-verification')}>
          Reenviar correo de verificación
        </button>
      )}
      {isVerified === null && <div className="spinner"></div>}
    </div>
  );
};

export default VerifyMessage;
