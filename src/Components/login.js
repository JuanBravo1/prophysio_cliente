import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/login.css';
import zxcvbn from 'zxcvbn';
import { translateFeedback, suggestionTranslations, translationMap } from '../Components/const'

const API_URL = process.env.REACT_APP_API_URL;

const LoginRegister = ({ setIsLoggedIn, setIsAdmin }) => {
  const [formState, setFormState] = useState('register');
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
    comentarios: '',
  });

  const [formValidations, setFormValidations] = useState({
    nombre: false,
    apellidos: false,
    correo: false,
  });
  const [passwordValidations, setPasswordValidations] = useState({
    longitud: false,
    mayuscula: false,
    numero: false,
    especial: false,
  });

  const [passwordScore, setPasswordScore] = useState(0); // Puntuación de fuerza de la contraseña
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState(''); //

  const navigate = useNavigate();
  const otpInputsRef = useRef([]);

  // Manejo de cambio de reCAPTCHA
  const handleCaptchaChange = (token) => setCaptchaToken(token);

  const validarNombreApellidos = (valor) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor);
  const validarCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  // Validar contraseña y usar zxcvbn
  const handlePasswordValidation = (password) => {
    const result = zxcvbn(password);
    setPasswordScore(result.score); // Usamos el score para mostrar la fuerza
    setPasswordValidations({
      longitud: password.length >= 8,
      mayuscula: /[A-Z]/.test(password),
      numero: /[0-9]/.test(password),
      especial: /[!@#$%^&*]/.test(password),
    });
  };
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, contraseña: newPassword });

    const result = zxcvbn(newPassword);
    setPasswordScore(result.score);

    const feedback = translateFeedback(result.feedback);
    setPasswordFeedback(feedback);
  };



  // Manejo de cambio en formularios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'contraseña') {
      handlePasswordValidation(value); // Validación de contraseña en tiempo real
    } else if (name === 'nombre' || name === 'apellidos') {
      setFormValidations({
        ...formValidations,
        [name]: validarNombreApellidos(value),
      });
    } else if (name === 'correo') {
      setFormValidations({
        ...formValidations,
        correo: validarCorreo(value),
      });
    }
  };
  const esContraseñaValida = () => {
    const { contraseña } = formData;

    // Validar que la contraseña cumpla con los criterios básicos
    const longitudValida = contraseña.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(contraseña);
    const tieneNumero = /[0-9]/.test(contraseña);
    const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(contraseña);

    // Asegurarse de que la puntuación de zxcvbn sea suficiente
    const esSuficientementeFuerte = passwordScore >= 2; // Score de 0 a 4 (2 es media seguridad)

    // Si todos los criterios son verdaderos, la contraseña es válida
    return longitudValida && tieneMayuscula && tieneNumero && tieneEspecial && esSuficientementeFuerte;
  };

  // Validar formulario de registro
  const validateRegisterForm = () => {
    const { contraseña, confirmarContraseña } = formData;
    if (contraseña !== confirmarContraseña) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }
    if (!captchaToken) {
      toast.error('Por favor, verifica que no eres un robot');
      return false;
    }
    return esContraseñaValida();
  };

  // Manejo de cambio de reCAPTCHA


  // Validar formulario de registro

  const validarContraseña = (contraseña) => {
    setPasswordValidations({
      longitud: contraseña.length >= 8,
      mayuscula: /[A-Z]/.test(contraseña),
      numero: /[0-9]/.test(contraseña),
      especial: /[^\w\s]/.test(contraseña)
    });
  };

  // Enviar solicitud de registro


  // Enviar solicitud de login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Activar el estado de carga

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: formData.correo, contraseña: formData.contraseña }),
      });

      const result = await response.json();

      if (response.status === 403) {
        // La cuenta está bloqueada, mostrar mensaje con tiempo restante
        toast.error(result.message);
      } else if (response.status === 401) {
        // Contraseña incorrecta, mostrar error
        toast.error('Contraseña incorrecta. Inténtalo de nuevo.');
      } else if (response.ok) {
        // Inicio de sesión exitoso, pasar al formulario OTP
        toast.success('OTP enviado. Por favor, verifica tu correo.');
        switchForm('otp'); // Cambiar al formulario OTP
      } else {
        // Otro error no manejado
        toast.error(result.message || 'Error desconocido. Inténtalo más tarde.');
      }
    } catch (error) {
      toast.error('Error en el inicio de sesión. Inténtelo de nuevo.');
    } finally {
      setIsSubmitting(false); // Desactivar el estado de carga
    }
  };
  const location = useLocation(); // Hook para leer los parámetros de la URL
  // Manejar cambios en los inputs del OTP
  useEffect(() => {
    // Enfocar el primer input de OTP automáticamente
    const queryParams = new URLSearchParams(location.search); // Lee los parámetros de la URL
    const formType = queryParams.get('form') || 'login'; // Obtiene el valor de "form" o usa "login" por defecto
    setFormState(formType); // Cambia el estado de formState
  }, [location.search]); // Ejecuta cuando cambia la URL


  // Solo permitir números en los campos de OTP
  const handleOtpChange = (value, index) => {
    if (/^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        otpInputsRef.current[index + 1].focus();
      }
    }
  }

  // Verificar OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: formData.correo, otp: otp.join('') }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('OTP correcto. Redirigiendo...');
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
        setIsLoggedIn(true);
        setIsAdmin(result.role === 'admin');

        setTimeout(() => {
          navigate(result.role === 'admin' ? '/admin' : '/');
        }, 3000);
      } else {
        toast.error('OTP incorrecto. Inténtalo de nuevo.');
      }
    } catch (error) {
      toast.error('Error al verificar OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };


  // Enviar solicitud de registro
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateRegisterForm()) return;

    try {
      const { confirmarContraseña, ...dataToSend } = formData;
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...dataToSend,
          captchaToken: captchaToken,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('¡Registro exitoso! Verifica tu correo.');
        navigate('/check-email');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Error en el registro. Inténtalo de nuevo.');
    }
  };

  // Cambiar entre formularios
  const switchForm = (form) => setFormState(form);

  return (
    <div className={`login-register-container ${formState}`}>
      <div className="form-box">
        <div className="form-header">
          <button onClick={() => switchForm('login')} className={formState === 'login' ? 'active' : ''}>
            Iniciar sesión
          </button>
          <button onClick={() => switchForm('register')} className={formState === 'register' ? 'active' : ''}>
            Registrarse
          </button>
        </div>

        <div className="form-content">
          {formState === 'login' && (
            <form onSubmit={handleLogin} className="login-form">
              <h2>Iniciar sesión</h2>

              <div className="form-group">
                <label>Correo</label>
                <input
                  type="email"
                  name="correo"
                  placeholder="Correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  name="contraseña"
                  placeholder="Contraseña"
                  value={formData.contraseña}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="btn submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Iniciando sesión...' : 'Entrar'}
              </button>

              <div className="forgot-password">
                <Link to="/request-password-reset">¿Olvidaste tu contraseña?</Link>
              </div>
            </form>
          )}

          {formState === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="otp-form active">
              <h2>Verificar Codigo</h2>
              <div className="otp-inputs">
                {otp.map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={otp[index]}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    ref={(el) => (otpInputsRef.current[index] = el)}
                    required
                  />
                ))}
              </div>
              <button className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Verificando...' : 'Verificar Codigo'}
              </button>
            </form>

          )}
          <div className="form-content">
            {formState === 'register' && (
              <form onSubmit={handleRegister} className="register-form">
                <h2>Registrarse</h2>
                <div className="form-group-inline">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                    {!formValidations.nombre && formData.nombre && (
                      <p className="error-text">Nombre no válido (solo letras y espacios).</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Apellidos</label>
                    <input
                      type="text"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Correo</label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group-inline">
                  <div className="form-group">
                    <label>Contraseña</label>
                    <input
                      type="password"
                      name="contraseña"
                      value={formData.contraseña}
                      onChange={handlePasswordChange}
                      required
                      onFocus={() => setShowPasswordTooltip(true)}
                      onBlur={() => setShowPasswordTooltip(false)}
                    />
                    {showPasswordTooltip && (
                      <div className="password-tooltip">
                        <p className={passwordValidations.longitud ? 'valid' : 'invalid'}>
                          {passwordValidations.longitud ? '✔' : '✖'} Mínimo 8 caracteres
                        </p>
                        <p className={passwordValidations.mayuscula ? 'valid' : 'invalid'}>
                          {passwordValidations.mayuscula ? '✔' : '✖'} Al menos una letra mayúscula
                        </p>
                        <p className={passwordValidations.numero ? 'valid' : 'invalid'}>
                          {passwordValidations.numero ? '✔' : '✖'} Al menos un número
                        </p>
                        <p className={passwordValidations.especial ? 'valid' : 'invalid'}>
                          {passwordValidations.especial ? '✔' : '✖'} Al menos un carácter especial (!@#$%^&*)
                        </p>
                        <div className="password-strength-bar">


                          {/* Mostrar sugerencias si las hay */}

                          <div className={`strength-${passwordScore}`} />
                          <p className='tooltip-text'>
                            {passwordScore === 0 && 'Contraseña Muy débil'}
                            {passwordScore === 1 && 'Contraseña Débil'}
                            {passwordScore === 2 && 'Contraseña Media'}
                            {passwordScore === 3 && 'Contraseña Fuerte'}
                            {passwordScore === 4 && 'Contraseña Muy fuerte'}
                          </p>
                          {passwordFeedback && <p className="password-feedback">{passwordFeedback}</p>}
                        </div>
                      </div>
                    )}

                    {/* Barra de progreso para la contraseña */}

                  </div>

                  <div className="form-group">
                    <label>Confirme su contraseña</label>
                    <input
                      type="password"
                      name="confirmarContraseña"
                      value={formData.confirmarContraseña}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Comentarios</label>
                  <textarea
                    name="comentarios"
                    placeholder="Algunos comentarios acerca de usted..."
                    value={formData.comentarios}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {/* Añadir reCAPTCHA aquí */}
                <div className='recaptcha-content'>
                  <ReCAPTCHA
                    sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}  // Reemplaza con tu clave de sitio
                    onChange={handleCaptchaChange}
                  />
                </div>

                <button className="btn submit-btn">Registrarse</button>
              </form>
            )}
          </div>
        </div>

        <ToastContainer />
      </div>
      <div className="image-container">
        <img
          src={formState === 'login'
            ? 'https://via.placeholder.com/400x300?text=Login'
            : 'https://via.placeholder.com/400x300?text=Register'}
          alt="Formulario"
        />
      </div>
    </div>
  );
};

export default LoginRegister;
