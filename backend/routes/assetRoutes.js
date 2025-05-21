const express = require('express')
const router = express.Router()
const multer = require('multer')

const { protect } = require('../middleware/authMiddleware')
const {
  createAsset,
  getAssets,
  getAssetById,
  getLatestPublicAssets, // Importar la nueva función
} = require('../controllers/assetController')

const upload = multer({ storage: multer.memoryStorage() })

// Ruta para los últimos assets públicos (sin protección)
router.get('/latest', getLatestPublicAssets)

router
  .route('/')
  .get(protect, getAssets) // Esta sigue siendo para los assets del usuario logueado
  .post(
    protect,
    upload.fields([
      { name: 'files', maxCount: 10 },
      { name: 'images', maxCount: 5 }
    ]),
    createAsset
  )

router
  .route('/:id')
  .get(protect, getAssetById) // hacer esta ruta pública también si el detalle del asset no requiere login

module.exports = router