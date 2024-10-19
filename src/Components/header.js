import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import LOGO from "../Resources/LOGO-OFICIAL.png";
import '../Styles/header.css';
import { FaUserCircle, FaUserShield, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Header = ({ isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú móvil
  const navigate = useNavigate();

  // Verificar si el usuario está logueado
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [setIsLoggedIn]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/login?form=login');
  };

  return (
    <>
      <header className="header-wrapper">
        <div className="logo-container">
          <img className="logo-image" src={LOGO} alt="PROphysio Logo" />
          <p>Fisioterapia</p>
          <span className="logo-title">PROphysio</span>
          <p>Huejutla</p>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? 'menu-open' : ''}`}>
          <ul>
            <li><a href="/" onClick={toggleMenu}>Inicio</a></li>
            <li><a href="#producto" onClick={toggleMenu}>Servicios</a></li>
            <li><a href="#precios" onClick={toggleMenu}>Blog</a></li>
            <li><a href="#contacto" onClick={toggleMenu}>Contacto</a></li>
            <li><a href="#agendar" onClick={() => navigate('/agendar')}>Agendar</a></li>
          </ul>
        </nav>

        <div className="auth-buttons">
          <FaUserCircle className="icon-profile" />
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <button className="btn-admin" onClick={() => navigate('/admin')}>
                  Admin
                </button>
              )}
              <button className="btn-logout" onClick={handleLogout}>Cerrar Sesión</button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => navigate('/login?form=login')}>Entrar</button>
              <button className="btn-register" onClick={() => navigate('/login?form=register')}>Empezar</button>
            </>
          )}

        </div>
        <div className="auth-buttons-mobile">
          <FaUserCircle className="icon-profile" />
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <FaUserShield className="icon-admin" onClick={() => navigate('/admin')} />
              )}
              <FaSignOutAlt className="icon-logout" onClick={handleLogout} />
            </>
          ) : (
            <>
              <FaSignInAlt className="icon-login" onClick={() => navigate('/login?form=login')} />
              <FaUserPlus className="icon-register" onClick={() => navigate('/login?form=register')} />
            </>
          )}
        </div>


        <div className="hamburger-menu" onClick={toggleMenu}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </div>
      </header>

      {/* Overlay for the menu when opened */}
      {isMenuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
    </>
  );
};

export default Header;
