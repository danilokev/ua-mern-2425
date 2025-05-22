// backend/models/assetModel.js
const mongoose = require('mongoose')

const assetSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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
    default: ''
  },
  images: [{      // All images
    type: String
  }],
  file: {
    type: String // Main file URL
  },
  files: [{      // All files
    type: String
  }],
comments: [{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}],
likes: [{                        // lista de usuarios que han dado “like”
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}]

}, {
  timestamps: true
})

module.exports = mongoose.model('Asset', assetSchema)
