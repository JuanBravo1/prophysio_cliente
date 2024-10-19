import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../Styles/header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserShield,
  faSignOutAlt,
  faCalendarCheck,
  faUserPlus,
  faSignInAlt,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';

  const Header = ({ isLoggedIn, isAdmin, setIsLoggedIn, setIsAdmin }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para el menú móvil
    const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Establece isLoggedIn según el token
  }, [setIsLoggedIn]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Incluir cookies
      });

      if (response.ok) {
        toast.success('Sesión cerrada exitosamente. Redirigiendo...');

        setTimeout(() => {
          localStorage.removeItem('token'); // Eliminar token del almacenamiento local
          setIsLoggedIn(false); // Cambiar estado de autenticación
          setIsAdmin(false); // Cambiar estado de admin
          navigate('/login?form=login'); // Redirigir al login
        }, 3000); // 2 segundos
      } else {
        toast.error('Error al cerrar sesión.');
      }
    } catch (error) {
      toast.error('Error en la solicitud de cierre de sesión.');
    }
  };
  return (
    <>
      <div className="top-bar">
        <p>
          ¿Necesitas ayuda con tu rehabilitación física?
          <a href="tel:+2225081501"> ¡Llámanos al +52 (222) 508 1501!</a>
        </p>
      </div>

      <header className="home-header">
        <div className="logo-container" onClick={() => navigate('/')}>
          <img src="https://via.placeholder.com/150" alt="Logo" className="logo-image" />
          <div className="logo-text">
            Fisioterapia <span>PROphysio</span> Huejutla
          </div>
        </div>

        <nav className="menu">
          <ul>
            <li onClick={() => navigate('/about')}>La Fisioterapia</li>
            <li onClick={() => navigate('/about')}>Quiénes somos</li>
            <li onClick={() => navigate('/services')}>Servicios</li>
            <li onClick={() => navigate('/contact')}>Contáctanos</li>
          </ul>
        </nav>

        <div className="icons-container">
          {isLoggedIn && (
            <FontAwesomeIcon
              icon={faUserCircle}
              className="profile-icon"
              onClick={() => navigate('/perfil')}
            />
          )}

          <div className="hamburger" onClick={toggleMenu}>
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </div>

        <div className="actions">
          {isLoggedIn ? (
            <>
              {isAdmin ? (
                <button className="btn blue" onClick={() => navigate('/admin')}>
                <FontAwesomeIcon icon={faUserShield} className="icon-spacing" /> Vista de Admin
              </button>
              
              ) : (
                <button className="btn orange" onClick={() => navigate('/agendar')}>
                  <FontAwesomeIcon icon={faCalendarCheck} className="icon-spacing" /> Agendar Cita
                </button>
              )}
              <button className="btn white" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="icon-spacing" /> Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button className="btn blue" onClick={() => navigate('/login?form=register')}>
                <FontAwesomeIcon icon={faUserPlus} className="icon-spacing" /> Registrarse
              </button>
              <button className="btn white" onClick={() => navigate('/login?form=login')}>
                <FontAwesomeIcon icon={faSignInAlt} className="icon-spacing" /> Iniciar Sesión
              </button>
              <button className="btn orange" onClick={() => navigate('/agendar')}>
                <FontAwesomeIcon icon={faCalendarCheck} className="icon-spacing" /> Agendar Cita
              </button>
            </>
          )}
        </div>
      </header>

      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}

      <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleMenu}>×</button>
        <nav>
          <ul>
            <li onClick={() => { navigate('/about'); toggleMenu(); }}>La Fisioterapia</li>
            <li onClick={() => { navigate('/about'); toggleMenu(); }}>Quiénes somos</li>
            <li onClick={() => { navigate('/services'); toggleMenu(); }}>Servicios</li>
            <li onClick={() => { navigate('/contact'); toggleMenu(); }}>Contáctanos</li>
          </ul>

          <div className="actions-mobile">
            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  <button className="btn blue" onClick={() => navigate('/admin')}>
                    <FontAwesomeIcon icon={faUserShield} className="icon-spacing" /> Vista de Admin
                  </button>

                ) : (
                  <button className="btn orange" onClick={() => { navigate('/agendar'); toggleMenu(); }}>
                    <FontAwesomeIcon icon={faCalendarCheck} className="icon-spacing" />
                  </button>
                )}
                <button className="btn white" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="icon-spacing" />
                </button>
              </>
            ) : (
              <>
                <button className="btn blue" onClick={() => { navigate('/login?form=register'); toggleMenu(); }}>
                  <FontAwesomeIcon icon={faUserPlus} className="icon-spacing" />
                </button>
                <button className="btn white" onClick={() => { navigate('/login?form=login'); toggleMenu(); }}>
                  <FontAwesomeIcon icon={faSignInAlt} className="icon-spacing" />
                </button>
                <button className="btn orange" onClick={() => { navigate('/agendar'); toggleMenu(); }}>
                  <FontAwesomeIcon icon={faCalendarCheck} className="icon-spacing" />
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
