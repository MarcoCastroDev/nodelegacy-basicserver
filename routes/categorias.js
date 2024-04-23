
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { crearCategoria, getCategorias, getCategoriaById, putCategoria, deleteCategoria } = require('../controllers/categorias');
const { existeUserById, existeCategoriaById } = require('../helpers/db-validators');

const router = Router();

// get all categorias - publico
router.get('/', getCategorias);

// get por id categorias - publico
router.get('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeCategoriaById),
  validarCampos,
], getCategoriaById);

// post crear categoria - privado con token valido todos los usuarios
router.post('/', [
  validarJWT,
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  validarCampos
], crearCategoria);

// put actualizar categoria - privado con token valido todos los usuarios
router.put('/:id', [
  validarJWT,
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeCategoriaById),
  validarCampos
], putCategoria);

// delete actualizar categoria - privado con token valido solo admin
router.delete('/:id', [
  validarJWT,
  esAdminRole,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeCategoriaById),
  validarCampos
], deleteCategoria);

module.exports = router;