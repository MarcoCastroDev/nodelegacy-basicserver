
const { request, response } = require('express');
const crypt = require('bcryptjs');

const User = require('../models/user');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, img, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: ':P',
        img,
        google: true,
      }

      user = new User(data);
      await user.save();
    }

    console.log(user.state);

    if (!user.state) {
      res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado',
      });
    }

    const token = await generarJWT(user.id);
    console.log(user);

    res.json({
      user,
      token
    });
  } catch (error) {
    res.status(400).json({
      msg: 'El mensaje no se pudo verificar',
    });
  }
}

module.exports = {
  login,
  googleSignIn
}