
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/config');

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usersPath = '/api/users';
    this.authPath = '/api/auth';
    this.categoriasPath = '/api/categorias'
    this.paths = {
      auth: '/api/auth',
      buscar: '/api/buscar',
      users: '/api/users',
      categorias: '/api/categorias',
      producto: '/api/producto',
    }

    // Conexion DB
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de la aplicación
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // Directorio público
    this.app.use(express.static('public'));

    // Parseo del body
    this.app.use(express.json());

    // CORS
    this.app.use(cors());
  }

  routes() {
    this.app.use(this.paths.users, require('../routes/user'));
    this.app.use(this.paths.auth, require('../routes/auth'));
    this.app.use(this.paths.buscar, require('../routes/buscar'));
    this.app.use(this.paths.categorias, require('../routes/categorias'));
    this.app.use(this.paths.producto, require('../routes/producto'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server escuchando en el puerto ${this.port}`);
    });
  }
}

module.exports = Server;