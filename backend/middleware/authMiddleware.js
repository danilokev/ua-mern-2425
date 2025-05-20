// backend/middleware/authMiddleware.js
const jwt           = require('jsonwebtoken')
const asyncHandler  = require('express-async-handler')
const User          = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado, token no proporcionado' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(id).select('-password')
    if (!req.user) {
      return res.status(401).json({ message: 'No autorizado, usuario no encontrado' })
    }
    next()
  } catch (err) {
    console.error(err)
    return res.status(401).json({ message: 'No autorizado, token inválido o expirado' })
  }
})

module.exports = { protect }
