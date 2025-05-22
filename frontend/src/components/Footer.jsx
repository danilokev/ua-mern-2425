import { FaTwitter, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';

import logo from '../assets/logo_b.png' 
import logon from '../assets/logo_n.png' 
import '../styles/Footer.css'
import ThemeToggle from './ThemeToggle';

export default function Footer() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const handleStorageChange = () => {
      const currentTheme = localStorage.getItem('theme') || 'dark';
      setTheme(currentTheme);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <footer className="footer">
      <ThemeToggle />

      {/* Bloque superior con 4 columnas */}
      <div className="footer-top">
        {/* Columna 1: logo + redes + dirección */}
        <div className="footer-col footer-col--logo">
          <img src={theme === 'dark' ? logo : logon} alt="MolamazoGames" className="footer-logo" />
          <div className="footer-social">
            <a href="https://x.com/"><FaTwitter /></a>
            <a href="https://www.instagram.com/"><FaInstagram /></a>
            <a href="https://www.youtube.com/"><FaYoutube /></a>
            <a href="https://github.com/danilokev"><FaGithub /></a>
          </div>
          <address className="footer-address">
            Carretera San Vicente del Raspeig s/n<br/>
            03690 San Vicente del Raspeig – Alicante
          </address>
        </div>
        <div className="footer-col-info">
          {/* Columna 2: General */}
          <div className="footer-col">
            <h4 className="footer-heading">General</h4>
            <ul>
              <li><Link to="/contact">Contacto</Link></li>
              <li><Link to="/devs">Desarrolladores</Link></li>
              <li><Link to="/register">Regístrate</Link></li>
            </ul>
          </div>

          {/* Columna 3: Navegar por MMG */}
          <div className="footer-col">
            <h4 className="footer-heading">Navegar por MMG</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/accessibility">Accesibilidad</Link></li>
            </ul>
          </div>

          {/* Columna 4: Legal */}
          <div className="footer-col">
            <h4 className="footer-heading">Legal</h4>
            <ul>
              <li><Link to="/terms">Términos</Link></li>
              <li><Link to="/privacy">Privacidad</Link></li>
            </ul>
          </div>
        </div>
      </div>
      {/* Línea separadora */}
      <div className="footer-divider" />

      {/* Pie de página */}
      <div className="footer-bottom">
        <p>&copy; 2025 MMG. Todos los derechos reservados</p>
      </div>
    </footer>
  )
}
