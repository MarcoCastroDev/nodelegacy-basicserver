
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { cargarArchivo, actualizarImg, mostrarImagen, actualizarImgCloudinary } = require('../controllers/upload');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir } = require('../middlewares');

const router = Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
  validarArchivoSubir,
  check('id', 'No es un ID válido').isMongoId(),
  check('coleccion').custom(c => coleccionesPermitidas(c, ['users', 'producto'])),
  validarCampos,
], actualizarImgCloudinary);

router.get('/:coleccion/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('coleccion').custom(c => coleccionesPermitidas(c, ['users', 'producto'])),
  validarCampos,
], mostrarImagen);

module.exports = router;