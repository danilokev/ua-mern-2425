const Asset = require('../models/assetModel');

// Crea un nuevo asset
const createAsset = async (req, res) => {
  try {
    // Para simplificar, asumimos que recibes los datos del asset en req.body.
    // Si usas subida de archivos, podrías necesitar multer y gestionar req.file
    const asset = await Asset.create(req.body);
    res.status(201).json(asset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtiene todos los assets
const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find();
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAsset, getAssets };
