// frontend/src/pages/SearchPage.jsx
import { useState, useEffect, useMemo } from 'react'
import { useLocation, Link } from 'react-router-dom'
import '../styles/index.css'
import { toast } from 'react-toastify'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function SearchPage() {
  const query = useQuery()
  const keyword = query.get('q')?.toLowerCase() || ''
  const tag = query.get('tag') || ''

  const [assets, setAssets] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        // Si hay tag, usamos la ruta pública para filtrar por tipo
        const endpoint = tag
          ? `/api/assets/search?tag=${encodeURIComponent(tag)}`
          : '/api/assets/latest'

        const res = await fetch(endpoint)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || `Error ${res.status}`)
        }

        const validAssets = data
          .filter(a => a._id)
          .map(a => {
            // montar mini-gallery
            const imgs = []
            if (a.image) imgs.push({ url: a.image })
            if (Array.isArray(a.images)) {
              a.images.forEach(u => {
                if (u !== a.image) imgs.push({ url: u })
              })
            }
            // montar lista de ficheros
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
              files,
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

        setAssets(validAssets)
      } catch (err) {
        console.error(err)
        toast.error(err.message || 'Error al cargar assets')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssets()
  }, [tag])

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesKeyword =
      !keyword ||
      asset.title.toLowerCase().includes(keyword) ||
      asset.description.toLowerCase().includes(keyword) ||
      asset.author.name.toLowerCase().includes(keyword)

      return matchesKeyword
    })
  }, [assets, keyword])

  return (
    <main className="dashboard">
      <h2>Resultados de búsqueda</h2>

      {isLoading ? (
        <p>Cargando...</p>
      ) : filteredAssets.length === 0 ? (
        <p>No se encontraron resultados para tu búsqueda.</p>
      ) : (
        <div className="assets-grid">
          {filteredAssets.map(asset => (
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
          ))}
        </div>
      )}
    </main>
  )
}
