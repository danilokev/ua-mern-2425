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
import SearchPage    from './pages/SearchPage'
import AssetDetail    from './pages/AssetDetail'
import AccessibilityPage from './pages/Accessibility';

import ContactPage from './pages/Contact';
import DevsPage from './pages/Developers';
import TermsPage from './pages/Terms';
import PrivacyPage from './pages/Privacy';


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
          <Route path="/search" element={<SearchPage />} />
          
          <Route path='/' element={
            <PrivateRoute>
              <SidebarLayout />
            </PrivateRoute>
          }>
            <Route path='/my-assets' element={<MyAssets />} />
            <Route path='/assets/:id' element={<AssetDetail />} />
            <Route path='/asset/:id' element={<AssetView />} />
            <Route path='/upload' element={<AssetUpload />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/delete-account' element={<DeleteAccount />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />

            <Route path="/contact" element={<ContactPage />} />
            <Route path="/devs" element={<DevsPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />


          </Route>

          <Route path='*' element={<div>Página no encontrada</div>} />
        </Routes>

        <StickyNavbar />
        <Footer />
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;