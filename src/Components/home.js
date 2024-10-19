import React, { useState } from 'react';
import '../Styles/home.css';
import { useNavigate } from 'react-router-dom';
import image1 from '../Resources/Prophysio 77.jpg'

const Home = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="home-container">


      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}

      {/* Sección Telerehabilitación */}
      <section className="example-content">
        <div className="text-box">
          <h1>Recuperate con nosotros!!!</h1>
          <p>"No se aprende un movimiento, si no la sensacion de un movimiento"</p>
          <p>-Berta Bobath, 1978</p>
          <button className="btn-info">Informate</button>
        </div>
        <div className="image-box">
          <img src={image1} alt="Telerehabilitación" />
        </div>

      </section>
      <div className='lightBlue-container'>
        <h1 className='lightBlue-text'>La Fisioterapia con nosotros</h1>
        <p className='lightBlue-paragraph'>La fisioterapia es una disciplina médica que se enfoca en la rehabilitación de pacientes con lesiones, enfermedades o discapacidades físicas. A través de técnicas como ejercicios terapéuticos, masajes, electroterapia y terapia manual, los fisioterapeutas ayudan a recuperar la movilidad, la fuerza y la funcionalidad de las diferentes partes del cuerpo</p>
      </div>
      <section class="offerings-section">
        <div class="section-header">
          <h2>Lo que ofrecemos</h2>
          <p>Recupera tu movilidad, Reintegrate a tus actividades sin dolor</p>
        </div>

        <div class="offerings-grid">
          <div class="offering-item">
            <img src="https://via.placeholder.com/300x200" alt="Flujos que funcionan" />
            <h3>Fisioterapia Pediatrica</h3>
            <p>Párrafo. Haz clic aquí para agregar tu propio texto y editar. Aquí puedes contar tu historia y permitir que tus usuarios sepan más sobre ti.</p>
          </div>
          <div class="offering-item">
            <img src="https://via.placeholder.com/300x200" alt="Solución integral" />
            <h3>Fisioterapia ortopedica</h3>
            <p>Párrafo. Haz clic aquí para agregar tu propio texto y editar. Aquí puedes contar tu historia y permitir que tus usuarios sepan más sobre ti.</p>
          </div>
          <div class="offering-item">
            <img src="https://via.placeholder.com/300x200" alt="Asistencia integral al cliente" />
            <h3>Fisioterapia Oncologica</h3>
            <p>Párrafo. Haz clic aquí para agregar tu propio texto y editar. Aquí puedes contar tu historia y permitir que tus usuarios sepan más sobre ti.</p>
          </div>
          <div class="offering-item">
            <img src="https://via.placeholder.com/300x200" alt="Redes de automatización" />
            <h3>Fisioterapia Mecanica</h3>
            <p>Párrafo. Haz clic aquí para agregar tu propio texto y editar. Aquí puedes contar tu historia y permitir que tus usuarios sepan más sobre ti.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
