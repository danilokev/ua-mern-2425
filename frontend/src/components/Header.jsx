import { FaSignInAlt, FaSignOutAlt, FaUser, FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { useState } from 'react'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [searchTerm, setSearchTerm] = useState('');

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  const handleSearch = (evt) => {
    evt.preventDefault()
    console.log('Search term:', searchTerm)
  }

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>LOGO</Link>
      </div>
      <>
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
      </>
      <ul>
        {user ? (
          <li>
            <button className='btn-logout' onClick={onLogout}>
              <FaSignOutAlt /> Cerrar sesión
            </button>
          </li>
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
    </header>
  )
}

export default Header