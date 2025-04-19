const Asset = require('../models/assetModel');
const path = require('path');
const fs = require('fs');

// Helper function to save files
const saveFiles = async (files, folder) => {
  const uploadPath = path.join(__dirname, '../uploads', folder);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const savedFiles = [];
  for (const file of files) {
    const fileExt = path.extname(file.originalname);
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + fileExt;
    const filePath = path.join(uploadPath, fileName);
    
    await fs.promises.writeFile(filePath, file.buffer);
    savedFiles.push(`/uploads/${folder}/${fileName}`);
  }
  return savedFiles;
};

// Crea un nuevo asset
const createAsset = async (req, res) => {
  try {
    // Handle file uploads
    const fileUrls = req.files['files'] ? await saveFiles(req.files['files'], 'assets') : [];
    const imageUrls = req.files['images'] ? await saveFiles(req.files['images'], 'images') : [];

    // Create asset with file URLs
    const assetData = {
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      file: fileUrls[0] || '', // Using first file as main file
      files: fileUrls, // All files
      image: imageUrls[0] || '', // Using first image as main image
      images: imageUrls // All images
    };

    const asset = await Asset.create(assetData);
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