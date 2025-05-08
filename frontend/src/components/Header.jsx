import { FaSignInAlt, FaSignOutAlt, FaUser, FaSearch, FaUpload } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { useState } from 'react'
import logo from '../assets/logo_b2.png'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [searchTerm, setSearchTerm] = useState('')

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Search term:', searchTerm)
    // Conecta la lógica de búsqueda real aquí
  }

  return (
  <header className='header'>
    <section className='header-main'>
      <div className='logo'>
        <Link to='/'>
          <img src={logo} alt="Logo de la empresa MolaMazoGames" className='logo-img'/>
        </Link>
      </div>
      <form onSubmit={handleSearch}>
        <p className='search-input'>
          <input
            type="text"
            placeholder='Buscar assets...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit' className='search-btn'>
            <FaSearch />
          </button>
        </p>
      </form>
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
    </section>

    <nav className="tags-nav">
      <ul className="tags-list">
        <li className="tag-item">Aventura</li>
        <li className="tag-item">Acción</li>
        <li className="tag-item">Estrategia</li>
        <li className="tag-item">RPG</li>
        <li className="tag-item">Indie</li>
        <li className="tag-item">Simulación</li>
        <li className="tag-item">Terror</li>
        <li className="tag-item">Deportes</li>
      </ul>
    </nav>
  </header>
    
  )
}

export default Header
