
const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validarJWT = async (req = request, res = response, next) => {
  const token = req.headers['x-token'];
  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la petición',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const user = await User.findById(uid);

    if (!user) {
      res.status(401).json({
        msg: 'Token no válido - usuario no existente',
      });
    }

    if (!user.state) {
      return res.status(401).json({
        msg: 'Token no válido - usuario con estado false',
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log('Error al verificar el token:', error.message);
    res.status(401).json({
      msg: 'Token no válido',
    });
  }
}

module.exports = {
  validarJWT
};