
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { crearProducto, getProducto, getProductoById, putProducto, deleteProducto } = require('../controllers/producto');
const { existeProductoById, existeCategoriaById } = require('../helpers/db-validators');

const router = Router();

router.get('/', getProducto);

router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos,
], getProductoById);

router.post('/', [
  validarJWT,
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('categoria', 'No es un ID válido').isMongoId(),
  check('categoria').custom(existeCategoriaById),
  validarCampos
], crearProducto);

router.put('/:id', [
  validarJWT,
  // check('categoria', 'No es un ID válido').isMongoId(),
  validarCampos
], putProducto);

router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  // check('id').custom(existeProductoById),
  validarCampos
], deleteProducto);

module.exports = router;