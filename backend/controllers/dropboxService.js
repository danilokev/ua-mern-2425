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
 * Sube un buffer a Dropbox y devuelve un enlace directo (raw)
 * @param {Buffer} buffer 
 * @param {string} folder   Carpeta en Dropbox ('/assets' o '/images')
 * @param {string} filename Nombre de archivo con extensión
 * @returns {Promise<string>} URL pública para descargar el archivo
 */
async function uploadToDropbox(buffer, folder, filename) {
  const dropPath = `${folder}/${filename}`;
  const uploadRes = await dbx.filesUpload({
    path: dropPath,
    contents: buffer,
    mode: { '.tag': 'add' }
  });
  const sharedRes = await dbx.sharingCreateSharedLinkWithSettings({
    path: uploadRes.result.path_lower
  });
  return sharedRes.result.url.replace('?dl=0', '?raw=1');
}

module.exports = { uploadToDropbox };
