import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaFile, FaImage, FaThumbsUp, FaEdit, FaSave, FaTrash } from 'react-icons/fa'
import '../styles/assetDetail.css'

export default function AssetDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [asset, setAsset] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [likesCount, setLikesCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({
    title: '',
    type: '',
    description: '',
    removeImages: [],
    removeFiles: [],
    newImages: [],
    newFiles: []
  })

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
        setComments(data.comments || [])
        setLikesCount(data.likes ? data.likes.length : 0)
        const meId = localStorage.getItem('userId')
        setLiked(data.likes?.some(uid => uid === meId))
        setEditForm({
          title: data.title,
          type: data.type,
          description: data.description,
          removeImages: [],
          removeFiles: [],
          newImages: [],
          newFiles: []
        })
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

  const handleEditToggle = () => {
    setEditMode(!editMode)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e, field) => {
    const files = Array.from(e.target.files)
    setEditForm(prev => ({ ...prev, [field]: files }))
  }

  const handleRemoveItem = (url, field) => {
    setEditForm(prev => ({
      ...prev,
      [field]: [...prev[field], url]
    }))
  }

  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('title', editForm.title)
      formData.append('type', editForm.type)
      formData.append('description', editForm.description)
      formData.append('removeImages', JSON.stringify(editForm.removeImages))
      formData.append('removeFiles', JSON.stringify(editForm.removeFiles))
      editForm.newImages.forEach(file => formData.append('images', file))
      editForm.newFiles.forEach(file => formData.append('files', file))

      const res = await fetch(`/api/assets/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const updatedAsset = await res.json()
      setAsset(updatedAsset)
      setEditMode(false)
      setEditForm({
        title: updatedAsset.title,
        type: updatedAsset.type,
        description: updatedAsset.description,
        removeImages: [],
        removeFiles: [],
        newImages: [],
        newFiles: []
      })
      alert('Asset actualizado con éxito')
      navigate(`/assets/${id}`)
    } catch (err) {
      console.error(err)
      alert('Error al actualizar el asset')
    }
  }

  if (loading) return <p>Cargando detalle…</p>
  if (error) return <p className="error">{error}</p>
  if (!asset) return <p>Asset no encontrado</p>

  const assetTypes = [
    '2D', '3D', 'Pixel Art', 'Isométrico', 'UI', 'Iconos', 'Audio',
    'Música', 'VFX', 'Animaciones', 'Fondos', 'Tilesets', 'Add-Ons', 'Otros'
  ]

  return (
    <div className="asset-detail container">
      <Link to="/my-assets" className="back-link">
        <FaArrowLeft /> Volver a Mis Assets
      </Link>

      {!editMode ? (
        <>
          <div className="asset-header">
            <h2>{asset.title}</h2>
            <button onClick={handleEditToggle} className="edit-btn">
              <FaEdit /> Editar
            </button>
          </div>
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
        </>
      ) : (
        <form onSubmit={handleSubmitEdit} className="edit-form">
          <h2>Editar Asset</h2>
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <select
              name="type"
              value={editForm.type}
              onChange={handleInputChange}
              required
            >
              {assetTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Imágenes actuales</label>
            <div className="media-list">
              {asset.images.map((url, i) => (
                <div key={i} className="media-item editable">
                  <img src={url} alt={`${asset.title}-${i}`} />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(url, 'removeImages')}
                    className="remove-btn"
                  >
                    <FaTrash /> Eliminar
                  </button>
                </div>
              ))}
            </div>
            <label>Añadir nuevas imágenes</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'newImages')}
            />
          </div>
          <div className="form-group">
            <label>Archivos actuales</label>
            <ul className="file-list">
              {asset.files.map((f, i) => (
                <li key={i} className="file-item">
                  <span>{f.split('/').pop()}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(f, 'removeFiles')}
                    className="remove-btn"
                  >
                    <FaTrash /> Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <label>Añadir nuevos archivos</label>
            <input
              type="file"
              multiple
              onChange={(e) => handleFileChange(e, 'newFiles')}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">
              <FaSave /> Guardar
            </button>
            <button type="button" onClick={handleEditToggle} className="cancel-btn">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}