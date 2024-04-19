
const { request, response } = require('express');
const crypt = require('bcryptjs');
const User = require('../models/user');

const usersGet = async (req = request, res = response) => {
  const { limit = 5, start = 0 } = req.query;
  const query = { state: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query)
      .skip(Number(start))
      .limit(Number(limit))
  ]);

  res.json({
    total,
    users
  });
}

const usersPost = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // encriptar contraseña
  const salt = crypt.genSaltSync();
  user.password = crypt.hashSync(password, salt);

  await user.save();
  res.status(201).json({
    user,
  });
}

const usersPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...other } = req.body;

  if (password) {
    const salt = crypt.genSaltSync();
    other.password = crypt.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, other);

  res.json(user);
}

const usersPatch = (req = request, res = response) => {
  res.json({
    msg: 'patch Api - Controller',
  });
}

const usersDelete = async (req = request, res = response) => {
  const { id } = req.params

  // Físicamente lo borramos
  // const user = await User.findByIdAndDelete(id);

  // Cambio de estado
  const user = await User.findByIdAndUpdate(id, { state: false });

  res.json(user);
}

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
}