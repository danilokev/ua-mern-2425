import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

function ThemeToggle() {
  // Estado para gestionar el tema, por defecto "dark"
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Cada vez que cambia el tema, actualizamos el atributo del documento y el localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Función para alternar entre modos
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    window.location.reload();
  };

  return (
    <button onClick={toggleTheme} className="theme-toggle">
      {theme === 'dark' ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle