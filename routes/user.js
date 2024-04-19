const { Router } = require('express');
const { usersGet, usersPost, usersPut, usersDelete, usersPatch } = require('../controllers/users');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeUserById } = require('../helpers/db-validators');

const router = Router();

router.get('/', usersGet);

router.post('/', [
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'La contraseña debe ser más de 6 letras').isLength({ min: 6 }),
  check('email', 'El formato de correo no es válido').isEmail(),
  check('email').custom(emailExiste),
  check('role').custom(esRoleValido),
  validarCampos
], usersPost);

router.put('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUserById),
  check('role').custom(esRoleValido),
  validarCampos
], usersPut);

router.delete('/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(existeUserById),
  validarCampos
], usersDelete);

router.patch('/', usersPatch);

module.exports = router;