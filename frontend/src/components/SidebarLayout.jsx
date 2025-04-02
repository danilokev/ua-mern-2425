import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function SidebarLayout() {
  return (
    <main className="sidebar-layout">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </main>
  );
}

export default SidebarLayout;