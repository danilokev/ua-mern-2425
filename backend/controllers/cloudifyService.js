'use strict'

const cloudinary = require('cloudinary').v2
const { Readable } = require('stream')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

/**
 * Sube un archivo a Cloudinary
 * @param {Buffer} buffer - Buffer del archivo a subir
 * @param {String} folder - Carpeta de destino en Cloudinary
 * @param {String} filename - Nombre del archivo
 * @returns {Promise<String>} URL del archivo subido
 */
const uploadToCloudify = (buffer, folder, filename) => {
  return new Promise((resolve, reject) => {
    // Crear un stream desde el buffer
    const stream = Readable.from(buffer)

    // Configurar el stream de subida a Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder.replace(/^\//, ''), // Eliminar la barra inicial si existe
        public_id: filename.split('.')[0], // Usar el nombre sin extensión como public_id
        resource_type: 'auto' // Auto-detectar el tipo de recurso (imagen, video, raw)
      },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error)
          return reject(error)
        }
        // Devolver la URL segura del recurso
        resolve(result.secure_url)
      }
    )

    // Pipe el buffer al stream de subida
    stream.pipe(uploadStream)
  })
}

module.exports = {
  uploadToCloudify
}