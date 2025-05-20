// backend/controllers/dropboxService.js
'use strict';
require('dotenv').config();
const { Dropbox } = require('dropbox');
const fetch = require('node-fetch');

console.log('> DROPBOX TOKEN:', process.env.DROPBOX_ACCESS_TOKEN);

const dbx = new Dropbox({
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
  fetch
});

/**
 * Sube un buffer a Dropbox y devuelve un enlace temporal directo
 * @param {Buffer} buffer 
 * @param {string} folder   Carpeta en Dropbox ('/assets' o '/images')
 * @param {string} filename Nombre de archivo con extensión
 * @returns {Promise<string>} URL temporal (expires in 4 hours) para descargar el archivo
 */
async function uploadToDropbox(buffer, folder, filename) {
  const dropPath = `${folder}/${filename}`;
  // 1) Sube el archivo
  const uploadRes = await dbx.filesUpload({
    path: dropPath,
    contents: buffer,
    mode: { '.tag': 'add' }
  });
  // 2) Pide un enlace temporal
  const tempLinkRes = await dbx.filesGetTemporaryLink({
    path: uploadRes.result.path_lower
  });
  // tempLinkRes.result.link es algo como https://dl.dropboxusercontent.com/.../file.png
  return tempLinkRes.result.link;
}

module.exports = { uploadToDropbox };
