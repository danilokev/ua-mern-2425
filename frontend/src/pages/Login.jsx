import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

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

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <main className='min-h-screen main-container'>
      <div className='form-container'>
        <section className='heading'>
          <h1>Iniciar sesión</h1>
          <p>Accede a tu cuenta y gestiona los assets de tus proyectos de videojuegos</p>
        </section>
        <section className='form'>
          <form onSubmit={onSubmit}>
            <div className='form-group'>
              <label htmlFor="email">Correo electrónico:</label>
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
              <label htmlFor="password">Contraseña:</label>
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
              <button type='submit' className='btn btn-block'>Iniciar sesión</button>
            </div>
          </form>
          <p className='form-footer'>
            ¿No tienes una cuenta? <Link to='/register'>Regístrate</Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default Login;
