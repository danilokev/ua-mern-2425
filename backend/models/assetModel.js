const mongoose = require('mongoose');

const assetSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor añade un título']
  },
  type: {
    type: String,
    required: [true, 'Por favor especifica el tipo de asset'],
    enum: ['2D', '3D', 'Audio', 'Video', 'Código', 'Otros']
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: [true, 'Por favor añade una descripción']
  },
  image: {
    type: String, // URL o path de la imagen
    required: [true, 'La imagen es obligatoria']
  },
  file: {
    type: String, // Ruta al archivo del asset (opcional)
  }
});

module.exports = mongoose.model('Asset', assetSchema);
