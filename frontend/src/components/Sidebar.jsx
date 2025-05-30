import { useState } from 'react';
import { Sidebar, Menu, SubMenu, MenuItem } from 'react-pro-sidebar';
import { FaHome, FaBox, FaUpload, FaSignOutAlt, FaHistory, FaUser, FaUserSlash, FaUniversalAccess, FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

function SidebarComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <div className={`sidebar-main ${isOpen ? 'open' : 'closed'}`} >
      <button className='sidebar-toggle' onClick={toggleSidebar}>
        <FaBars />
      </button>
      <Sidebar className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
        <p>Menú Principal</p>
        <div>
          <Menu className='sidebar-menu'>
            <MenuItem className='sidebar-menu__item' component={<Link to="/" />}>
              <FaHome /> Inicio
            </MenuItem>
            <MenuItem className='sidebar-menu__item' component={<Link to="/profile" />}>
              <FaUser /> Perfil
            </MenuItem>
            <MenuItem className='sidebar-menu__item' component={<Link to="/my-assets" />}>
              <FaBox /> Mis Assets
            </MenuItem>
            <MenuItem className='sidebar-menu__item' component={<Link to="/upload" />}>
              <FaUpload /> Subir Asset
            </MenuItem>
            <SubMenu label="Configuración" className='sidebar-submenu'>
              <MenuItem className='sidebar-menu__item' component={<Link to="/delete-account" />}>
                <FaUserSlash /> Darse de baja
              </MenuItem>
              <MenuItem className='sidebar-menu__item' component={<Link to="/accessibility" />}>
                <FaUniversalAccess /> Accesibilidad
              </MenuItem>
            </SubMenu>
            <MenuItem
              className='sidebar-menu__item'
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Cerrar Sesión
            </MenuItem>
          </Menu>
        </div>
      </Sidebar>
    </div>
  );
}

export default SidebarComponent;