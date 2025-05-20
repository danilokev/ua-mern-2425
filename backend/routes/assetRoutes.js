const express = require('express')
const router  = express.Router()
const multer  = require('multer')

const { protect }          = require('../middleware/authMiddleware')
const {
  createAsset,
  getAssets,
  getAssetById,
} = require('../controllers/assetController')

const upload = multer({ storage: multer.memoryStorage() })

router
  .route('/')
  .get(protect, getAssets)
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
  .get(protect, getAssetById)

module.exports = router
