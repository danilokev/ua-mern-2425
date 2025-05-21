import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/myAssets.css'

export default function MyAssets() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        // 1) Lee el token de localStorage
        const token = localStorage.getItem('token')
        if (!token) {
          throw new Error('Usuario no autenticado')
        }

        // 2) Incluye la cabecera Authorization
        const res = await fetch('/api/assets', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('No autorizado, por favor inicia sesión de nuevo')
          }
          throw new Error(`Error ${res.status}`)
        }

        const data = await res.json()
        setAssets(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  const getImageUrl = asset => {
    if (asset.image) {
      if (asset.image.includes('cloudinary.com')) {
        return asset.image.replace('/upload/', '/upload/f_auto,q_auto,w_300/')
      }
      return asset.image
    }

    // Si hay imágenes en el array, usamos la primera
    if (asset.images && asset.images.length > 0) {
      if (asset.images[0].includes('cloudinary.com')) {
        return asset.images[0].replace('/upload/', '/upload/f_auto,q_auto,w_300/')
      }
      return asset.images[0]
    }

    // Imagen por defecto
    return '/images/default-avatar.jpg'
  }

  if (loading) return <p>Cargando tus assets…</p>
  if (error) return <p className="error">{error}</p>

  return (
    <div className="my-assets">
      <h1>Mis Assets</h1>
      {assets.length === 0
        ? (
          <>
            <p>No tienes ningún asset aún.</p>
            <Link to="/upload" className='btn btn-asset'>
              Subir nuevo asset
            </Link>
          </>
        ) : (
          <div className="container-assets">
            {assets.map(asset => (
              <div key={asset._id} className="assets-card">
                <img
                  src={getImageUrl(asset)}
                  alt={asset.title}
                  className="asset-card__img"
                  onError={e => {
                    e.currentTarget.src = '/images/default-avatar.jpg'
                  }}
                />
                <div className="asset-card__body">
                  <h3>{asset.title}</h3>
                  <p className="asset-upload-date">
                    {new Date(asset.uploadDate).toLocaleDateString()}
                  </p>
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
