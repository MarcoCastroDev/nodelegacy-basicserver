const { request, response } = require("express");
const { Producto, Categoria } = require("../models");

const crearProducto = async (req = request, res = response) => {
  try {
    const { state, user, ...body } = req.body;

    const productoDB = await Producto.findOne({ name: body.name });

    if (productoDB) {
      return res.status(400).json({
        msg: `El producto ${productoDB.name}, ya existe`,
      });
    }

    const data = {
      ...body,
      name: body.name.toUpperCase(),
      user: req.user._id,
    }

    const producto = await new Producto(data);
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({
      msg: `Ocurrió un error - ${error}`,
    });
  }
}

// obtener categorias- paginado - total - populate
const getProducto = async (req = request, res = response) => {
  const { limit = 5, start = 0 } = req.query;
  const query = { state: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .skip(Number(start))
      .limit(Number(limit))
      .populate('user', 'name')
      .populate('categoria', 'name')
  ]);

  res.json({
    total,
    productos
  });
}

// obtener categoria - populate
const getProductoById = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate('user', 'name')
    .populate('categoria', 'name');
  res.json({
    producto
  });
}

// actualizar categoria
const putProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const { state, user, ...data } = req.body;

  if (data.name) {
    data.name = data.name.toUpperCase();
  }
  data.user = req.user._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json(producto);
}

// borrar categoria - estado: false
const deleteProducto = async (req = request, res = response) => {
  const { id } = req.params

  const producto = await Producto.findByIdAndUpdate(id, { state: false }, { new: true });

  res.json(producto);
}

module.exports = {
  crearProducto,
  getProducto,
  getProductoById,
  putProducto,
  deleteProducto,
}