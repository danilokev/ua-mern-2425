import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaArrowLeft, FaFile, FaImage } from 'react-icons/fa'
import '../styles/assetDetail.css'

export default function AssetDetail() {
  const { id } = useParams()
  const [asset, setAsset] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await fetch(`/api/assets/${id}`)
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const data = await res.json()
        setAsset(data)
      } catch (err) {
        console.error(err)
        setError('No se pudo cargar el detalle del asset')
      } finally {
        setLoading(false)
      }
    }
    fetchAsset()
  }, [id])

  if (loading) return <p>Cargando detalle…</p>
  if (error)   return <p className="error">{error}</p>
  if (!asset)  return <p>Asset no encontrado</p>

  return (
    <div className="asset-detail container">
      <Link to="/my-assets" className="back-link">
        <FaArrowLeft /> Volver a Mis Assets
      </Link>

      <h2>{asset.title}</h2>
      <p className="type">{asset.type}</p>
      <p className="date">
        Subido el {new Date(asset.uploadDate).toLocaleDateString()}
      </p>

      <div className="media-section">
        {asset.image && (
          <div className="media-item">
            <FaImage /> Imagen principal
            <img src={asset.image} alt={asset.title} />
          </div>
        )}
        {asset.images && asset.images.length > 0 && (
          <div className="media-item">
            <FaImage /> Todas las imágenes
            <div className="media-list">
              {asset.images.map((url, i) => (
                <img key={i} src={url} alt={`${asset.title}-${i}`} />
              ))}
            </div>
          </div>
        )}
        {asset.file && (
          <div className="media-item">
            <FaFile /> Archivo principal:
            <a href={asset.file} download target="_blank" rel="noreferrer">
              Descargar
            </a>
          </div>
        )}
        {asset.files && asset.files.length > 0 && (
          <div className="media-item">
            <FaFile /> Todos los archivos:
            <ul className="file-list">
              {asset.files.map((f, i) => (
                <li key={i}>
                  <a href={f} download target="_blank" rel="noreferrer">
                    {f.split('/').pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="description">
        <h3>Descripción</h3>
        <p>{asset.description}</p>
      </div>
    </div>
  )
}
