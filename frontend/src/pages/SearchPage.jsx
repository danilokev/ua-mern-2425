import { useState, useEffect, useMemo } from 'react'
import { useLocation, Link } from 'react-router-dom'
import '../styles/index.css'
import { toast } from 'react-toastify'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function SearchPage() {
  const query = useQuery()
  const keyword = query.get('q')?.toLowerCase() || ''
  const tag = query.get('tag')?.toUpperCase() || ''

  const [assets, setAssets] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch('/api/assets')
        const data = await response.json()

        if (response.ok) {
          const validAssets = data
            .filter(asset => asset._id)
            .map(asset => ({
              id: asset._id,
              title: asset.title || 'Sin título',
              type: asset.type || 'Desconocido',
              description: asset.description || 'Sin descripción',
              images: asset.images && asset.images.length > 0
                ? asset.images.map(img => ({ url: img }))
                : (asset.image ? [{ url: asset.image }] : []),
              files: asset.files && asset.files.length > 0
                ? asset.files.map(f => ({ url: f, name: f.split('/').pop() }))
                : (asset.file ? [{ url: asset.file, name: asset.file.split('/').pop() }] : []),
              uploadDate: asset.uploadDate,
              author: {
                name: asset.user?.name || 'Desconocido',
                avatar: asset.user?.avatar || 'https://via.placeholder.com/50',
                joinDate: asset.user?.joinDate || 'Desconocido',
                assetsCount: asset.user?.assetsCount || 0,
                rating: asset.user?.rating || 0,
              }
            }))
          setAssets(validAssets)
        } else {
          toast.error(data.message || 'Error al cargar los assets')
        }
      } catch (err) {
        console.error(err)
        toast.error('Error al conectar con el servidor')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssets()
  }, [])

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesKeyword =
        keyword === '' ||
        asset.title.toLowerCase().includes(keyword) ||
        asset.description.toLowerCase().includes(keyword)
        const matchesTag =
          tag === '' ||
          asset.type.toUpperCase() === tag ||
          asset.title.toLowerCase().includes(tag.toLowerCase()) ||
          asset.description.toLowerCase().includes(tag.toLowerCase())
      
      return matchesKeyword && matchesTag
    })
  }, [assets, keyword, tag])

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
          ))}
        </div>
      )}
    </main>
  )
}

export default SearchPage
