const express = require('express')
const router = express.Router()
const multer = require('multer')

const { protect } = require('../middleware/authMiddleware')
const {
  createAsset,
  getAssets,
  getAssetById,
  getLatestPublicAssets,
  getAssetsByTag,    // tu controlador de /search
  addComment,
  getComments,
  toggleLike
} = require('../controllers/assetController')

const upload = multer({ storage: multer.memoryStorage() })

// 1) Rutas públicas SIN protect:
// Últimos 20
router.get('/latest', getLatestPublicAssets)
// Búsqueda por categoría/tag
router.get('/search', getAssetsByTag)

// 2) Rutas protegidas CON protect:
// Listar sólo mis assets
router.get('/', protect, getAssets)
// Subir nuevo asset
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'files', maxCount: 10 },
    { name: 'images', maxCount: 5 }
  ]),
  createAsset
)
// Detalle de un asset por ID
router.get('/:id', protect, getAssetById)
// Comentarios y likes
router.post('/:id/comments', protect, addComment)
router.get('/:id/comments', protect, getComments)
router.post('/:id/likes',   protect, toggleLike)

module.exports = router
