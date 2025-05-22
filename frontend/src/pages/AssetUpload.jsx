import '../styles/assetupload.css'
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { FiUpload, FiImage, FiFile, FiX } from 'react-icons/fi';

function AssetUpload() {
  const [activeTab, setActiveTab] = useState('content');
  const [formData, setFormData] = useState({
    title: '',
    type: '2D',
    description: '',
    files: [],
    images: []
  });

  const { title, type, description, files, images } = formData;

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Configuración de dropzone para archivos
  const {
    getRootProps: getFileRootProps,
    getInputProps: getFileInputProps,
    isDragActive: isFileDragActive,
    isDragReject: isFileDragReject
  } = useDropzone({
    onDrop: acceptedFiles => {
      const updatedFiles = acceptedFiles.map(file => ({
        name: file.name,
        size: formatFileSize(file.size),
        fileObject: file
      }));
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...updatedFiles]
      }));
    },
    accept: {
      'application/zip': ['.zip', '.rar'],
      'application/x-rar-compressed': ['.rar'],
      'model/gltf-binary': ['.glb'],
      'audio/mpeg': ['.mp3'],
      'video/mp4': ['.mp4'],
      'application/octet-stream': ['.unitypackage']
    },
    maxFiles: 10
  });

  // Configuración de dropzone para imágenes
  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
    isDragReject: isImageDragReject
  } = useDropzone({
    onDrop: acceptedFiles => {
      const updatedImages = acceptedFiles.map(file => ({
        name: file.name,
        size: formatFileSize(file.size),
        fileObject: file
      }));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...updatedImages]
      }));
    },
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    maxFiles: 5
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (index, field) => {
    setFormData(prev => {
      const updated = [...prev[field]];
      updated.splice(index, 1);
      return { ...prev, [field]: updated };
    });
  };

  const onChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    // 1) Preparamos el FormData
    const uploadData = new FormData();
    uploadData.append('title', title);
    uploadData.append('type', type);
    uploadData.append('description', description);

    files.forEach(file => {
      uploadData.append('files', file.fileObject);
    });

    images.forEach(image => {
      uploadData.append('images', image.fileObject);
    });

    // 2) Recuperamos el token del usuario
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Necesitas iniciar sesión para subir un asset');
      return;
    }

    try {
      // 3) Enviamos la petición con la cabecera Authorization
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('Asset subido con éxito a Cloudify');
        // Reset del formulario
        setFormData({
          title: '',
          type: '2D',
          description: '',
          files: [],
          images: []
        });
        setActiveTab('content');
      } else {
        toast.error(data.message || 'Error al subir el asset a Cloudify');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error en la conexión con el servicio Cloudify');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="asset-upload">
      <h1>Subir un Asset</h1>

      {/* Barra de pestañas */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Contenido y Archivos
        </button>
        <button
          className={`tab ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => setActiveTab('description')}
        >
          Descripción
        </button>
        <button
          className={`tab ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          Imágenes
        </button>
      </div>

      <form onSubmit={onSubmit}>
        {/* Pestaña de Contenido y Archivos */}
        {activeTab === 'content' && (
          <div className="tab-content">
            <div className="form-group">
              <label className='txt-form-asset'>Nombre del Asset:</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={onChange}
                required
              />
            </div>
            <div className="form-group">
              <label className='txt-form-asset'>Elige el tipo de categoría:</label>
              <select name="type" value={type} onChange={onChange}>
              <option value="2D">2D</option>
              <option value="3D">3D</option>
              <option value="Add-Ons">Add-Ons</option>
              <option value="Pixel Art">Pixel Art</option>
              <option value="Isométrico">Isométrico</option>
              <option value="UI">UI</option>
              <option value="Iconos">Iconos</option>
              <option value="Audio">Audio</option>
              <option value="Música">Música</option>
              <option value="VFX">VFX</option>
              <option value="Animaciones">Animaciones</option>
              <option value="Fondos">Fondos</option>
              <option value="Tilesets">Tilesets</option>
              <option value="Video">Video</option>
              <option value="Código">Código</option>
              <option value="Otros">Otros</option>
              </select>
            </div>
            <div className="form-group">
              <label className='txt-form-asset'>Archivos del Asset:</label>
              <div
                {...getFileRootProps()}
                className={`dropzone ${isFileDragActive ? 'active' : ''} ${isFileDragReject ? 'reject' : ''}`}
              >
                <input {...getFileInputProps()} />
                <div className="dropzone-content">
                  <FiFile size={48} className="dropzone-icon" />
                  {isFileDragActive ? (
                    <p className="dropzone-text">Suelta los archivos aquí</p>
                  ) : isFileDragReject ? (
                    <p className="dropzone-text">Tipo de archivo no soportado</p>
                  ) : (
                    <>
                      <p className="dropzone-text">Arrastra y suelta archivos aquí</p>
                      <p className="dropzone-subtext">
                        Formatos aceptados:
                        <br />• Modelos 3D (.glb)
                        <br />• Audio (.mp3)
                        <br />• Video (.mp4)
                        <br />Máximo: 10 archivos
                        <br />Los archivos serán almacenados en Cloudify
                      </p>
                    </>
                  )}
                  <button type="button" className="btn btn-outline">
                    <FiUpload className="btn-icon" /> Seleccionar archivos
                  </button>
                </div>
              </div>
              {files.length > 0 && (
                <div className="file-list">
                  <h4>Archivos subidos:</h4>
                  <ul>
                    {files.map((file, index) => (
                      <li key={index}>
                        <div className="file-info">
                          <FiFile className="file-icon" />
                          <span className="file-name">{file.name}</span>
                          <span className="file-size">{file.size}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index, 'files')}
                          className="remove-btn"
                        >
                          <FiX />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pestaña de Descripción */}
        {activeTab === 'description' && (
          <div className="tab-content">
            <div className="form-group">
              <label className='txt-form-asset'>Descripción del Asset <span>(Describe detalladamente tu contenido)</span></label>
              <textarea
                name="description"
                value={description}
                onChange={onChange}
                rows="10"
                placeholder='Texto...'
                required
              ></textarea>
            </div>
          </div>
        )}

        {/* Pestaña de Imágenes */}
        {activeTab === 'images' && (
          <div className="tab-content">
            <div className="form-group">
              <label className='txt-form-asset'>Imágenes del Asset</label>
              <div
                {...getImageRootProps()}
                className={`dropzone ${isImageDragActive ? 'active' : ''} ${isImageDragReject ? 'reject' : ''}`}
              >
                <input {...getImageInputProps()} />
                <div className="dropzone-content">
                  <FiImage size={48} className="dropzone-icon" />
                  {isImageDragActive ? (
                    <p className="dropzone-text">Suelta las imágenes aquí</p>
                  ) : isImageDragReject ? (
                    <p className="dropzone-text">Tipo de imagen no soportado</p>
                  ) : (
                    <>
                      <p className="dropzone-text">Arrastra y suelta imágenes aquí</p>
                      <p className="dropzone-subtext">
                        Formatos aceptados: .jpg, .jpeg, .png, .gif
                        <br />Máximo: 5 imágenes
                        <br />Las imágenes serán almacenadas en Cloudify
                      </p>
                    </>
                  )}
                  <button type="button" className="btn btn-outline">
                    <FiUpload className="btn-icon" /> Seleccionar imágenes
                  </button>
                </div>
              </div>
              {images.length > 0 && (
                <div className="file-list">
                  <h4>Imágenes subidas:</h4>
                  <ul>
                    {images.map((image, index) => (
                      <li key={index}>
                        <div className="file-info">
                          <FiImage className="file-icon" />
                          <span className="file-name">{image.name}</span>
                          <span className="file-size">{image.size}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index, 'images')}
                          className="remove-btn"
                        >
                          <FiX />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botón de submit */}
        <div className="form-actions">
          <button type="submit" className="btn submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <FiUpload className="spinner" />
                Subiendo a Cloudify...
              </>
            ) : (
              'Subir Asset'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AssetUpload;