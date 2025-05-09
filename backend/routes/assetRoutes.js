const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createAsset,
  getAssets,
  getAssetById
} = require('../controllers/assetController');

const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
  .get(getAssets)
  .post(upload.fields([
    { name: 'files', maxCount: 10 },
    { name: 'images', maxCount: 5 }
  ]), createAsset);

  router.route('/:id')
  .get(getAssetById)
  
module.exports = router;