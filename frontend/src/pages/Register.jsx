import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [avatar, setAvatar] = useState(null);

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setAvatar(file);
    } else {
      toast.error('Por favor, selecciona una imagen válida');
      setAvatar(null);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (!avatar) {
      toast.error('Por favor, selecciona una foto de perfil');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('email', email);
    formDataToSend.append('password', password);
    formDataToSend.append('avatar', avatar);

    dispatch(register(formDataToSend));
    console.log('Form Data:', { name, email, password, avatar });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <main className='min-h-screen main-container'>
      <div className='form-container'>
        <section className='heading'>
          <h1>Crear cuenta</h1>
          <p>Por favor, completa todos los campos obligatorios marcados con un <abbr title="obligatorio">*</abbr> para crear tu cuenta.</p>
        </section>
        <section className='form'>
          <form onSubmit={onSubmit}>
            <div className='form-group'>
              <label htmlFor="name">Nombre:</label>
              <input
                type='text'
                className='form-control'
                id='name'
                name='name'
                value={name}
                onChange={onChange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor="email">Correo electrónico: <abbr title="obligatorio">*</abbr></label>
              <input
                type='email'
                className='form-control'
                id='email'
                name='email'
                value={email}
                onChange={onChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor="password">Contraseña: <abbr title="obligatorio">*</abbr></label>
              <input
                type='password'
                className='form-control'
                id='password'
                name='password'
                value={password}
                onChange={onChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor="password2">Repetir contraseña: <abbr title="obligatorio">*</abbr></label>
              <input
                type='password'
                className='form-control'
                id='password2'
                name='password2'
                value={password2}
                onChange={onChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor="avatar">Foto de perfil: <abbr title="obligatorio">*</abbr></label>
              <input
                type='file'
                className='form-control'
                id='avatar'
                name='avatar'
                accept='image/*'
                onChange={onFileChange}
                required
              />
            </div>
            <div className='form-group'>
              <button type='submit' className='btn btn-block'>Crear cuenta</button>
            </div>
          </form>
          <p className='form-footer'>
            ¿Ya tienes una cuenta? <Link to='/login'>Inicia sesión</Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default Register;