import { useState } from 'react';
import { useDispatch } from 'react-redux';
// Opcional: si usas Redux para manejar assets, crea un thunk para crear asset
// import { createAsset } from '../features/assets/assetSlice';

function AssetForm() {
  const [formData, setFormData] = useState({
    title: '',
    type: '2D',  // valor por defecto
    description: '',
    image: '',
    file: ''
  });

  const dispatch = useDispatch();

  const { title, type, description, image, file } = formData;

  const onChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Ejemplo sin Redux: enviamos una petición fetch
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log('Asset creado:', data);
      // Reinicia el formulario o navega a otra página
    } catch (error) {
      console.error(error);
    }

    // Si usas Redux, podrías hacer:
    // dispatch(createAsset(formData));
  };

  return (
    <form onSubmit={onSubmit} className="form-container">
      <h2>Crear Asset</h2>
      <div className="form-group">
        <label>Título</label>
        <input type="text" name="title" value={title} onChange={onChange} required />
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
        <textarea name="description" value={description} onChange={onChange} required></textarea>
      </div>
      <div className="form-group">
        <label>URL de la Imagen</label>
        <input type="text" name="image" value={image} onChange={onChange} required />
      </div>
      <div className="form-group">
        <label>URL del Archivo (opcional)</label>
        <input type="text" name="file" value={file} onChange={onChange} />
      </div>
      <button type="submit" className="btn btn-block">Crear Asset</button>
    </form>
  );
}

export default AssetForm;
