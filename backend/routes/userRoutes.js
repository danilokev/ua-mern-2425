const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  updatePassword,
  updateAvatar,
  deleteUser
} = require('../controllers/userController')

const { protect } = require('../middleware/authMiddleware')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'uploads', 'avatars')); // Ruta absoluta
  },
  filename: (req, file, cb) => {
    cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // límite de 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  }
});

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/me', protect, updateUser);
router.delete('/me', protect, deleteUser);
router.put('/password', protect, updatePassword);
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);

module.exports = router