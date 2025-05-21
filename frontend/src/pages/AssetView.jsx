import '../styles/assetview.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiDownload, FiChevronLeft, FiChevronRight, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { toast } from 'react-toastify';

function AssetView() {
  const { id } = useParams(); // Get asset _id from URL
  const [asset, setAsset] = useState({
    title: '',
    description: '',
    type: '',
    uploadDate: '',
    lastUpdated: '',
    storage: '',
    images: [],
    files: [],
    author: {
      name: '',
      avatar: '',
      joinDate: '',
      assetsCount: 0,
      rating: 0
    },
    comments: [
      { user: 'Usuario1', text: 'Excelentes texturas, las he usado en mi último proyecto.', positive: true, date: '2023-05-18' },
      { user: 'Usuario2', text: 'Buen paquete, pero algunas texturas tienen baja resolución.', positive: false, date: '2023-05-20' }
    ],
    ratings: {
      positive: 45,
      negative: 3
    }
  });
  const [activeTab, setActiveTab] = useState('info');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        if (!token) {
          throw new Error('No estás autenticado');
        }

        const response = await fetch(`/api/assets/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          }
        });

        console.log('API Response:', response.status, await response.clone().json());

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || `Error ${response.status}`);
        }

        const data = await response.json();
        // Calculate total storage (simplified, assuming no size data)
        const totalStorage = 0; // Backend should provide file sizes if needed
        const formatStorage = (bytes) => {
          if (bytes === 0) return '0 Bytes';
          const k = 1024;
          const sizes = ['Bytes', 'KB', 'MB', 'GB'];
          const i = Math.floor(Math.log(bytes) / Math.log(k));
          return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        };

        setAsset(prev => ({
          ...prev,
          id: data._id,
          title: data.title || 'Sin título',
          description: data.description || 'Sin descripción',
          type: data.type || 'Desconocido',
          uploadDate: data.uploadDate || new Date().toISOString(),
          lastUpdated: data.updatedAt || new Date().toISOString(),
          storage: formatStorage(totalStorage),
          images: data.image ? [{ url: data.image }] : data.images?.map(img => ({ url: img })) || [],
          files: data.file
            ? [{ name: data.file.split('/').pop(), size: data.fileSize || 'Desconocido' }]
            : data.files?.map(file => ({
                name: file.split('/').pop(),
                size: file.size || 'Desconocido'
              })) || [],
          author: {
            name: data.user?.name || 'Desconocido',
            avatar: data.user?.avatar || 'https://via.placeholder.com/50',
            joinDate: data.user?.joinDate || 'Desconocido',
            assetsCount: data.user?.assetsCount || 0,
            rating: data.user?.rating || 0
          }
        }));
      } catch (err) {
        console.error('Fetch error:', err);
        setError('No se pudo cargar el detalle del asset: ' + err.message);
        toast.error('No se pudo cargar el detalle del asset');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === asset.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? asset.images.length - 1 : prevIndex - 1
    );
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Download Token:', token);
      if (!token) {
        toast.error('No estás autenticado');
        return;
      }

      const response = await fetch(`/api/assets/${id}/download`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });
      console.log('Download Response:', response.status, await response.clone().json());

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${asset.title || 'asset'}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Descarga iniciada');
      } else {
        const data = await response.json();
        toast.error(data.message || `Error al descargar el asset (Código: ${response.status})`);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Error en la conexión con el servidor');
    }
  };

  if (isLoading) {
    return <p>Cargando detalle…</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="asset-view container">
      <div className="asset-layout">
        {/* Columna izquierda */}
        <div className="asset-left">
          {/* Galería de imágenes */}
          <div className="image-gallery">
            <div className="main-image-container">
              <button className="nav-button left" onClick={prevImage} disabled={asset.images.length <= 1}>
                <FiChevronLeft size={24} />
              </button>
              <img 
                src={asset.images[currentImageIndex]?.url || 'https://via.placeholder.com/800x500'} 
                alt={`Vista previa ${currentImageIndex + 1}`}
                className="main-image"
              />
              <button className="nav-button right" onClick={nextImage} disabled={asset.images.length <= 1}>
                <FiChevronRight size={24} />
              </button>
            </div>
            <div className="thumbnail-container">
              {asset.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url || 'https://via.placeholder.com/100'}
                  alt={`Miniatura ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => selectImage(index)}
                />
              ))}
            </div>
          </div>

          {/* Pestañas de contenido */}
          <div className="asset-tabs">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'info' ? 'active' : ''}`}
                onClick={() => setActiveTab('info')}
              >
                Información
              </button>
              <button 
                className={`tab ${activeTab === 'files' ? 'active' : ''}`}
                onClick={() => setActiveTab('files')}
              >
                Archivos contenidos
              </button>
              <button 
                className={`tab ${activeTab === 'versions' ? 'active' : ''}`}
                onClick={() => setActiveTab('versions')}
              >
                Versiones
              </button>
              <button 
                className={`tab ${activeTab === 'comments' ? 'active' : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                Comentarios
              </button>
              <button 
                className={`tab ${activeTab === 'author' ? 'active' : ''}`}
                onClick={() => setActiveTab('author')}
              >
                Autor
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'info' && (
                <div className="info-content">
                  <h3>Descripción</h3>
                  <p>{asset.description || 'Sin descripción disponible'}</p>
                  <div className="asset-meta">
                    <div><strong>Tipo:</strong> {asset.type || 'Desconocido'}</div>
                    <div><strong>Subido:</strong> {asset.uploadDate ? new Date(asset.uploadDate).toLocaleDateString() : 'Desconocido'}</div>
                  </div>
                </div>
              )}

              {activeTab === 'files' && (
                <div className="files-content">
                  <h3>Archivos incluidos</h3>
                  <ul className="file-list">
                    {asset.files.length > 0 ? (
                      asset.files.map((file, index) => (
                        <li key={index}>
                          <div className="file-info">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{file.size}</span>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li>No hay archivos disponibles</li>
                    )}
                  </ul>
                  <div className="total-size">
                    <strong>Total:</strong> {asset.storage || '0 Bytes'}
                  </div>
                </div>
              )}

              {activeTab === 'versions' && (
                <div className="versions-content">
                  <h3>Historial de versiones</h3>
                  <ul className="version-list">
                    <li>
                      <strong>1.0</strong> - Asset lanzado ({asset.uploadDate ? new Date(asset.uploadDate).toLocaleDateString() : 'Desconocido'})
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'comments' && (
                <div className="comments-content">
                  <h3>Comentarios ({asset.comments.length})</h3>
                  <div className="comment-list">
                    {asset.comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <div className="comment-header">
                          <span className="comment-user">{comment.user}</span>
                          <span className="comment-date">{comment.date}</span>
                          {comment.positive ? (
                            <FiThumbsUp className="thumb-up" />
                          ) : (
                            <FiThumbsDown className="thumb-down" />
                          )}
                        </div>
                        <p className="comment-text">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'author' && (
                <div className="author-content">
                  <h3>Información del Autor</h3>
                  <div className="author-info">
                    <img src={asset.author.avatar} alt={asset.author.name} className="author-avatar" />
                    <div className="author-details">
                      <h4>{asset.author.name}</h4>
                      <p>Miembro desde {asset.author.joinDate}</p>
                      <p>{asset.author.assetsCount} assets publicados</p>
                      <p>Valoración: {asset.author.rating}/5</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="asset-right">
          <h1 className="asset-title">{asset.title || 'Sin título'}</h1>
          
          <div className="author-header">
            <img src={asset.author.avatar} alt={asset.author.name} className="author-avatar-small" />
            <span className="author-name">{asset.author.name}</span>
          </div>

          <div className="asset-stats">
            <div className="stat-item">
              <span className="stat-label">Almacenamiento total</span>
              <span className="stat-value">{asset.storage || '0 Bytes'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Última versión</span>
              <span className="stat-value">1.0</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Actualizado desde</span>
              <span className="stat-value">{asset.lastUpdated ? new Date(asset.lastUpdated).toLocaleDateString() : 'Desconocido'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Comentarios</span>
              <div className="comment-stats">
                {asset.ratings.positive > asset.ratings.negative ? (
                  <>
                    <FiThumbsUp className="thumb-up" />
                    <span>{asset.ratings.positive} positivos</span>
                  </>
                ) : (
                  <>
                    <FiThumbsDown className="thumb-down" />
                    <span>{asset.ratings.negative} negativos</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button className="download-button" onClick={handleDownload} disabled={isLoading}>
            <FiDownload className="download-icon" />
            Descargar todo
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetView;