import '../styles/assetview.css'
import { useState, useEffect, Suspense, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { FiDownload, FiChevronLeft, FiChevronRight, FiThumbsUp } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'

function ModelViewer({ url }) {
  const [error, setError] = useState(null)
  const { scene } = useGLTF(url, true, (err) => {
    console.error('Error loading GLB model:', err)
    setError('No se pudo cargar el modelo 3D')
  })

  const clonedScene = useMemo(() => {
    if (!scene) return null
    return scene.clone()
  }, [scene])

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <p>URL del modelo: {url}</p>
      </div>
    )
  }

  if (!clonedScene) return <div className="loading">Cargando modelo...</div>

  return (
    <primitive 
      object={clonedScene} 
      scale={[1, 1, 1]}
      position={[0, 0, 0]}
    />
  )
}

export default function AssetView() {
  const { id } = useParams()
  const [asset, setAsset] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [gallery, setGallery] = useState([])
  const [fileList, setFileList] = useState([])
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('info')
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
        const galleryItems = []
        if (data.image) {
          galleryItems.push({
            url: data.image,
            name: data.image.split('/').pop(),
            type: 'image'
          })
        }
        
        if (Array.isArray(data.images)) {
          data.images.forEach(u => {
            if (u !== data.image) {
              galleryItems.push({ 
                url: u, 
                name: u.split('/').pop(), 
                type: 'image' 
              })
            }
          })
        }
        
        // Check both 'models' and GLB files in 'files'
        const modelUrls = []
        if (Array.isArray(data.models)) {
          modelUrls.push(...data.models)
        }
        
        if (Array.isArray(data.files)) {
          data.files.forEach(file => {
            if (file.toLowerCase().endsWith('.glb') || file.toLowerCase().endsWith('.gltf')) {
              modelUrls.push(file)
            }
          })
        }
        
        modelUrls.forEach(u => {
          galleryItems.push({ 
            url: u, 
            name: u.split('/').pop(), 
            type: 'model',
            fileType: u.split('.').pop().toLowerCase()
          })
        })

        // Build file list
        const files = []
        if (data.file) {
          files.push({
            url: data.file,
            name: data.file.split('/').pop(),
            type: data.file.split('.').pop().toLowerCase()
          })
        }
        
        if (Array.isArray(data.files)) {
          data.files.forEach(u => {
            if (u !== data.file) {
              files.push({ 
                url: u, 
                name: u.split('/').pop(),
                type: u.split('.').pop().toLowerCase()
              })
            }
          })
        }

        setAsset(data)
        setGallery(galleryItems)
        setFileList(files)
        setComments(data.comments || [])
        setLikesCount(data.likes?.length || 0)
        setLiked(data.likes?.includes(localStorage.getItem('userId')))
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err.message)
        toast.error('Error cargando asset: ' + err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAsset()
  }, [id])

  const nextItem = () =>
    setCurrentItemIndex(i =>
      gallery.length > 0 ? (i + 1) % gallery.length : 0
    )
  
  const prevItem = () =>
    setCurrentItemIndex(i =>
      gallery.length > 0 ? (i - 1 + gallery.length) % gallery.length : 0
    )

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

  if (isLoading) return <div className="loading-full">Cargando detalle del asset...</div>
  if (error) return <div className="error-full">{error}</div>
  if (!asset) return <div className="error-full">Asset no encontrado</div>

  const currentItem = gallery[currentItemIndex]

  return (
    <div className="asset-view container">
      <div className="asset-layout">
        <div className="asset-left">
          <div className="image-gallery">
            <button
              className="nav-button left"
              onClick={prevItem}
              disabled={gallery.length <= 1}
              aria-label="Anterior"
            >
              <FiChevronLeft size={24} />
            </button>
            
            <div className="media-container">
              {currentItem?.type === 'image' ? (
                <img
                  className="main-image"
                  src={currentItem?.url}
                  alt={currentItem?.name}
                  loading="lazy"
                />
              ) : (
                <div className="model-viewer">
                  <Suspense fallback={
                    <div className="loading-model">
                      <p>Cargando modelo 3D...</p>
                      <p>{currentItem?.name}</p>
                    </div>
                  }>
                    <Canvas
                      style={{ height: '500px', width: '100%', background: '#f0f0f0' }}
                      camera={{ position: [0, 0, 5], fov: 50 }}
                    >
                      <ambientLight intensity={0.8} />
                      <directionalLight position={[10, 10, 5]} intensity={1} />
                      <Environment preset="city" />
                      <ModelViewer url={currentItem?.url} />
                      <OrbitControls 
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI}
                      />
                    </Canvas>
                  </Suspense>
                  <div className="model-info">
                    <p>Modelo: {currentItem?.name}</p>
                    <p>Formato: {currentItem?.fileType}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              className="nav-button right"
              onClick={nextItem}
              disabled={gallery.length <= 1}
              aria-label="Siguiente"
            >
              <FiChevronRight size={24} />
            </button>

            <div className="thumbnail-container">
              {gallery.map((item, idx) => (
                <div
                  key={idx}
                  className={`thumbnail ${
                    idx === currentItemIndex ? 'active' : ''
                  } ${item.type === 'model' ? 'model-thumbnail' : ''}`}
                  onClick={() => setCurrentItemIndex(idx)}
                  title={item.name}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className="model-thumbnail-content">
                      <div className="model-icon">3D</div>
                      <span>{item.name.split('.')[0]}</span>
                    </div>
                  )}
                </div>
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
                  <h3>Tipo</h3>
                  <p>{asset.type}</p>
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
                            {f.name} <span className="file-type">({f.type})</span>
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
                  <form className="comment-form" onSubmit={handleSubmitComment}>
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

        <div className="asset-right">
          <h1 className="asset-title">{asset.title}</h1>
          
          <div className="asset-meta">
            <span className="asset-type">{asset.type}</span>
            <span className="asset-date">
              {new Date(asset.uploadDate).toLocaleDateString()}
            </span>
          </div>

          <div className="likes-section">
            <button
              className={`btn-like ${liked ? 'liked' : ''}`}
              onClick={handleToggleLike}
              aria-label={liked ? 'Quitar like' : 'Dar like'}
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

          {fileList.length > 0 && (
            <div className="file-types">
              <h4>Archivos incluidos:</h4>
              <ul>
                {[...new Set(fileList.map(f => f.type))].map((type, i) => (
                  <li key={i}>{type.toUpperCase()}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}