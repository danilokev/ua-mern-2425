// frontend/src/pages/AssetDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaArrowLeft, FaFile, FaImage, FaThumbsUp } from 'react-icons/fa'
import '../styles/assetDetail.css'

export default function AssetDetail() {
  const { id } = useParams()
  const [asset, setAsset] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  const [likesCount, setLikesCount] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('No estás autenticado')

        const res = await fetch(`/api/assets/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        if (!res.ok) throw new Error(`Error ${res.status}`)

        const data = await res.json()
        setAsset(data)

        // Inicializar comentarios y likes
        setComments(data.comments || [])
        setLikesCount(data.likes ? data.likes.length : 0)
        // Comprueba si el usuario actual ya ha dado like
        const meId = localStorage.getItem('userId')
        setLiked(data.likes?.some(uid => uid === meId))

      } catch (err) {
        console.error(err)
        setError('No se pudo cargar el detalle del asset')
      } finally {
        setLoading(false)
      }
    }

    fetchAsset()
  }, [id])

  const handleSubmitComment = async e => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/assets/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newComment.trim() })
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const updatedComments = await res.json()
      setComments(updatedComments)
      setNewComment('')
    } catch (err) {
      console.error(err)
      alert('Error al enviar el comentario')
    }
  }

  const handleToggleLike = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/assets/${id}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const { likesCount: newCount, liked: nowLiked } = await res.json()
      setLikesCount(newCount)
      setLiked(nowLiked)
    } catch (err) {
      console.error(err)
      alert('Error al procesar like')
    }
  }

  if (loading) return <p>Cargando detalle…</p>
  if (error) return <p className="error">{error}</p>
  if (!asset) return <p>Asset no encontrado</p>

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
        {asset.images?.length > 0 && (
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
        {asset.files?.length > 0 && (
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