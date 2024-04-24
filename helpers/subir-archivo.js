
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jgeg', 'gif'], carpeta = '') => {
  // const subirArchivo = (files, { carpeta = '', extensionesValidas = ['png', 'jpg', 'jgeg', 'gif'] }) => {

  return new Promise((resolve, reject) => {

    const { archivo } = files;
    const nombre = archivo.name.split('.');
    const extension = nombre[nombre.length - 1];

    if (!extensionesValidas.includes(extension)) {
      return reject(`La extensión ${extension} no es permitida: ${extensionesValidas}`);
    }

    const nombreTemp = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject1(err);
      }

      resolve(nombreTemp);
    });
  })
}

module.exports = {
  subirArchivo
}