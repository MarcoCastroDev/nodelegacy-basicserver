
const { request, response } = require('express');
const { User, Categoria, Producto } = require('../models');
const { ObjectId } = require('mongoose').Types;
const coleccionesPermitidas = [
  'users',
  'categoria',
  'producto',
  'roles'
];

const buscarUsers = async (termino = '', res = response) => {
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const user = await User.findById(termino);
    res.json({
      results: (user) ? [user] : [],
    });
  }

  const regex = new RegExp(termino, 'i');

  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ state: true }]
  });

  res.json({
    results: users
  });
}

const buscarCategoria = async (termino = '', res = response) => {
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const categoria = await Categoria.findById(termino)
      .populate('user', 'name');
    res.json({
      results: (categoria) ? [categoria] : [],
    });
  }

  const regex = new RegExp(termino, 'i');

  const categorias = await Categoria.find({ name: regex, state: true })
    .populate('user', 'name');

  res.json({
    results: categorias
  });
}

const buscarProducto = async (termino = '', res = response) => {
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const producto = await Producto.findById(termino)
      .populate('categoria', 'name')
      .populate('user', 'name');
    res.json({
      results: (producto) ? [producto] : [],
    });
  }

  const regex = new RegExp(termino, 'i');

  const productos = await Producto.find({ name: regex, state: true })
    .populate('categoria', 'name')
    .populate('user', 'name');

  res.json({
    results: productos
  });
}

const buscar = (req = request, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
    });
  }

  switch (coleccion) {
    case 'users':
      buscarUsers(termino, res);
      break;
    case 'categoria':
      buscarCategoria(termino, res);
      break;
    case 'producto':
      buscarProducto(termino, res);
      break;
    default:
      res.status(500).json({
        msg: 'Se le olvidó hacer esta búsqueda'
      });
      break;
  }
}

module.exports = {
  buscar,
  buscarUsers,
  buscarCategoria,
  buscarProducto
}