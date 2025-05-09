// frontend/src/pages/MyAssets.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBox } from 'react-icons/fa'
import '../styles/myAssets.css'

export default function MyAssets() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res  = await fetch('/api/assets')
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const data = await res.json()
        setAssets(data)
      } catch (err) {
        console.error(err)
        setError('No se han podido cargar tus assets')
      } finally {
        setLoading(false)
      }
    }
    fetchAssets()
  }, [])

  if (loading) return <p>Cargando tus assets…</p>
  if (error)   return <p className="error">{error}</p>

  // función helper para elegir la URL de la imagen
  const getImageUrl = asset => {
    // 1) primer intento: campo image (tu enlace directo de Dropbox)
    if (asset.image) return asset.image
    // 2) segundo intento: si tienes un array images
    if (asset.images && asset.images.length > 0) {
      return asset.images[0]
    }
    // 3) fallback: imagen por defecto de tu carpeta estática
    return '/images/default-avatar.jpg'
  }

  return (
    <div className="my-assets container">
      <h2><FaBox /> Mis Assets</h2>
      {assets.length === 0
        ? <p>No tienes ningún asset aún.</p>
        : (
          <div className="assets-grid">
            {assets.map(asset => (
              <div key={asset._id} className="asset-card">
                <img 
                  src={getImageUrl(asset)}
                  alt={asset.title}
                  className="asset-card__img"
                  onError={e => {
                    // por si algo falla en la URL: recae al default
                    e.currentTarget.src = '/images/default-avatar.jpg'
                  }}
                />
                <div className="asset-card__body">
                  <h3>{asset.title}</h3>
                  <p className="asset-card__type">{asset.type}</p>
                  <Link to={`/assets/${asset._id}`} className="asset-card__btn">
                    Ver detalle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}
