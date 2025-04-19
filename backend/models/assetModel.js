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
    type: String, // Main image URL
    required: [true, 'La imagen es obligatoria']
  },
  images: [{ // All images
    type: String
  }],
  file: {
    type: String, // Main file URL
  },
  files: [{ // All files
    type: String
  }]
});

module.exports = mongoose.model('Asset', assetSchema);