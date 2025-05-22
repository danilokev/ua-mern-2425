// frontend/src/pages/Dashboard.jsx
import '../styles/Dashboard.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import cat3D from '../assets/3d-cat-image.jpg'
import cat2D from '../assets/2d-cat-image.jpg'
import catAddon from '../assets/others-cat-image.jpg'

export default function Dashboard() {
  const [assets, setAssets] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLatestAssets = async () => {
      try {
        // Si tu endpoint /latest fuera protegido, envía token:
        const token = JSON.parse(localStorage.getItem('user'))?.token
        const headers = token
          ? { 'Authorization': `Bearer ${token}` }
          : {}

        const res = await fetch('/api/assets/latest', { headers })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || `Error ${res.status}`)
        }

        // Mapeamos para la UI
        const validAssets = data
          .filter(a => a._id)
          .map(a => {
            // construimos mini-gallery de imágenes
            const imgs = []
            if (a.image) imgs.push({ url: a.image })
            if (Array.isArray(a.images)) {
              a.images.forEach(u => {
                if (u !== a.image) imgs.push({ url: u })
              })
            }

            // construimos lista de archivos
            const files = []
            if (a.file) files.push({ url: a.file, name: a.file.split('/').pop() })
            if (Array.isArray(a.files)) {
              a.files.forEach(u => {
                if (u !== a.file) files.push({ url: u, name: u.split('/').pop() })
              })
            }

            return {
              id: a._id,
              title: a.title || 'Sin título',
              type: a.type || 'Desconocido',
              description: a.description || 'Sin descripción',
              images: imgs,
              files: files,
              uploadDate: a.uploadDate,
              author: {
                name: a.user?.name || 'Desconocido',
                avatar: a.user?.avatar || 'https://via.placeholder.com/50',
                joinDate: a.user?.joinDate || 'Desconocido',
                assetsCount: a.user?.assetsCount || 0,
                rating: a.user?.rating || 0
              }
            }
          })

        if (validAssets.length < data.length) {
          toast.warn('Algunos assets no tienen ID válido y no se mostrarán')
        }

        setAssets(validAssets)
      } catch (err) {
        console.error(err)
        toast.error(err.message || 'Error al cargar los assets más recientes')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestAssets()
  }, [])

  return (
    <main className="dashboard">
      <section aria-labelledby="categories-heading">
        <h2 id="categories-heading">Categorías principales</h2>
        <div className="categories">
          <Link to="/search?tag=3D" className="category">
            <article>
              <img src={cat3D} alt="Icono 3D" />
              <h3>3D</h3>
              <p>Explora modelos y escenas 3D</p>
            </article>
          </Link>
          <Link to="/search?tag=2D" className="category">
            <article>
              <img src={cat2D} alt="Icono 2D" />
              <h3>2D</h3>
              <p>Descubre ilustraciones y sprites</p>
            </article>
          </Link>
          <Link to="/search?tag=Add-Ons" className="category">
            <article>
              <img src={catAddon} alt="Icono Add-Ons" />
              <h3>Add-Ons</h3>
              <p>Complementos y extras para tu juego</p>
            </article>
          </Link>
        </div>
      </section>

      <section aria-labelledby="new-assets-heading">
        <h2 id="new-assets-heading" className="asset-title">
          ¡Nuevos assets, nuevas aventuras!
        </h2>

        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          <div className="assets-grid">
            {assets.length > 0 ? (
              assets.map(asset => (
                <Link
                  key={asset.id}
                  to={`/asset/${asset.id}`}
                  className="asset-card-link"
                >
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
  )
}
