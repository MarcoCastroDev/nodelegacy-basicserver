
const { request, response } = require('express');

const usersGet = (req = request, res = response) => {
  res.json({
    msg: 'get Api - Controller',
  });
}

const usersPost = (req = request, res = response) => {
  const { nombre, edad } = req.body;
  res.status(201).json({
    msg: 'post Api - Controller',
    nombre,
    edad,
  });
}

const usersPut = (req = request, res = response) => {
  const { q, nombre = 'noname', api } = req.query;
  const id = req.params.id;
  res.json({
    msg: 'put Api - Controller',
    id,
    q,
    nombre,
    api,
  });
}

const usersPatch = (req = request, res = response) => {
  res.json({
    msg: 'patch Api - Controller',
  });
}

const usersDelete = (req = request, res = response) => {
  res.json({
    msg: 'delete Api - Controller',
  });
}

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersPatch,
  usersDelete,
}