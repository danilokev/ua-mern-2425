import { Sidebar, Menu, SubMenu, MenuItem } from 'react-pro-sidebar';
import { FaHome, FaBox, FaUpload, FaSignOutAlt, 
  FaHistory, FaUser, FaUserSlash, FaUniversalAccess } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function SidebarComponent() {
  return (
    <div className='sidebar-main'>
      <Sidebar className="sidebar-container">
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
            <MenuItem className='sidebar-menu__item' component={<Link to="/assetview" />}>
              <FaUpload /> Acceder al asset de prueba
            </MenuItem>
            <MenuItem className='sidebar-menu__item' component={<Link to="#" />}>
              <FaHistory /> Historial
            </MenuItem>
            <SubMenu label="Configuración" className='sidebar-submenu'>
              <MenuItem className='sidebar-menu__item' component={<Link to="/delete-account" />}>
                <FaUserSlash /> Darse de baja
              </MenuItem>
              <MenuItem className='sidebar-menu__item'>
                <FaUniversalAccess /> Accesibilidad
              </MenuItem>
            </SubMenu>
            <MenuItem className='sidebar-menu__item'>
              <FaSignOutAlt /> Cerrar Sesión
            </MenuItem>
          </Menu>
        </div>
      </Sidebar>
    </div>

  );
}

export default SidebarComponent;