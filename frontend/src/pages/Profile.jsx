import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateUserProfile,
  changePassword,
  uploadAvatar
} from '../features/auth/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);

  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: { current: '', new: '', confirm: '' }
  });
  const [imagePreview, setImagePreview] = useState(
    user?.avatar
      ? `http://localhost:5000${user.avatar}`
      : '/images/default-avatar.jpg'
  );
  const [localError, setLocalError] = useState('');

  // Initialize form data from Redux state
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: { current: '', new: '', confirm: '' }
      });
      setImagePreview(
        user.avatar
          ? `http://localhost:5000${user.avatar}`
          : '/images/default-avatar.jpg'
      );
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    if (field.includes('password')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  // Handle profile updates (name/email)
  const handleProfileUpdate = async () => {
    try {
      await dispatch(updateUserProfile({
        name: formData.name,
        email: formData.email
      })).unwrap();

      setEditingField(null);
      setLocalError('');
    } catch (error) {
      setLocalError(error);
    }
  };

  // Handle password change
  const handlePasswordUpdate = async () => {
    if (formData.password.new !== formData.password.confirm) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    try {
      await dispatch(changePassword({
        currentPassword: formData.password.current,
        newPassword: formData.password.new
      })).unwrap();

      setFormData(prev => ({
        ...prev,
        password: { current: '', new: '', confirm: '' }
      }));
      setEditingField(null);
      setLocalError('');
    } catch (error) {
      setLocalError(error);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);

      await dispatch(uploadAvatar(file)).unwrap();
      setLocalError('');
    } catch (error) {
      setLocalError(error);
      setImagePreview(
        user?.avatar
          ? `http://localhost:5000${user.avatar}`
          : '/images/default-avatar.jpg'
      );
    }
  };

  // Error message component
  const ErrorMessage = ({ error }) => (
    error && <div className="error-message">{error}</div>
  );

  // Field edit button component
  const EditButton = ({ field }) => (
    <button
      className="btn-edit"
      onClick={() => setEditingField(field)}
      disabled={isLoading}
      type="button"
    >
      {`Cambiar ${field === 'name' ? 'nombre' : field === 'email' ? 'email' : 'contraseña'}`}
    </button>
  );

  return (
    <main className="profile-container">
      <section className="user-profile">
        <h1>Perfil de usuario</h1>

        <ErrorMessage error={localError || (isError && message)} />

        {/* Profile Image Section */}
        <div className="avatar-section">
          <div className="avatar-wrapper">
            <img
              src={imagePreview}
              alt="Avatar del usuario"
              className="user-avatar"
            />
            <label className="avatar-upload-label">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0])}
                disabled={isLoading}
              />
              {isLoading ? 'Subiendo...' : 'Cambiar avatar'}
            </label>
          </div>
        </div>

        {/* Profile Information */}
        <div className="profile-info">

          {/* Name Field */}
          <div className="profile-field">
            {editingField === 'name' ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isLoading}
                />
                <div className="form-actions">
                  <button
                    className="btn-save"
                    onClick={handleProfileUpdate}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => setEditingField(null)}
                    type="button"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="static-field">
                <label className='label-name'>Nombre de usuario:</label>
                <p>{formData.name}</p>
                <EditButton field="name" />
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="profile-field">
            {editingField === 'email' ? (
              <div className="edit-form">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLoading}
                />
                <div className="form-actions">
                  <button
                    className="btn-save"
                    onClick={handleProfileUpdate}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => setEditingField(null)}
                    type="button"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="static-field">
                <label className='label-name'>Correo electrónico:</label>
                <p>{formData.email}</p>
                <EditButton field="email" />
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="profile-field">
            {editingField === 'password' ? (
              <div className="edit-form">
                <input
                  type="password"
                  placeholder="Contraseña actual"
                  value={formData.password.current}
                  onChange={(e) => handleInputChange('password.current', e.target.value)}
                  disabled={isLoading}
                />
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={formData.password.new}
                  onChange={(e) => handleInputChange('password.new', e.target.value)}
                  disabled={isLoading}
                />
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={formData.password.confirm}
                  onChange={(e) => handleInputChange('password.confirm', e.target.value)}
                  disabled={isLoading}
                />
                <div className="form-actions">
                  <button
                    className="btn-save"
                    onClick={handlePasswordUpdate}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Actualizando...' : 'Cambiar contraseña'}
                  </button>
                  <button
                    className="btn-cancel"
                    onClick={() => setEditingField(null)}
                    type="button"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="static-field">
                <label className='label-name'>Contraseña:</label>
                <p>••••••••</p>
                <EditButton field="password" />
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;