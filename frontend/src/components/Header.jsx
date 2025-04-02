import { FaSignInAlt, FaSignOutAlt, FaUser, FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { useState } from 'react'
import logo from '../assets/logo_b.png' // Asegúrate de que logo.png esté en src/

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
    // Puedes conectar esto con lógica de búsqueda real más adelante
  }

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>
          <img src={logo} alt="MolamazoGames" className='logo-img' />
        </Link>
      </div>

      <form onSubmit={handleSearch} className='search-bar'>
        <input
          type="search"
          placeholder="Buscar assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <FaSearch />
        </button>
      </form>

      <ul>
        {user ? (
          <li>
            <button className='btn' onClick={onLogout}>
              <FaSignOutAlt /> Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link to='/login'>
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link to='/register'>
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  )
}

export default Header
