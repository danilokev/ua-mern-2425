'use strict'

const Asset = require('../models/assetModel')
const { uploadToDropbox } = require('./dropboxService')

// Crea un nuevo asset
const createAsset = async (req, res) => {
  try {
    const userId = req.user.id

    // 1) Subir archivos
    const fileUrls = []
    if (req.files['files']) {
      for (const f of req.files['files']) {
        const ext      = f.originalname.split('.').pop()
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        // Metemos cada usuario en su carpeta
        const url = await uploadToDropbox(f.buffer, `/assets/${userId}`, filename)
        fileUrls.push(url)
      }
    }

    // 2) Subir imágenes
    const imageUrls = []
    if (req.files['images']) {
      for (const img of req.files['images']) {
        const ext      = img.originalname.split('.').pop()
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const url = await uploadToDropbox(img.buffer, `/images/${userId}`, filename)
        imageUrls.push(url)
      }
    }

    // 3) Crear en Mongo guardando el user
    const assetData = {
      user:        userId,
      title:       req.body.title,
      type:        req.body.type,
      description: req.body.description,
      file:        fileUrls[0]  || '',
      files:       fileUrls,
      image:       imageUrls[0] || '',
      images:      imageUrls
    }

    const asset = await Asset.create(assetData)
    res.status(201).json(asset)
  } catch (error) {
    console.error('Error creando asset:', error)
    res.status(400).json({ message: error.message })
  }
}

// Listar sólo los assets del usuario logueado
const getAssets = async (req, res) => {
  try {
    const assets = await Asset
      .find({ user: req.user.id })
      .sort({ uploadDate: -1 })
    res.status(200).json(assets)
  } catch (error) {
    console.error('Error fetching assets:', error)
    res.status(500).json({ message: error.message })
  }
}

// Obtener un asset por id, pero sólo si le pertenece al user
const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
    if (!asset) {
      return res.status(404).json({ message: 'Asset no encontrado' })
    }
    if (asset.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' })
    }
    res.status(200).json(asset)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createAsset,
  getAssets,
  getAssetById
}
