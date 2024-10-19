import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import '../Styles/requestresetpassword.css'; // Importamos el nuevo estilo

const RequestPasswordReset = () => {
  const [correo, setCorreo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Correo enviado. Revisa tu bandeja de entrada. 📧');
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      toast.error('Hubo un error al enviar la solicitud.');
    }
  };

  return (
    <div className="request-reset-container">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <button type="submit">Enviar</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RequestPasswordReset;
