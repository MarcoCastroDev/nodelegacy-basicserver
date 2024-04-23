const { request, response } = require("express");
const { Categoria } = require("../models");

const crearCategoria = async (req = request, res = response) => {
  try {
    const name = req.body.name.toUpperCase();

    const categoriaDB = await Categoria.findOne({ name });

    if (categoriaDB) {
      return res.status(400).json({
        msg: `La categoria ${categoriaDB.name}, ya existe`,
      });
    }

    const data = {
      name,
      user: req.user._id,
    }

    const categoria = await new Categoria(data);
    await categoria.save();
    res.status(201).json(categoria);
  } catch (error) {
    res.status(400).json({
      msg: `Ocurrió un error - ${error}`,
    });
  }
}

// obtener categorias- paginado - total - populate
const getCategorias = async (req = request, res = response) => {
  const { limit = 5, start = 0 } = req.query;
  const query = { state: true };

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .skip(Number(start))
      .limit(Number(limit))
      .populate('user', 'name')
  ]);

  res.json({
    total,
    categorias
  });
}

// obtener categoria - populate
const getCategoriaById = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const categoria = await Categoria.findById(id)
      .populate('user', 'name');

    // Comprueba si el usuario con el id proporcionado existe.
    if (!categoria) {
      return res.status(404).json({
        msg: `No existe categoria con el id ${id}`
      });
    }
    return res.json({
      categoria
    });
  } catch (error) {
    res.status(404).json({
      msg: `Error - ${error}`
    });
  }
}

// actualizar categoria
const putCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, state, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.user._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true }).populate('user', 'name');

  res.json(categoria);
}

// borrar categoria - estado: false
const deleteCategoria = async (req = request, res = response) => {
  const { id } = req.params

  const categoria = await Categoria.findByIdAndUpdate(id, { state: false }, { new: true });

  res.json(categoria);
}

module.exports = {
  crearCategoria,
  getCategorias,
  getCategoriaById,
  putCategoria,
  deleteCategoria,
}