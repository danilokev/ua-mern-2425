import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import { register, reset } from '../features/auth/authSlice';
import Spinner from '../components/Spinner';


function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)


  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    if (isSuccess || user) {
      navigate('/')
    }

    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])


  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Passwords do not match')
    } else {
      const userData = {
        name,
        email,
        password,
      }
      dispatch(register(userData))
    }
    console.log(formData);
  };
  if (isLoading) {
    return <Spinner />
  }
  return (
    <main className='min-h-screen'>
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
