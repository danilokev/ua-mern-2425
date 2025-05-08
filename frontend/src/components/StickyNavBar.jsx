import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaPlus, FaUser, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import '../styles/index.css';

const StickyNavbar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <nav className="sticky-navbar">
      <ul>
        <li className={isActive('/')}>
          <Link to="/">
            <FaHome />
            <span className="nav-label">Inicio</span>
          </Link>
        </li>
        {user ? (
          <>
            <li className={isActive('/upload')}>
              <Link to="/upload">
                <FaPlus />
                <span className="nav-label">Subir Asset</span>
              </Link>
            </li>
            <li className={isActive('/profile')}>
              <Link to="/profile">
                <FaUser />
                <span className="nav-label">Mi Cuenta</span>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className={isActive('/login')}>
              <Link to="/login">
                <FaSignInAlt />
                <span className="nav-label">Iniciar Sesión</span>
              </Link>
            </li>
            <li className={isActive('/register')}>
              <Link to="/register">
                <FaUserPlus />
                <span className="nav-label">Registrarse</span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default StickyNavbar;
