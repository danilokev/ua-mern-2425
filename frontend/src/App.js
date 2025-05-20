import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import SidebarLayout from './components/SidebarLayout';
import StickyNavbar from './components/StickyNavBar';
import './styles/index.css';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AssetUpload from './pages/AssetUpload';
import Profile from './pages/Profile'
import AssetView from './pages/AssetView'
import DeleteAccount from './pages/DeleteAccount'
import MyAssets    from './pages/MyAssets'
import AssetDetail    from './pages/AssetDetail'


function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path="/assetview" element={<AssetView />} />
          
          <Route path='/' element={
            <PrivateRoute>
              <SidebarLayout />
            </PrivateRoute>
          }>
            <Route path="/my-assets" element={<MyAssets />} />
            <Route path="/assets/:id" element={<AssetDetail />} />
            <Route path='/upload' element={<AssetUpload />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/delete-account' element={<DeleteAccount />} />
            
          </Route>

          <Route path='*' element={<div>Página no encontrada</div>} />
        </Routes>

        {/* StickyNavbar añadido aquí para estar siempre visible */}
        <StickyNavbar />
        
        <Footer />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
