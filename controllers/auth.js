
const { request, response } = require('express');
const crypt = require('bcryptjs');

const User = require('../models/user');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req = request, res = response) => {

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: 'Email / Password no son correctos - correo',
      });
    }

    if (!user.state) {
      return res.status(400).json({
        msg: 'Email / Password no son correctos - estado: false',
      });
    }

    const validPassword = crypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Email / Password no son correctos - password',
      });
    }

    const token = await generarJWT(user.id);

    res.json({
      // msg: 'Login ok',
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Hable con el administrador',
    });
  }
}

module.exports = {
  login
}