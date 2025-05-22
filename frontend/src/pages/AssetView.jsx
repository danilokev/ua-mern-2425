// frontend/src/pages/AssetView.jsx
import '../styles/assetview.css'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiThumbsUp
} from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function AssetView() {
  const { id } = useParams()
  const [asset, setAsset] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Gallery & files
  const [gallery, setGallery] = useState([])    // [{ url, name }]
  const [fileList, setFileList] = useState([])  // [{ url, name }]

  // UI state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('info')

  // Comments & likes
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
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.message || res.status)
        }
        const data = await res.json()

        // Build gallery array
        const images = []
        if (data.image) {
          images.push({
            url: data.image,
            name: data.image.split('/').pop()
          })
        }
        if (Array.isArray(data.images)) {
          data.images.forEach(u => {
            if (u !== data.image) {
              images.push({ url: u, name: u.split('/').pop() })
            }
          })
        }

        // Build file list array
        const files = []
        if (data.file) {
          files.push({
            url: data.file,
            name: data.file.split('/').pop()
          })
        }
        if (Array.isArray(data.files)) {
          data.files.forEach(u => {
            if (u !== data.file) {
              files.push({ url: u, name: u.split('/').pop() })
            }
          })
        }

        // Set all state
        setAsset(data)
        setGallery(images)
        setFileList(files)
        setComments(data.comments || [])
        setLikesCount(data.likes?.length || 0)
        setLiked(data.likes?.includes(localStorage.getItem('userId')))
      } catch (err) {
        console.error(err)
        setError(err.message)
        toast.error('Error cargando asset: ' + err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAsset()
  }, [id])

  // Gallery nav
  const nextImage = () =>
    setCurrentImageIndex(i =>
      gallery.length > 0 ? (i + 1) % gallery.length : 0
    )
  const prevImage = () =>
    setCurrentImageIndex(i =>
      gallery.length > 0
        ? (i - 1 + gallery.length) % gallery.length
        : 0
    )

  // Submit a new comment
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
      if (!res.ok) throw new Error('No se pudo publicar el comentario')
      const updated = await res.json()
      setComments(updated)
      setNewComment('')
      toast.success('Comentario añadido')
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    }
  }

  // Toggle like/unlike
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
      if (!res.ok) throw new Error('No se pudo procesar like')
      const { likesCount: count, liked: nowLiked } = await res.json()
      setLikesCount(count)
      setLiked(nowLiked)
    } catch (err) {
      console.error(err)
      toast.error(err.message)
    }
  }

  // Download all files
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/assets/${id}/download`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('Falló descarga')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${asset.title || 'asset'}.zip`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Descarga iniciada')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo descargar')
    }
  }

  if (isLoading) return <p>Cargando detalle…</p>
  if (error) return <p className="error">{error}</p>
  if (!asset) return <p>Asset no encontrado</p>

  return (
    <div className="asset-view container">
      <div className="asset-layout">
        {/* Left column: gallery + tabs */}
        <div className="asset-left">
          <div className="image-gallery">
            <button
              className="nav-button left"
              onClick={prevImage}
              disabled={gallery.length <= 1}
            >
              <FiChevronLeft size={24} />
            </button>
            <img
              className="main-image"
              src={gallery[currentImageIndex]?.url}
              alt={gallery[currentImageIndex]?.name}
            />
            <button
              className="nav-button right"
              onClick={nextImage}
              disabled={gallery.length <= 1}
            >
              <FiChevronRight size={24} />
            </button>

            <div className="thumbnail-container">
              {gallery.map((img, idx) => (
                <img
                  key={idx}
                  className={`thumbnail ${
                    idx === currentImageIndex ? 'active' : ''
                  }`}
                  src={img.url}
                  alt={img.name}
                  onClick={() => setCurrentImageIndex(idx)}
                />
              ))}
            </div>
          </div>

          <div className="asset-tabs">
            <div className="tabs">
              {['info', 'files', 'versions', 'comments', 'author'].map(tab => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {activeTab === 'info' && (
                <div className="info-content">
                  <h3>Descripción</h3>
                  <p>{asset.description}</p>
                </div>
              )}

              {activeTab === 'files' && (
                <div className="files-content">
                  <h3>Archivos contenidos</h3>
                  <ul className="file-list">
                    {fileList.length > 0 ? (
                      fileList.map((f, idx) => (
                        <li key={idx}>
                          <a href={f.url} download>
                            {f.name}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li>No hay archivos disponibles</li>
                    )}
                  </ul>
                </div>
              )}

              {activeTab === 'versions' && (
                <div className="versions-content">
                  <h3>Versiones</h3>
                  <ul className="version-list">
                    <li>
                      <strong>1.0</strong> —{' '}
                      {new Date(asset.uploadDate).toLocaleDateString()}
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="comments-content">
                  <h3>Comentarios ({comments.length})</h3>
                  <form
                    className="comment-form"
                    onSubmit={handleSubmitComment}
                  >
                    <textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Escribe un comentario..."
                      required
                    />
                    <button type="submit">Enviar</button>
                  </form>
                  <div className="comment-list">
                    {comments.map(c => (
                      <div key={c._id} className="comment">
                        <img
                          src={c.user.avatar}
                          alt={c.user.name}
                          className="avatar-sm"
                        />
                        <div className="comment-body">
                          <strong>{c.user.name}</strong>
                          <p>{c.text}</p>
                          <small>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'author' && (
                <div className="author-content">
                  <h3>Autor</h3>
                  <img
                    src={asset.user.avatar}
                    alt={asset.user.name}
                    className="author-avatar"
                  />
                  <p>{asset.user.name}</p>
                  <p>Miembro desde {new Date(asset.user.joinDate).toLocaleDateString()}</p>
                  <p>{asset.user.assetsCount} assets publicados</p>
                  <p>Valoración: {asset.user.rating}/5</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: title, like, download */}
        <div className="asset-right">
          <h1 className="asset-title">{asset.title}</h1>

          <div className="likes-section">
            <button
              className={`btn-like ${liked ? 'liked' : ''}`}
              onClick={handleToggleLike}
            >
              <FiThumbsUp size={20} /> {likesCount}
            </button>
          </div>

          <button
            className="download-button"
            onClick={handleDownload}
          >
            <FiDownload size={20} /> Descargar todo
          </button>
        </div>
      </div>
    </div>
  )
}
