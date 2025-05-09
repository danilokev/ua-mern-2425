'use strict';

const Asset = require('../models/assetModel');
const { uploadToDropbox } = require('./dropboxService');


// Crea un nuevo asset
const createAsset = async (req, res) => {
  try {
    // 1) Subir archivos a Dropbox
    const fileUrls = [];
    if (req.files['files']) {
      for (const f of req.files['files']) {
        // Construye un nombre único
        const ext = f.originalname.split('.').pop();
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
        // Sube y devuelve la URL raw
        const url = await uploadToDropbox(f.buffer, '/assets', filename);
        fileUrls.push(url);
      }
    }

    // 2) Subir imágenes a Dropbox
    const imageUrls = [];
    if (req.files['images']) {
      for (const img of req.files['images']) {
        const ext = img.originalname.split('.').pop();
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
        const url = await uploadToDropbox(img.buffer, '/images', filename);
        imageUrls.push(url);
      }
    }

    // 3) Crear el documento en Mongo con las URLs obtenidas
    const assetData = {
      title:       req.body.title,
      type:        req.body.type,
      description: req.body.description,
      file:        fileUrls[0]  || '',  // archivo principal
      files:       fileUrls,           // todos los archivos
      image:       imageUrls[0] || '', // imagen principal
      images:      imageUrls           // todas las imágenes
    };

    const asset = await Asset.create(assetData);
    return res.status(201).json(asset);

  } catch (error) {
    console.error('Error creando asset:', error);
    return res.status(400).json({ message: error.message });
  }
};


// Obtiene todos los assets
const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find().sort({ uploadDate: -1 });
    return res.status(200).json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Obtiene un solo asset por ID
const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
    if (!asset) {
      return res.status(404).json({ message: 'Asset no encontrado' })
    }
    res.status(200).json(asset)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createAsset,
  getAssets,
  getAssetById
}
