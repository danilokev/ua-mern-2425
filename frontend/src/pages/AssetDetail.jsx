import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FiArrowLeft, FiFile, FiImage, FiX, FiUpload } from 'react-icons/fi';
import '../styles/assetDetail.css';
import '../styles/assetupload.css';

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    type: '',
    description: '',
    removeImages: [],
    removeFiles: [],
    newImages: [],
    newFiles: [],
  });

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No estás autenticado');

        const res = await fetch(`/api/assets/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error(`Error ${res.status}`);

        const data = await res.json();
        setAsset(data);
        setComments(data.comments || []);
        setLikesCount(data.likes ? data.likes.length : 0);
        const meId = localStorage.getItem('userId');
        setLiked(data.likes?.some((uid) => uid === meId));
        setEditForm({
          title: data.title,
          type: data.type,
          description: data.description,
          removeImages: [],
          removeFiles: [],
          newImages: [],
          newFiles: [],
        });
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el detalle del asset');
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, [id]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const {
    getRootProps: getFileRootProps,
    getInputProps: getFileInputProps,
    isDragActive: isFileDragActive,
    isDragReject: isFileDragReject,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      const updatedFiles = acceptedFiles.map((file) => ({
        name: file.name,
        size: formatFileSize(file.size),
        fileObject: file,
      }));
      setEditForm((prev) => ({
        ...prev,
        newFiles: [...prev.newFiles, ...updatedFiles],
      }));
    },
    accept: {
      'application/zip': ['.zip', '.rar'],
      'application/x-rar-compressed': ['.rar'],
      'model/gltf-binary': ['.glb'],
      'audio/mpeg': ['.mp3'],
      'video/mp4': ['.mp4'],
      'application/octet-stream': ['.unitypackage'],
    },
    maxFiles: 10,
  });

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
    isDragReject: isImageDragReject,
  } = useDropzone({
    onDrop: (acceptedFiles) => {
      const updatedImages = acceptedFiles.map((file) => ({
        name: file.name,
        size: formatFileSize(file.size),
        fileObject: file,
      }));
      setEditForm((prev) => ({
        ...prev,
        newImages: [...prev.newImages, ...updatedImages],
      }));
    },
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxFiles: 5,
  });

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/assets/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment.trim() }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const updatedComments = await res.json();
      setComments(updatedComments);
      setNewComment('');
    } catch (err) {
      console.error(err);
      alert('Error al enviar el comentario');
    }
  };

  const handleToggleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/assets/${id}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const { likesCount: newCount, liked: nowLiked } = await res.json();
      setLikesCount(newCount);
      setLiked(nowLiked);
    } catch (err) {
      console.error(err);
      alert('Error al procesar like');
    }
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveItem = (item, field, type) => {
    setEditForm((prev) => {
      const removeField = type === 'image' ? 'removeImages' : 'removeFiles';
      return {
        ...prev,
        [removeField]: [...prev[removeField], item],
      };
    });
    setAsset((prev) => ({
      ...prev,
      [field]: prev[field].filter((f) => f !== item),
    }));
  };

  const removeNewFile = (index, field) => {
    setEditForm((prev) => {
      const updated = [...prev[field]];
      updated.splice(index, 1);
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('type', editForm.type);
      formData.append('description', editForm.description);
      formData.append('removeImages', JSON.stringify(editForm.removeImages));
      formData.append('removeFiles', JSON.stringify(editForm.removeFiles));
      editForm.newImages.forEach((file) => formData.append('images', file.fileObject));
      editForm.newFiles.forEach((file) => formData.append('files', file.fileObject));

      const res = await fetch(`/api/assets/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const updatedAsset = await res.json();
      setAsset(updatedAsset);
      setEditMode(false);
      setEditForm({
        title: updatedAsset.title,
        type: updatedAsset.type,
        description: updatedAsset.description,
        removeImages: [],
        removeFiles: [],
        newImages: [],
        newFiles: [],
      });
      alert('Asset actualizado con éxito');
      navigate(`/assets/${id}`);
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el asset');
    }
  };

  if (loading) return <p>Cargando detalle…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!asset) return <p>Asset no encontrado</p>;

  const assetTypes = [
    '2D', '3D', 'Pixel Art', 'Isométrico', 'UI', 'Iconos', 'Audio',
    'Música', 'VFX', 'Animaciones', 'Fondos', 'Tilesets', 'Add-Ons', 'Otros',
  ];

  return (
    <div className="asset-detail container">
      <Link to="/my-assets" className="back-link">
        <FiArrowLeft /> Volver a Mis Assets
      </Link>

      {!editMode ? (
        <>
          <div className="asset-header">
            <h2>{asset.title}</h2>
            <button onClick={handleEditToggle} className="edit-btn">
              <FiUpload /> Editar
            </button>
          </div>
          <p className="type">{asset.type}</p>
          <p className="date">
            Subido el {new Date(asset.uploadDate).toLocaleDateString()}
          </p>

          <div className="media-section">
            {asset.image && (
              <div className="media-item">
                <FiImage /> Imagen principal
                <img src={asset.image} alt={asset.title} />
              </div>
            )}
            {asset.images?.length > 0 && (
              <div className="media-item">
                <FiImage /> Todas las imágenes
                <div className="media-list">
                  {asset.images.map((url, i) => (
                    <img key={i} src={url} alt={`${asset.title}-${i}`} />
                  ))}
                </div>
              </div>
            )}
            {asset.file && (
              <div className="media-item">
                <FiFile /> Archivo principal:
                <a href={asset.file} download target="_blank" rel="noreferrer">
                  Descargar
                </a>
              </div>
            )}
            {asset.files?.length > 0 && (
              <div className="media-item">
                <FiFile /> Todos los archivos:
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
              {assetTypes.map((type) => (
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
              rows="10"
              required
            />
          </div>
          <div className="form-group">
            <label>Imágenes actuales</label>
            {asset.images.length > 0 ? (
              <div className="media-list">
                {asset.images.map((url, i) => (
                  <div key={i} className="media-item editable">
                    <img src={url} alt={`${asset.title}-${i}`} />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(url, 'images', 'image')}
                      className="remove-btn"
                      disabled={editForm.removeImages.includes(url)}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay imágenes actuales</p>
            )}
            <label>Añadir nuevas imágenes</label>
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
                    </p>
                  </>
                )}
                <button type="button" className="btn btn-outline">
                  <FiUpload className="btn-icon" /> Seleccionar imágenes
                </button>
              </div>
            </div>
            {editForm.newImages.length > 0 && (
              <div className="file-list">
                <h4>Imágenes nuevas:</h4>
                <ul>
                  {editForm.newImages.map((image, index) => (
                    <li key={index}>
                      <div className="file-info">
                        <FiImage className="file-icon" />
                        <span className="file-name">{image.name}</span>
                        <span className="file-size">{image.size}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewFile(index, 'newImages')}
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
          <div className="form-group">
            <label>Archivos actuales</label>
            <div className="file-list">
              {asset.files.length > 0 ? (
                <ul>
                  {asset.files.map((f, i) => (
                    <li key={i}>
                      <div className="file-info">
                        <FiFile className="file-icon" />
                        <span className="file-name">{f.split('/').pop()}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(f, 'files', 'file')}
                        className="remove-btn"
                        disabled={editForm.removeFiles.includes(f)}
                      >
                        <FiX />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay archivos actuales</p>
              )}
            </div>
            <label>Añadir nuevos archivos</label>
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
                    </p>
                  </>
                )}
                <button type="button" className="btn btn-outline">
                  <FiUpload className="btn-icon" /> Seleccionar archivos
                </button>
              </div>
            </div>
            {editForm.newFiles.length > 0 && (
              <div className="file-list">
                <h4>Archivos nuevos:</h4>
                <ul>
                  {editForm.newFiles.map((file, index) => (
                    <li key={index}>
                      <div className="file-info">
                        <FiFile className="file-icon" />
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">{file.size}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewFile(index, 'newFiles')}
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
          <div className="form-actions">
            <button type="submit" className="save-btn">
              <FiUpload /> Guardar
            </button>
            <button type="button" onClick={handleEditToggle} className="cancel-btn">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}