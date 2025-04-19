import '../styles/assetview.css'
import { useState } from 'react';
import { FiDownload, FiChevronLeft, FiChevronRight, FiUser, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import asset2 from '../assets/Carlos_texturas.PNG'   // Imagen ejemplo
import asset3 from '../assets/ea3179b669f031e06e4ce5ef0996f3378e3f1515_hq.jpg'   // Imagen ejemplo
import asset4 from '../assets/images.jpg'   // Imagen ejemplo


function AssetView() {
  // Datos de ejemplo (en una aplicación real estos vendrían de una API)
  const [asset, setAsset] = useState({
    id: '1',
    title: 'Paquete de Texturas Medievales',
    description: 'Un completo paquete de texturas en alta resolución para entornos medievales. Incluye texturas para piedra, madera, metal y telas. Perfecto para juegos RPG o entornos históricos.',
    type: '2D',
    uploadDate: '2023-05-15',
    lastUpdated: '2023-05-20',
    storage: '245 MB',
    images: [
      asset3,
      asset4,
      'https://via.placeholder.com/800x500/999/fff?text=Preview+3',
      'https://via.placeholder.com/800x500/ccc/333?text=Preview+4'
    ],
    files: [
      { name: 'texturas_piedra.zip', size: '45 MB' },
      { name: 'texturas_madera.zip', size: '60 MB' },
      { name: 'texturas_metal.zip', size: '40 MB' },
      { name: 'texturas_telas.zip', size: '100 MB' }
    ],
    author: {
      name: 'Carlos Texturas',
      avatar: asset2,
      joinDate: 'Enero 2021',
      assetsCount: 24,
      rating: 4.8
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

  const handleDownload = () => {
    // Lógica para descargar todos los archivos
    alert('Descargando todos los archivos del asset');
  };

  return (
    <div className="asset-view container">
      <div className="asset-layout">
        {/* Columna izquierda */}
        <div className="asset-left">
          {/* Galería de imágenes */}
          <div className="image-gallery">
            <div className="main-image-container">
              <button className="nav-button left" onClick={prevImage}>
                <FiChevronLeft size={24} />
              </button>
              <img 
                src={asset.images[currentImageIndex]} 
                alt={`Vista previa ${currentImageIndex + 1}`}
                className="main-image"
              />
              <button className="nav-button right" onClick={nextImage}>
                <FiChevronRight size={24} />
              </button>
            </div>
            <div className="thumbnail-container">
              {asset.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
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
                  <p>{asset.description}</p>
                  <div className="asset-meta">
                    <div><strong>Tipo:</strong> {asset.type}</div>
                    <div><strong>Subido:</strong> {new Date(asset.uploadDate).toLocaleDateString()}</div>
                  </div>
                </div>
              )}

              {activeTab === 'files' && (
                <div className="files-content">
                  <h3>Archivos incluidos</h3>
                  <ul className="file-list">
                    {asset.files.map((file, index) => (
                      <li key={index}>
                        <div className="file-info">
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">{file.size}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="total-size">
                    <strong>Total:</strong> {asset.storage}
                  </div>
                </div>
              )}

              {activeTab === 'versions' && (
                <div className="versions-content">
                  <h3>Historial de versiones</h3>
                  <ul className="version-list">
                    <li>
                      <strong>1.0</strong> - Asset lanzado ({new Date(asset.uploadDate).toLocaleDateString()})
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
          <h1 className="asset-title">{asset.title}</h1>
          
          <div className="author-header">
            <img src={asset.author.avatar} alt={asset.author.name} className="author-avatar-small" />
            <span className="author-name">{asset.author.name}</span>
          </div>

          <div className="asset-stats">
            <div className="stat-item">
              <span className="stat-label">Almacenamiento total</span>
              <span className="stat-value">{asset.storage}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Última versión</span>
              <span className="stat-value">1.0</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Actualizado desde</span>
              <span className="stat-value">{new Date(asset.lastUpdated).toLocaleDateString()}</span>
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

          <button className="download-button" onClick={handleDownload}>
            <FiDownload className="download-icon" />
            Descargar todo
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetView;