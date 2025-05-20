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
 * Asegura que exista la carpeta dada en Dropbox.
 * Si ya existe, ignora el error de conflicto.
 * @param {string} path Ruta de carpeta, p.ej. '/assets/USERID'
 */
async function ensureFolder(path) {
  try {
    await dbx.filesCreateFolderV2({ path });
  } catch (err) {
    // Si la carpeta ya existe, ignora; cualquier otro error relanzar.
    if (!(
      err.error &&
      err.error['.tag'] === 'folder_conflict'
    )) {
      throw err;
    }
  }
}

/**
 * Sube un buffer a Dropbox y devuelve un enlace directo (raw)
 * @param {Buffer} buffer 
 * @param {string} folder   Carpeta en Dropbox (p.ej. '/assets/USERID' o '/images/USERID')
 * @param {string} filename Nombre de archivo con extensión
 * @returns {Promise<string>} URL pública para descargar el archivo
 */
async function uploadToDropbox(buffer, folder, filename) {
  // 1) Aseguramos existencia de la carpeta
  await ensureFolder(folder);

  // 2) Ruta completa en Dropbox
  const dropPath = `${folder}/${filename}`;

  // 3) Subida
  const uploadRes = await dbx.filesUpload({
    path: dropPath,
    contents: buffer,
    mode: { '.tag': 'add' }
  });

  // 4) Compartir enlace
  const sharedRes = await dbx.sharingCreateSharedLinkWithSettings({
    path: uploadRes.result.path_lower
  });

  // 5) Convertir ?dl=0 a ?raw=1 para embebido directo
  return sharedRes.result.url.replace('?dl=0', '?raw=1');
}

module.exports = { uploadToDropbox };
