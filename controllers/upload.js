
const path = require('path');
const { request, response } = require("express");
const { subirArchivo } = require("../helpers");
const { Producto, User } = require("../models");
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async (req = request, res = response) => {

  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({
      msg: 'No hay archivos qué subir'
    });
    return;
  }
  try {
    const allPath = await subirArchivo(req.files, undefined, 'imgs');

    res.json({
      name: allPath
    });
  } catch (msg) {
    res.status(400).json({ msg });
  }
}

const actualizarImg = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'users':
      modelo = await User.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      break;
    case 'producto':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: 'Se le olvidó hacer esta validación'
      });
  }

  if (modelo.img) {
    const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImg)) {
      fs.unlinkSync(pathImg);
    }
  }

  const allPath = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = allPath;
  await modelo.save();

  res.json(modelo);
}

const mostrarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'users':
      modelo = await User.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      break;
    case 'producto':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: 'Se le olvidó hacer esta validación'
      });
  }

  if (modelo.img) {
    const pathImg = path.resolve(__dirname, '../uploads', coleccion, modelo.img);
    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg)
    }
  }

  if (!modelo.img) {
    const pathPlaceholder = path.resolve(__dirname, '../assets/no-image.jpg');
    if (fs.existsSync(pathPlaceholder)) {
      return res.sendFile(pathPlaceholder)
    }
  }
}

const actualizarImgCloudinary = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case 'users':
      modelo = await User.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
      break;
    case 'producto':
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: 'Se le olvidó hacer esta validación'
      });
  }

  if (modelo.img) {
    const nameArr = modelo.img.split('/');
    const name = nameArr[nameArr.length - 1];
    const [public_id] = name.split('.')
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;
  await modelo.save();

  res.json(modelo);
}


module.exports = {
  cargarArchivo,
  actualizarImg,
  mostrarImagen,
  actualizarImgCloudinary,
}