import '../styles/Dashboard.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import cat3D from '../assets/3d-cat-image.jpg';
import cat2D from '../assets/2d-cat-image.jpg';
import catAddon from '../assets/others-cat-image.jpg';

function Dashboard() {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Necesitas iniciar sesión para ver los assets');
          return;
        }

        const response = await fetch('/api/assets', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (response.ok) {
          // Map database fields to expected structure
          const validAssets = data
            .filter(asset => asset._id)
            .map(asset => ({
              id: asset._id,
              title: asset.title,
              type: asset.type,
              description: asset.description,
              images: asset.image ? [{ url: asset.image }] : asset.images || [],
              files: asset.file ? [{ url: asset.file, name: asset.file.split('/').pop() }] : asset.files || [],
              uploadDate: asset.uploadDate,
              author: {
                name: asset.user?.name || 'Desconocido',
                avatar: asset.user?.avatar || 'https://via.placeholder.com/50',
                joinDate: asset.user?.joinDate || 'Desconocido',
                assetsCount: asset.user?.assetsCount || 0,
                rating: asset.user?.rating || 0
              }
            }));
          if (validAssets.length < data.length) {
            toast.warn('Algunos assets no tienen ID válido y no se mostrarán');
          }
          setAssets(validAssets);
        } else {
          toast.error(data.message || 'Error al cargar los assets');
        }
      } catch (error) {
        console.error(error);
        toast.error('Error en la conexión con el servicio');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  return (
    <main className="dashboard">
      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading">Categorías principales</h2>
        <div className="categories">
          <article className="category">
            <img
              src={cat3D}
              alt="Icono 3D"
            />
            <h3>3D</h3>
            <p>Explora modelos y escenas 3D</p>
          </article>

          <article className="category">
            <img src={cat2D} alt="Icono 2D" />
            <h3>2D</h3>
            <p>Descubre ilustraciones y sprites</p>
          </article>

          <article className="category">
            <img src={catAddon} alt="Icono Add-Ons" />
            <h3>Add-Ons</h3>
            <p>Complementos y extras para tu juego</p>
          </article>
        </div>
      </section>

      <section aria-labelledby="new-assets-heading">
        <h2 id="new-assets-heading" className="asset-title">¡Nuevos assets, nuevas aventuras!</h2>
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <div className="assets-grid">
            {assets.length > 0 ? (
              assets.map((asset) => (
                <Link key={asset.id} to={`/asset/${asset.id}`} className="asset-card-link">
                  <article className="asset-card">
                    <img
                      src={asset.images[0]?.url || 'https://via.placeholder.com/300'}
                      alt={`Imagen de ${asset.title}`}
                    />
                    <h3>{asset.title || 'Sin título'}</h3>
                    <span className="tag">{asset.type || 'Desconocido'}</span>
                  </article>
                </Link>
              ))
            ) : (
              <p>No hay assets disponibles</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;