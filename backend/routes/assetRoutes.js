const express = require('express');
const router = express.Router();
const {
  createAsset,
  getAssets
} = require('../controllers/assetController');

router.route('/')
  .get(getAssets)    // Para obtener todos los assets
  .post(createAsset); // Para crear un nuevo asset

module.exports = router;
