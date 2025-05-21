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
    const fetchLatestAssets = async () => {
      try {
        const response = await fetch('/api/assets/latest');
        const data = await response.json();

        if (response.ok) {
          const validAssets = data
            .filter(asset => asset._id)
            .map(asset => ({
              id: asset._id,
              title: asset.title || 'Sin título',
              type: asset.type || 'Desconocido',
              description: asset.description || 'Sin descripción',
              images: asset.images && asset.images.length > 0 ? asset.images.map(img => ({ url: img })) : (asset.image ? [{ url: asset.image }] : []),
              files: asset.files && asset.files.length > 0 ? asset.files.map(f => ({ url: f, name: f.split('/').pop() })) : (asset.file ? [{ url: asset.file, name: asset.file.split('/').pop() }] : []),
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
          toast.error(data.message || 'Error al cargar los assets más recientes');
        }
      } catch (error) {
        console.error(error);
        toast.error('Error en la conexión con el servicio para cargar assets recientes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestAssets();
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
                    <h3>{asset.title}</h3>
                    <span className="tag">{asset.type}</span>
                    <p className="author-name">Por: {asset.author.name}</p>
                  </article>
                </Link>
              ))
            ) : (
              <p>No hay assets disponibles recientemente.</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;