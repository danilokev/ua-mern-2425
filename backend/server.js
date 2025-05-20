// backend/server.js
'use strict'

const port        = process.env.PORT || 5000
const express     = require('express')
const path        = require('path')
const colors      = require('colors')
require('dotenv').config()
const connectDB   = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')

// Conecta a MongoDB
connectDB()

const app = express()

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Carpeta pública para imágenes (avatars, etc.)
app.use('/images', express.static(path.join(__dirname, 'public/images')))

// Rutas de la API
app.use('/api/users',   require('./routes/userRoutes'))
app.use('/api/assets',  require('./routes/assetRoutes'))
// ... añade aquí otras rutas antes del errorHandler

// Manejador de errores personalizado
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server ejecutándose en el puerto ${port}`.cyan.underline)
})
