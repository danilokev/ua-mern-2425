import { FaSignInAlt, FaSignOutAlt, FaUser, FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import logoWhite from '../assets/logo_b2.png';
import logoBlack from '../assets/logo_n2.png';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const handleSearch = (e) => {
    e.preventDefault()
    const trimmed = searchTerm.trim()
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  // Escuchamos cambios en el localStorage para sincronizar el tema
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
    <header className='header'>
      <section className='header-main'>
        <ThemeToggle />

        <div className='logo'>
          <Link to='/'>
            <img
              src={theme === 'dark' ? logoWhite : logoBlack}
              alt='Logo de la empresa MolaMazoGames'
              className='logo-img'
            />
          </Link>
        </div>

        <form onSubmit={handleSearch}>
          <p className='search-input'>
            <input
              type='text'
              placeholder='Buscar assets...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type='submit' className='search-btn'>
              <FaSearch />
            </button>
          </p>
        </form>

        <div className='header-actions'>
          <ul className='header-buttons'>
            {user ? (
              <>
                <li>
                  <Link to='/profile'>
                    <FaUser /> Mi perfil
                  </Link>
                </li>
                <li>
                  <button className='btn-logout' onClick={onLogout}>
                    <FaSignOutAlt /> Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to='/login'>
                    <FaSignInAlt /> Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link to='/register'>
                    <FaUser /> Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </section>

      {/* Lista de etiquetas */}
      <nav className='tag-nav'>
        <ul className='tag-list'>
          {['Pixel Art', 'Isométrico',
      'UI', 'Iconos', 'Audio', 'Música',
      'VFX', 'Animaciones', 'Fondos', 'Tilesets'].map((tag) => (
            <li key={tag}>
              <Link to={`/search?tag=${encodeURIComponent(tag)}`} className='tag-link'>
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

    </header>

  )
}

export default Header;
