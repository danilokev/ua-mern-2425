import { useState } from 'react';
import { toast } from 'react-toastify';
import '../styles/AssetUpload.css'; // Crea o ajusta este archivo para los estilos

function AssetUpload() {
  const [formData, setFormData] = useState({
    title: '',
    type: '2D',  // valor por defecto
    description: '',
    image: '',
    file: ''
  });

  const { title, type, description, image, file } = formData;

  const onChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('Asset subido con éxito');
        // Reiniciamos el formulario
        setFormData({
          title: '',
          type: '2D',
          description: '',
          image: '',
          file: ''
        });
      } else {
        toast.error(data.message || 'Error al subir el asset');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error en la conexión');
    }
  };

  return (
    <div className="asset-upload container">
      <h2>Subir un Asset</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Título</label>
          <input 
            type="text" 
            name="title" 
            value={title} 
            onChange={onChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Tipo</label>
          <select name="type" value={type} onChange={onChange}>
            <option value="2D">2D</option>
            <option value="3D">3D</option>
            <option value="Audio">Audio</option>
            <option value="Video">Video</option>
            <option value="Código">Código</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
        <div className="form-group">
          <label>Descripción</label>
          <textarea 
            name="description" 
            value={description} 
            onChange={onChange} 
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>URL de la Imagen</label>
          <input 
            type="text" 
            name="image" 
            value={image} 
            onChange={onChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>URL del Archivo (opcional)</label>
          <input 
            type="text" 
            name="file" 
            value={file} 
            onChange={onChange} 
          />
        </div>
        <button type="submit" className="btn btn-block">Subir Asset</button>
      </form>
    </div>
  );
}

export default AssetUpload;
