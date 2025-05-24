const express = require('express')
const router = express.Router()
const multer = require('multer')

const { protect } = require('../middleware/authMiddleware')
const {
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
} = require('../controllers/assetController')

const upload = multer({ storage: multer.memoryStorage() })

// 1) Rutas públicas (no requieren token)
// GET  /api/assets/latest       → últimos 20 assets
router.get('/latest', getLatestPublicAssets)
// GET  /api/assets/search?tag=… → filtrar por categoría/tag
router.get('/search', getAssetsByTag)

// 2) Rutas protegidas (requieren token)
// GET    /api/assets/            → mis assets
router.get('/', protect, getAssets)
// POST   /api/assets/            → subir un nuevo asset
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'files', maxCount: 10 },
    { name: 'images', maxCount: 5 }
  ]),
  createAsset
)
// PUT    /api/assets/:id         → actualizar un asset
router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'files', maxCount: 10 },
    { name: 'images', maxCount: 5 }
  ]),
  updateAsset
)
// GET    /api/assets/:id/download → descargar todos los ficheros en un ZIP
router.get('/:id/download', protect, downloadAsset)
// GET    /api/assets/:id         → detalle de un asset
router.get('/:id', protect, getAssetById)
// POST   /api/assets/:id/comments → añadir comentario
router.post('/:id/comments', protect, addComment)
// GET    /api/assets/:id/comments → listar comentarios
router.get('/:id/comments', protect, getComments)
// POST   /api/assets/:id/likes    → toggle like/unlike
router.post('/:id/likes', protect, toggleLike)

module.exports = router