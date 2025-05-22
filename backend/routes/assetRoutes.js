const express = require('express')
const router = express.Router()
const multer = require('multer')

const { protect } = require('../middleware/authMiddleware')
const {
  createAsset,
  getAssets,
  getAssetById,
  getLatestPublicAssets,
  addComment,
  getComments,
  toggleLike
} = require('../controllers/assetController')

const upload = multer({ storage: multer.memoryStorage() })

// --------------------------------------------------
// Rutas públicas
// --------------------------------------------------

// GET  /api/assets/latest
// Obtiene los últimos 20 assets subidos por cualquier usuario
router.get('/latest', getLatestPublicAssets)

// GET  /api/assets/:id
// Detalle de un asset por ID (si quieres que sea público, quita `protect`)
router.get('/:id', getAssetById)


// --------------------------------------------------
// Rutas protegidas (requieren token)
// --------------------------------------------------

// GET  /api/assets/
// Lista todos los assets del usuario logueado
router.get('/', protect, getAssets)

// POST /api/assets/
// Sube un nuevo asset (archivos + imágenes)
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'files', maxCount: 10 },
    { name: 'images', maxCount: 5 }
  ]),
  createAsset
)

// POST /api/assets/:id/comments
// Añade un comentario al asset
router.post('/:id/comments', protect, addComment)

// GET  /api/assets/:id/comments
// Lista todos los comentarios de un asset
router.get('/:id/comments', protect, getComments)

// POST /api/assets/:id/likes
// Da o quita “like” en un asset
router.post('/:id/likes', protect, toggleLike)


module.exports = router
