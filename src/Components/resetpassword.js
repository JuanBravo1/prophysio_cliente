import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import '../Styles/resetpassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nuevaContraseña !== confirmarContraseña) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaContraseña }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setTimeout(() => navigate('/login'), 3000); // Redirigir al login
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      toast.error('Error al restablecer la contraseña.');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nueva Contraseña"
          value={nuevaContraseña}
          onChange={(e) => setNuevaContraseña(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmarContraseña}
          onChange={(e) => setConfirmarContraseña(e.target.value)}
          required
        />
        <button type="submit">Cambiar Contraseña</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;
