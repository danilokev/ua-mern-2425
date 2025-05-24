'use strict'

const Asset    = require('../models/assetModel')
const User     = require('../models/userModel')
const axios    = require('axios')
const archiver = require('archiver')
const path     = require('path')
const { uploadToCloudify } = require('./cloudifyService')

// 1) Crea un nuevo asset
const createAsset = async (req, res) => {
  try {
    const userId = req.user.id

    // Subir archivos
    const fileUrls = []
    if (req.files['files']) {
      for (const f of req.files['files']) {
        const ext = f.originalname.split('.').pop()
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const url = await uploadToCloudify(f.buffer, `assets/${userId}`, filename)
        fileUrls.push(url)
      }
    }

    // Subir imágenes
    const imageUrls = []
    if (req.files['images']) {
      for (const img of req.files['images']) {
        const ext = img.originalname.split('.').pop()
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const url = await uploadToCloudify(img.buffer, `images/${userId}`, filename)
        imageUrls.push(url)
      }
    }

    // Guardar en BD
    const assetData = {
      user: userId,
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      file:   fileUrls[0] || '',
      files:  fileUrls,
      image:  imageUrls[0] || '',
      images: imageUrls,
      comments: [],
      likes:    []
    }

    const asset = await Asset.create(assetData)
    // Incrementar contador en usuario
    await User.findByIdAndUpdate(userId, { $inc: { assetsCount: 1 } })

    res.status(201).json(asset)
  } catch (error) {
    console.error('Error creando asset:', error)
    res.status(400).json({ message: error.message })
  }
}

// 2) Listar assets del usuario logueado
const getAssets = async (req, res) => {
  try {
    const assets = await Asset.find({ user: req.user.id })
      .populate('user', 'name avatar joinDate assetsCount rating')
      .sort({ uploadDate: -1 })

    res.status(200).json(assets)
  } catch (error) {
    console.error('Error fetching assets:', error)
    res.status(500).json({ message: error.message })
  }
}

// 3) Obtener un asset por ID
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

// 4) Últimos 20 assets públicos
const getLatestPublicAssets = async (req, res) => {
  try {
    const assets = await Asset.find({})
      .sort({ uploadDate: -1 })
      .limit(20)
      .populate('user', 'name avatar joinDate assetsCount rating')

    res.status(200).json(assets)
  } catch (error) {
    console.error('Error fetching latest public assets:', error)
    res.status(500).json({ message: error.message })
  }
}

// 5) Búsqueda pública por tag
const getAssetsByTag = async (req, res) => {
  try {
    const { tag } = req.query
    const filter = tag ? { type: tag } : {}
    const assets = await Asset.find(filter)
      .sort({ uploadDate: -1 })
      .populate('user', 'name avatar joinDate assetsCount rating')

    res.status(200).json(assets)
  } catch (error) {
    console.error('Error fetching assets by tag:', error)
    res.status(500).json({ message: error.message })
  }
}

// 6) Añadir comentario
const addComment = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
    if (!asset) return res.status(404).json({ message: 'Asset no encontrado' })

    const { text } = req.body
    if (!text?.trim()) {
      return res.status(400).json({ message: 'El texto del comentario es obligatorio' })
    }

    asset.comments.push({ user: req.user.id, text: text.trim() })
    await asset.save()
    await asset.populate('comments.user', 'name avatar')

    res.status(201).json(asset.comments)
  } catch (error) {
    console.error('Error añadiendo comentario:', error)
    res.status(500).json({ message: error.message })
  }
}

// 7) Listar comentarios
const getComments = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate('comments.user', 'name avatar')

    if (!asset) return res.status(404).json({ message: 'Asset no encontrado' })

    res.status(200).json(asset.comments)
  } catch (error) {
    console.error('Error obteniendo comentarios:', error)
    res.status(500).json({ message: error.message })
  }
}

// 8) Toggle like/unlike
const toggleLike = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
    if (!asset) return res.status(404).json({ message: 'Asset no encontrado' })

    const userId = req.user.id
    const idx    = asset.likes.findIndex(id => id.toString() === userId)
    const liked  = idx === -1

    if (liked) asset.likes.push(userId)
    else       asset.likes.splice(idx, 1)

    await asset.save()
    res.status(200).json({ likesCount: asset.likes.length, liked })
  } catch (error) {
    console.error('Error toggling like:', error)
    res.status(500).json({ message: error.message })
  }
}

// 9) Descargar todos los ficheros en un ZIP
const downloadAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
    if (!asset) {
      return res.status(404).json({ message: 'Asset no encontrado' })
    }

    // Recopilar URLs de archivos
    const urls = []
    if (asset.file) urls.push(asset.file)
    if (Array.isArray(asset.files)) urls.push(...asset.files)

    if (urls.length === 0) {
      return res.status(400).json({ message: 'No hay archivos para descargar' })
    }

    // Preparar la respuesta como ZIP
    res.attachment(`${asset.title || 'asset'}.zip`)
    const archive = archiver('zip', { zlib: { level: 9 } })
    archive.on('error', err => {
      console.error('Error creando ZIP:', err)
      res.status(500).end()
    })
    archive.pipe(res)

    // Añadir cada archivo remoto al ZIP
    for (const fileUrl of urls) {
      const filename = path.basename(fileUrl)
      const response = await axios.get(fileUrl, { responseType: 'stream' })
      archive.append(response.data, { name: filename })
    }

    await archive.finalize()
  } catch (err) {
    console.error('Error en downloadAsset:', err)
    res.status(500).json({ message: err.message })
  }
}

// 10) Actualizar un asset
const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id)
    if (!asset) {
      return res.status(404).json({ message: 'Asset no encontrado' })
    }
    if (asset.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para editar este asset' })
    }

    // Actualizar campos de texto
    const { title, type, description, removeImages, removeFiles } = req.body
    if (title) asset.title = title
    if (type) asset.type = type
    if (description) asset.description = description

    // Procesar eliminación de imágenes
    if (removeImages && Array.isArray(removeImages)) {
      asset.images = asset.images.filter(url => !removeImages.includes(url))
      if (asset.image && removeImages.includes(asset.image)) {
        asset.image = asset.images[0] || ''
      }
    }

    // Procesar eliminación de archivos
    if (removeFiles && Array.isArray(removeFiles)) {
      asset.files = asset.files.filter(url => !removeFiles.includes(url))
      if (asset.file && removeFiles.includes(asset.file)) {
        asset.file = asset.files[0] || ''
      }
    }

    // Subir nuevas imágenes
    const newImageUrls = []
    if (req.files['images']) {
      for (const img of req.files['images']) {
        const ext = img.originalname.split('.').pop()
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const url = await uploadToCloudify(img.buffer, `images/${req.user.id}`, filename)
        newImageUrls.push(url)
      }
      asset.images.push(...newImageUrls)
      if (!asset.image && newImageUrls.length > 0) {
        asset.image = newImageUrls[0]
      }
    }

    // Subir nuevos archivos
    const newFileUrls = []
    if (req.files['files']) {
      for (const f of req.files['files']) {
        const ext = f.originalname.split('.').pop()
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const url = await uploadToCloudify(f.buffer, `assets/${req.user.id}`, filename)
        newFileUrls.push(url)
      }
      asset.files.push(...newFileUrls)
      if (!asset.file && newFileUrls.length > 0) {
        asset.file = newFileUrls[0]
      }
    }

    await asset.save()
    await asset.populate('user', 'name avatar joinDate assetsCount rating')
    await asset.populate('comments.user', 'name avatar')

    res.status(200).json(asset)
  } catch (error) {
    console.error('Error actualizando asset:', error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createAsset,
  getAssets,
  getAssetById,
  getLatestPublicAssets,
  getAssetsByTag,
  addComment,
  getComments,
  toggleLike,
  downloadAsset,
  updateAsset
}