
const Role = require('../models/role');
const User = require('../models/user');

const esRoleValido = async (role = '') => {
  const existeRol = await Role.findOne({ role });
  if (!existeRol) {
    throw new Error(`El rol ${role} no está registrado en la base de datos`);
  }
}

// verificar si correo existe
const emailExiste = async (email = '') => {
  const existeEmail = await User.findOne({ email });
  if (existeEmail) {
    throw new Error(`El email ${email} ya está registrado`);
  }
}

const existeUserById = async (id) => {
  const existeUser = await User.findById(id);
  if (!existeUser) {
    throw new Error(`El usuario con id ${id} no existe`);
  }
}

module.exports = {
  esRoleValido,
  emailExiste,
  existeUserById,
}