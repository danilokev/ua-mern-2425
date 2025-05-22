'use strict'

const Asset = require('../models/assetModel')
const User = require('../models/userModel')
const { uploadToCloudify } = require('./cloudifyService')

// Crea un nuevo asset
const createAsset = async (req, res) => {
  try {
    const userId = req.user.id

    // 1) Subir archivos
    const fileUrls = []
    if (req.files['files']) {
      for (const f of req.files['files']) {
        const ext = f.originalname.split('.').pop()
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const url = await uploadToCloudify(f.buffer, `assets/${userId}`, filename)
        fileUrls.push(url)
      }
    }

    // 2) Subir imágenes
    const imageUrls = []
    if (req.files['images']) {
      for (const img of req.files['images']) {
        const ext = img.originalname.split('.').pop()
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const url = await uploadToCloudify(img.buffer, `images/${userId}`, filename)
        imageUrls.push(url)
      }
    }

    // 3) Crear en Mongo guardando el user
    const assetData = {
      user: userId,
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      file: fileUrls[0] || '',
      files: fileUrls,
      image: imageUrls[0] || '',
      images: imageUrls,
      comments: [],
      likes: []
    }

    const asset = await Asset.create(assetData)

    // Actualizar el contador de assets del usuario
    await User.findByIdAndUpdate(userId, { $inc: { assetsCount: 1 } })

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
      .populate('user', 'name avatar joinDate assetsCount rating')
      .sort({ uploadDate: -1 })
    res.status(200).json(assets)
  } catch (error) {
    console.error('Error fetching assets:', error)
    res.status(500).json({ message: error.message })
  }
}

// Obtener un asset por id
const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate('user', 'name avatar joinDate assetsCount rating')
      .populate('comments.user', 'name avatar')
    if (!asset) {
      return res.status(404).json({ message: 'Asset no encontrado' })
    }
    res.status(200).json(asset)
  } catch (error) {
    console.error('Error fetching asset by id:', error)
    res.status(500).json({ message: error.message })
  }
}

// Obtener los últimos 20 assets subidos por cualquier usuario
const getLatestPublicAssets = async (req, res) => {
  try {
    const assets = await Asset
      .find({})
      .sort({ uploadDate: -1 })
      .limit(20)
      .populate('user', 'name avatar joinDate assetsCount rating')
    res.status(200).json(assets)
  } catch (error) {
    console.error('Error fetching latest public assets:', error)
    res.status(500).json({ message: error.message })
  }
}

// Añadir comentario a un asset
const addComment = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
    if (!asset) {
      return res.status(404).json({ message: 'Asset no encontrado' })
    }
    const { text } = req.body
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'El texto del comentario es obligatorio' })
    }
    asset.comments.push({ user: req.user.id, text })
    await asset.save()
    await asset.populate('comments.user', 'name avatar')
    res.status(201).json(asset.comments)
  } catch (error) {
    console.error('Error añadiendo comentario:', error)
    res.status(500).json({ message: error.message })
  }
}

// Listar comentarios de un asset
const getComments = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate('comments.user', 'name avatar')
    if (!asset) {
      return res.status(404).json({ message: 'Asset no encontrado' })
    }
    res.status(200).json(asset.comments)
  } catch (error) {
    console.error('Error obteniendo comentarios:', error)
    res.status(500).json({ message: error.message })
  }
}

// Dar o quitar “like” a un asset
const toggleLike = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
    if (!asset) {
      return res.status(404).json({ message: 'Asset no encontrado' })
    }
    const userId = req.user.id
    const idx = asset.likes.findIndex(id => id.toString() === userId)
    let liked
    if (idx === -1) {
      asset.likes.push(userId)
      liked = true
    } else {
      asset.likes.splice(idx, 1)
      liked = false
    }
    await asset.save()
    res.status(200).json({
      likesCount: asset.likes.length,
      liked
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createAsset,
  getAssets,
  getAssetById,
  getLatestPublicAssets,
  addComment,
  getComments,
  toggleLike
}
