// backend/controllers/userController.js
const jwt            = require('jsonwebtoken')
const bcrypt         = require('bcryptjs')
const asyncHandler   = require('express-async-handler')
const User           = require('../models/userModel')

// @desc    Registra un nuevo usuario
// @route   POST /api/users/
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Comprueba si el usuario ya existe
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hashea la contraseña
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Crea el usuario
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  })

  if (user) {
    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Autentica un usuario
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Busca el usuario
  const user = await User.findOne({ email })
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(401)
    throw new Error('Invalid credentials')
  }
})

// @desc    Obtiene los datos del usuario logueado
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }
  res.status(200).json(user)
})

// @desc    Actualiza nombre/email del usuario
// @route   PUT /api/users/me
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  user.name  = req.body.name  || user.name
  user.email = req.body.email || user.email

  const updatedUser = await user.save()
  res.status(200).json({
    _id:   updatedUser._id,
    name:  updatedUser.name,
    email: updatedUser.email,
    avatar: updatedUser.avatar
  })
})

// @desc    Actualiza contraseña
// @route   PUT /api/users/password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const user           = await User.findById(req.user.id)
  const { currentPassword, newPassword } = req.body

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }
  if (!(await bcrypt.compare(currentPassword, user.password))) {
    res.status(401)
    throw new Error('Current password is incorrect')
  }

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(newPassword, salt)
  await user.save()

  res.status(200).json({ message: 'Password updated successfully' })
})

// @desc    Actualiza avatar
// @route   PUT /api/users/avatar
// @access  Private
const updateAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (req.file) {
    user.avatar = `/uploads/avatars/${req.file.filename}`
    await user.save()
  }

  res.status(200).json({
    message: 'Avatar updated',
    avatar:  user.avatar
  })
})

// @desc    Elimina la cuenta del usuario
// @route   DELETE /api/users/me
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }
  await user.remove()
  res.status(200).json({ message: 'Account permanently deleted' })
})

// Genera el JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUser,
  updatePassword,
  updateAvatar,
  deleteUser
}