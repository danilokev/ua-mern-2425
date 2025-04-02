import { useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar'

function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <main className="profile-container">
      <section className="user-profile">
        <h1>Perfil de usuario</h1>
        <div className="user-profile__group">
          <img src="https://picsum.photos/200" alt="Foto de perfil del usuario" className="user-profile__image" />
        </div>
        <div className="user-profile__info">
          <h2>{user?.name || 'Usuario no encontrado'}</h2>
          <p>{user?.email || 'Correo electrónico no encontrado'}</p>
        </div>
      </section>
    </main>
  );
}

export default Profile;