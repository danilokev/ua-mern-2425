import { FaTwitter, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import logo from '../assets/logo_b.png' 
import '../styles/Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      {/* Bloque superior con 4 columnas */}
      <div className="footer-top">
        {/* Columna 1: logo + redes + dirección */}
        <div className="footer-col footer-col--logo">
          <img src={logo} alt="MolamazoGames" className="footer-logo" />
          <div className="footer-social">
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
            <a href="#"><FaGithub /></a>
          </div>
          <address className="footer-address">
            Carretera San Vicente del Raspeig s/n<br/>
            03690 San Vicente del Raspeig – Alicante
          </address>
        </div>

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

      {/* Línea separadora */}
      <div className="footer-divider" />

      {/* Pie de página */}
      <div className="footer-bottom">
        <p>&copy; 2025 MMG. Todos los derechos reservados</p>
      </div>
    </footer>
  )
}
