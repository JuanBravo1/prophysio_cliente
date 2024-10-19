import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './Components/header';
import Home from './Components/home';
import Login from './Components/login';
import Footer from './Components/footer';
import VerifyMessage from './Components/validation';  // Ajusta la ruta según la estructura de tu proyecto
import CheckEmail from './Components/checkEmail'; // Importa el nuevo componente
import RequestPasswordReset from './Components/requestresetpassword'
import ResetPassword from './Components/resetpassword';
import CookieBanner from './Components/cookiebanner'; // Importar el banner
import PrivateRoute from './Components/error';

import AdminView from './Components/adminComponent/adminHome';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado de sesión
  const [isAdmin, setIsAdmin] = useState(false); // Estado para rol de admin
  const [activeForm, setActiveForm] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Revisar si el usuario está logueado y el rol guardado en localStorage
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsAuthenticated(!!token);
    if (token) {
      setIsLoggedIn(true);
      setIsAdmin(role === 'admin');
    }
  }, []);

  return (
    <Router>
      <Header
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        setIsLoggedIn={setIsLoggedIn}
        setIsAdmin={setIsAdmin}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
        <Route path="/verify/:token" element={<VerifyMessage />} /> {/* Ruta para la verificación */}
        <Route path="/check-email" element={<CheckEmail />} /> {/* Nueva Ruta */}
        <Route path="/request-password-reset" element={<RequestPasswordReset />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/perfil" element={<PrivateRoute isAuthenticated={isAuthenticated} />}></Route>

        {/* Rutas protegidas */}
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
          <Route path="/perfil" element={<Home />} /> {/* Cambia Home por tu componente de perfil */}
        </Route>

        {/* Ruta protegida para administradores */}

          <Route path="/admin" element={<AdminView />} /> {/* Ruta protegida para Admin */}
      
      </Routes>
      <CookieBanner /> {/* Mostrar el banner */}
      <Footer />
    </Router>
  );
};

export default App;
